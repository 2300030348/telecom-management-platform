package com.telecom.repository;

import com.telecom.model.Subscriber;
import com.telecom.model.SupportTicket;
import com.telecom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findBySubscriber(Subscriber subscriber);
    List<SupportTicket> findByAssignedAgent(User agent);
    List<SupportTicket> findByStatus(String status);
}
