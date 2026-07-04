package com.telecom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_limit_audits")
public class CreditLimitAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subscriber_id", nullable = false)
    private Subscriber subscriber;

    @Column(name = "old_limit")
    private Double oldLimit;

    @Column(name = "new_limit", nullable = false)
    private Double newLimit;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "changed_by_user_id")
    private User changedBy;

    private String reason;

    @Column(name = "changed_at")
    private LocalDateTime changedAt = LocalDateTime.now();

    public CreditLimitAudit() {}

    public CreditLimitAudit(Subscriber subscriber, Double oldLimit, Double newLimit, User changedBy, String reason) {
        this.subscriber = subscriber;
        this.oldLimit = oldLimit;
        this.newLimit = newLimit;
        this.changedBy = changedBy;
        this.reason = reason;
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

    public Double getOldLimit() {
        return oldLimit;
    }

    public void setOldLimit(Double oldLimit) {
        this.oldLimit = oldLimit;
    }

    public Double getNewLimit() {
        return newLimit;
    }

    public void setNewLimit(Double newLimit) {
        this.newLimit = newLimit;
    }

    public User getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(User changedBy) {
        this.changedBy = changedBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }
}
