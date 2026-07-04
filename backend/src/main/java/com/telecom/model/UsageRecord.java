package com.telecom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usage_records")
public class UsageRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subscriber_id", nullable = false)
    private Subscriber subscriber;

    @Column(name = "usage_type", nullable = false)
    private String usageType; // DATA, VOICE, SMS

    @Column(name = "amount_used", nullable = false)
    private Double amountUsed; // bytes for data, seconds for voice, count for SMS

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    public UsageRecord() {}

    public UsageRecord(Subscriber subscriber, String usageType, Double amountUsed) {
        this.subscriber = subscriber;
        this.usageType = usageType;
        this.amountUsed = amountUsed;
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

    public String getUsageType() {
        return usageType;
    }

    public void setUsageType(String usageType) {
        this.usageType = usageType;
    }

    public Double getAmountUsed() {
        return amountUsed;
    }

    public void setAmountUsed(Double amountUsed) {
        this.amountUsed = amountUsed;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
