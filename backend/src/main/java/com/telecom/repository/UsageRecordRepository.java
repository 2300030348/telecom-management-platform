package com.telecom.repository;

import com.telecom.model.Subscriber;
import com.telecom.model.UsageRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsageRecordRepository extends JpaRepository<UsageRecord, Long> {
    List<UsageRecord> findBySubscriber(Subscriber subscriber);
    List<UsageRecord> findBySubscriberAndUsageType(Subscriber subscriber, String usageType);
}
