package com.telecom.repository;

import com.telecom.model.ServiceBlockingHistory;
import com.telecom.model.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceBlockingHistoryRepository extends JpaRepository<ServiceBlockingHistory, Long> {
    List<ServiceBlockingHistory> findBySubscriber(Subscriber subscriber);
}
