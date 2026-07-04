package com.telecom.repository;

import com.telecom.model.Subscriber;
import com.telecom.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findBySubscriber(Subscriber subscriber);
    Optional<Subscription> findBySubscriberAndStatus(Subscriber subscriber, String status);
}
