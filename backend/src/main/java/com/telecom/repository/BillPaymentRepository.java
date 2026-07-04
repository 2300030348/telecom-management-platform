package com.telecom.repository;

import com.telecom.model.Bill;
import com.telecom.model.BillPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillPaymentRepository extends JpaRepository<BillPayment, Long> {
    List<BillPayment> findByBill(Bill bill);
}
