package com.telecom.repository;

import com.telecom.model.TelecomPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TelecomPlanRepository extends JpaRepository<TelecomPlan, Long> {
    List<TelecomPlan> findByStatus(String status);
}
