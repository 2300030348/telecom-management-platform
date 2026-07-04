package com.telecom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subscriber_id", nullable = false)
    private Subscriber subscriber;

    @Column(name = "bill_period_start", nullable = false)
    private LocalDateTime billPeriodStart;

    @Column(name = "bill_period_end", nullable = false)
    private LocalDateTime billPeriodEnd;

    @Column(name = "amount_due", nullable = false)
    private Double amountDue;

    @Column(name = "tax_amount")
    private Double taxAmount;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Column(nullable = false)
    private String status = "UNPAID"; // PAID, UNPAID, OVERDUE

    @Column(name = "generated_at")
    private LocalDateTime generatedAt = LocalDateTime.now();

    public Bill() {}

    public Bill(Subscriber subscriber, LocalDateTime billPeriodStart, LocalDateTime billPeriodEnd, Double amountDue, Double taxAmount, LocalDateTime dueDate, String status) {
        this.subscriber = subscriber;
        this.billPeriodStart = billPeriodStart;
        this.billPeriodEnd = billPeriodEnd;
        this.amountDue = amountDue;
        this.taxAmount = taxAmount;
        this.dueDate = dueDate;
        this.status = status;
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

    public LocalDateTime getBillPeriodStart() {
        return billPeriodStart;
    }

    public void setBillPeriodStart(LocalDateTime billPeriodStart) {
        this.billPeriodStart = billPeriodStart;
    }

    public LocalDateTime getBillPeriodEnd() {
        return billPeriodEnd;
    }

    public void setBillPeriodEnd(LocalDateTime billPeriodEnd) {
        this.billPeriodEnd = billPeriodEnd;
    }

    public Double getAmountDue() {
        return amountDue;
    }

    public void setAmountDue(Double amountDue) {
        this.amountDue = amountDue;
    }

    public Double getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(Double taxAmount) {
        this.taxAmount = taxAmount;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
