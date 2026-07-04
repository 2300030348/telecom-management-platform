package com.telecom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_blocking_history")
public class ServiceBlockingHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subscriber_id", nullable = false)
    private Subscriber subscriber;

    @Column(name = "status_changed_to", nullable = false)
    private String statusChangedTo; // ACTIVE, SUSPENDED, BLOCKED

    @Column(name = "triggered_by", nullable = false)
    private String triggeredBy; // SYSTEM_CREDIT_LIMIT, SYSTEM_EXPIRY, ADMIN

    private String reason;

    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt = LocalDateTime.now();

    public ServiceBlockingHistory() {}

    public ServiceBlockingHistory(Subscriber subscriber, String statusChangedTo, String triggeredBy, String reason) {
        this.subscriber = subscriber;
        this.statusChangedTo = statusChangedTo;
        this.triggeredBy = triggeredBy;
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

    public String getStatusChangedTo() {
        return statusChangedTo;
    }

    public void setStatusChangedTo(String statusChangedTo) {
        this.statusChangedTo = statusChangedTo;
    }

    public String getTriggeredBy() {
        return triggeredBy;
    }

    public void setTriggeredBy(String triggeredBy) {
        this.triggeredBy = triggeredBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getTriggeredAt() {
        return triggeredAt;
    }

    public void setTriggeredAt(LocalDateTime triggeredAt) {
        this.triggeredAt = triggeredAt;
    }
}
