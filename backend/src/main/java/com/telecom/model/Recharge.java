package com.telecom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recharges")
public class Recharge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subscriber_id", nullable = false)
    private Subscriber subscriber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id")
    private TelecomPlan plan;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "payment_method")
    private String paymentMethod; // UPI, CARD, NET_BANKING

    @Column(name = "transaction_status")
    private String transactionStatus = "PENDING"; // PENDING, SUCCESS, FAILED

    @Column(name = "transaction_reference", unique = true)
    private String transactionReference;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Recharge() {}

    public Recharge(Subscriber subscriber, TelecomPlan plan, Double amount, String paymentMethod, String transactionStatus, String transactionReference) {
        this.subscriber = subscriber;
        this.plan = plan;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.transactionStatus = transactionStatus;
        this.transactionReference = transactionReference;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Subscriber getSubscriber() {
        return subscriber;
    }

    public void setSubscriber(Subscriber subscriber) {
        this.subscriber = subscriber;
    }

    public TelecomPlan getPlan() {
        return plan;
    }

    public void setPlan(TelecomPlan plan) {
        this.plan = plan;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
