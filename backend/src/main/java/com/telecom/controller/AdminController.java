package com.telecom.controller;

import com.telecom.model.Subscriber;
import com.telecom.model.TelecomPlan;
import com.telecom.repository.SubscriberRepository;
import com.telecom.repository.TelecomPlanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasRole('ADMIN')")
public class AdminController {
    private final SubscriberRepository subscriberRepository;
    private final TelecomPlanRepository telecomPlanRepository;

    public AdminController(SubscriberRepository subscriberRepository, TelecomPlanRepository telecomPlanRepository) {
        this.subscriberRepository = subscriberRepository;
        this.telecomPlanRepository = telecomPlanRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<Subscriber> subs = subscriberRepository.findAll();
        long totalSubscribers = subs.size();
        long activeSubscribers = subs.stream().filter(s -> "ACTIVE".equalsIgnoreCase(s.getStatus())).count();
        long blockedSubscribers = subs.stream().filter(s -> "BLOCKED".equalsIgnoreCase(s.getStatus()) || "SUSPENDED".equalsIgnoreCase(s.getStatus())).count();
        long totalPlans = telecomPlanRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSubscribers", totalSubscribers);
        stats.put("activeSubscribers", activeSubscribers);
        stats.put("blockedSubscribers", blockedSubscribers);
        stats.put("totalPlans", totalPlans);
        stats.put("monthlyRevenue", 45820.00); // Demo metric
        stats.put("pendingBills", 142); // Demo metric

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/subscribers")
    public ResponseEntity<List<Subscriber>> getAllSubscribers() {
        return ResponseEntity.ok(subscriberRepository.findAll());
    }

    @GetMapping("/plans")
    public ResponseEntity<List<TelecomPlan>> getAllPlans() {
        return ResponseEntity.ok(telecomPlanRepository.findAll());
    }

    @PostMapping("/plans")
    public ResponseEntity<?> createPlan(@RequestBody TelecomPlan plan) {
        try {
            TelecomPlan saved = telecomPlanRepository.save(plan);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new HashMap<String, String>() {{
                put("message", "Error creating plan: " + e.getMessage());
            }});
        }
    }
}
