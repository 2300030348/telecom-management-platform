package com.telecom.repository;

import com.telecom.model.SupportTicket;
import com.telecom.model.TicketReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketReplyRepository extends JpaRepository<TicketReply, Long> {
    List<TicketReply> findByTicket(SupportTicket ticket);
}
