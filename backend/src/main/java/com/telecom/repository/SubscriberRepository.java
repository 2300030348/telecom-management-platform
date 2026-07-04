package com.telecom.repository;

import com.telecom.model.Subscriber;
import com.telecom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
    Optional<Subscriber> findByUser(User user);
    Optional<Subscriber> findByPhoneNumber(String phoneNumber);
}
