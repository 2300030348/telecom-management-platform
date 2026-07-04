package com.telecom.repository;

import com.telecom.model.CreditLimitAudit;
import com.telecom.model.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditLimitAuditRepository extends JpaRepository<CreditLimitAudit, Long> {
    List<CreditLimitAudit> findBySubscriber(Subscriber subscriber);
}
