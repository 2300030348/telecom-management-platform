package com.telecom.controller;

import com.telecom.model.*;
import com.telecom.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final UserRepository userRepository;
    private final SubscriberRepository subscriberRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final TelecomPlanRepository planRepository;
    private final RechargeRepository rechargeRepository;
    private final BillRepository billRepository;

    public CustomerController(UserRepository userRepository, SubscriberRepository subscriberRepository,
                              SubscriptionRepository subscriptionRepository, TelecomPlanRepository planRepository,
                              RechargeRepository rechargeRepository, BillRepository billRepository) {
        this.userRepository = userRepository;
        this.subscriberRepository = subscriberRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.rechargeRepository = rechargeRepository;
        this.billRepository = billRepository;
    }

    private Subscriber getAuthenticatedSubscriber() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found"));
        return subscriberRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Error: Subscriber profile not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            Subscriber subscriber = getAuthenticatedSubscriber();
            return ResponseEntity.ok(subscriber);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }

    @GetMapping("/subscription")
    public ResponseEntity<?> getSubscription() {
        try {
            Subscriber subscriber = getAuthenticatedSubscriber();
            Optional<Subscription> subscriptionOpt = subscriptionRepository.findBySubscriberAndStatus(subscriber, "ACTIVE");
            if (subscriptionOpt.isPresent()) {
                return ResponseEntity.ok(subscriptionOpt.get());
            }
            return ResponseEntity.ok(new HashMap<String, Object>() {{
                put("active", false);
                put("message", "No active subscription found");
            }});
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }

    @GetMapping("/bills")
    public ResponseEntity<?> getBills() {
        try {
            Subscriber subscriber = getAuthenticatedSubscriber();
            List<Bill> bills = billRepository.findBySubscriber(subscriber);
            return ResponseEntity.ok(bills);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }

    @PostMapping("/recharge")
    public ResponseEntity<?> processRecharge(@RequestBody Map<String, Object> payload) {
        try {
            Subscriber subscriber = getAuthenticatedSubscriber();
            
            Long planId = Long.valueOf(payload.get("planId").toString());
            String paymentMethod = payload.get("paymentMethod") != null ? payload.get("paymentMethod").toString() : "CARD";
            Double amount = Double.valueOf(payload.get("amount").toString());

            TelecomPlan plan = planRepository.findById(planId)
                    .orElseThrow(() -> new RuntimeException("Plan not found"));

            // 1. Log the recharge
            String txnRef = "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            Recharge recharge = new Recharge(
                    subscriber,
                    plan,
                    amount,
                    paymentMethod,
                    "SUCCESS",
                    txnRef
            );
            rechargeRepository.save(recharge);

            // 2. Expire any existing active subscription
            Optional<Subscription> activeSubOpt = subscriptionRepository.findBySubscriberAndStatus(subscriber, "ACTIVE");
            if (activeSubOpt.isPresent()) {
                Subscription oldSub = activeSubOpt.get();
                oldSub.setStatus("EXPIRED");
                subscriptionRepository.save(oldSub);
            }

            // 3. Create new active subscription
            LocalDateTime start = LocalDateTime.now();
            LocalDateTime end = start.plusDays(plan.getValidityDays() != null ? plan.getValidityDays() : 30);
            Subscription subscription = new Subscription(
                    subscriber,
                    plan,
                    start,
                    end,
                    "ACTIVE",
                    true
            );
            subscriptionRepository.save(subscription);

            // 4. Update subscriber balance/billing type
            subscriber.setBillingType(plan.getType());
            if ("PREPAID".equalsIgnoreCase(plan.getType())) {
                // For prepaid recharges, we add the balance
                subscriber.setBalance((subscriber.getBalance() != null ? subscriber.getBalance() : 0.0) + amount);
                subscriber.setCreditLimit(0.0);
            } else {
                // For postpaid, we update their credit limit and reset balance due
                subscriber.setCreditLimit(plan.getPrice() * 2.0); // credit limit = 2x plan price
                subscriber.setBalance(0.0);
            }
            subscriberRepository.save(subscriber);

            // If postpaid, auto-create a generated bill for transparency
            if ("POSTPAID".equalsIgnoreCase(plan.getType())) {
                Bill bill = new Bill(
                        subscriber,
                        start,
                        end,
                        plan.getPrice(),
                        plan.getPrice() * 0.15, // 15% tax
                        end.plusDays(5), // due 5 days after period ends
                        "UNPAID"
                );
                billRepository.save(bill);
            }

            return ResponseEntity.ok(new HashMap<String, String>() {{
                put("message", "Recharge successful! Your subscription has been updated.");
                put("transactionReference", txnRef);
            }});

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new HashMap<String, String>() {{
                put("message", "Recharge failed: " + e.getMessage());
            }});
        }
    }

    @GetMapping("/plans")
    public ResponseEntity<?> getActivePlans() {
        try {
            List<TelecomPlan> plans = planRepository.findByStatus("ACTIVE");
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new HashMap<String, String>() {{
                put("message", e.getMessage());
            }});
        }
    }
}
