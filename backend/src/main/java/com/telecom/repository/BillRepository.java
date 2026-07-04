package com.telecom.repository;

import com.telecom.model.Bill;
import com.telecom.model.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findBySubscriber(Subscriber subscriber);
    List<Bill> findBySubscriberAndStatus(Subscriber subscriber, String status);
}
