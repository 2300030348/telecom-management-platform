package com.telecom.repository;

import com.telecom.model.Recharge;
import com.telecom.model.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RechargeRepository extends JpaRepository<Recharge, Long> {
    List<Recharge> findBySubscriber(Subscriber subscriber);
}
