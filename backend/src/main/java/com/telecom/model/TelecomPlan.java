package com.telecom.model;

import jakarta.persistence.*;

@Entity
@Table(name = "telecom_plans")
public class TelecomPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // PREPAID, POSTPAID

    @Column(name = "data_limit_gb")
    private Double dataLimitGb;

    @Column(name = "voice_limit_minutes")
    private Integer voiceLimitMinutes;

    @Column(name = "sms_limit")
    private Integer smsLimit;

    @Column(nullable = false)
    private Double price;

    @Column(name = "validity_days")
    private Integer validityDays;

    @Column(name = "speed_limit_mbps")
    private Integer speedLimitMbps;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, ARCHIVED

    public TelecomPlan() {}

    public TelecomPlan(String name, String type, Double dataLimitGb, Integer voiceLimitMinutes, Integer smsLimit, Double price, Integer validityDays, Integer speedLimitMbps, String status) {
        this.name = name;
        this.type = type;
        this.dataLimitGb = dataLimitGb;
        this.voiceLimitMinutes = voiceLimitMinutes;
        this.smsLimit = smsLimit;
        this.price = price;
        this.validityDays = validityDays;
        this.speedLimitMbps = speedLimitMbps;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getDataLimitGb() {
        return dataLimitGb;
    }

    public void setDataLimitGb(Double dataLimitGb) {
        this.dataLimitGb = dataLimitGb;
    }

    public Integer getVoiceLimitMinutes() {
        return voiceLimitMinutes;
    }

    public void setVoiceLimitMinutes(Integer voiceLimitMinutes) {
        this.voiceLimitMinutes = voiceLimitMinutes;
    }

    public Integer getSmsLimit() {
        return smsLimit;
    }

    public void setSmsLimit(Integer smsLimit) {
        this.smsLimit = smsLimit;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getValidityDays() {
        return validityDays;
    }

    public void setValidityDays(Integer validityDays) {
        this.validityDays = validityDays;
    }

    public Integer getSpeedLimitMbps() {
        return speedLimitMbps;
    }

    public void setSpeedLimitMbps(Integer speedLimitMbps) {
        this.speedLimitMbps = speedLimitMbps;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
