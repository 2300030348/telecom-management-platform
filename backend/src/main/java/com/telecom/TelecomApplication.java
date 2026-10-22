package com.telecom;

import com.telecom.model.*;
import com.telecom.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.HashSet;

@SpringBootApplication
public class TelecomApplication {
    public static void main(String[] args) {
        SpringApplication.run(TelecomApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            SubscriberRepository subscriberRepository,
            TelecomPlanRepository telecomPlanRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                // Seed Admin: admin
                if (userRepository.findByUsername("admin").isEmpty()) {
                    User admin = new User("admin", "admin@aeronet.com", passwordEncoder.encode("password"));
                    admin.setRoles(new HashSet<>(Collections.singletonList(ERole.ROLE_ADMIN)));
                    userRepository.save(admin);
                }

                // Seed Admin: 2300030348
                if (userRepository.findByUsername("2300030348").isEmpty()) {
                    User userRoll = new User("2300030348", "2300030348@kluniversity.in", passwordEncoder.encode("password"));
                    userRoll.setRoles(new HashSet<>(Collections.singletonList(ERole.ROLE_ADMIN)));
                    userRepository.save(userRoll);
                }

                // Seed Support Agent: agent
                if (userRepository.findByUsername("agent").isEmpty()) {
                    User agent = new User("agent", "agent@aeronet.com", passwordEncoder.encode("password"));
                    agent.setRoles(new HashSet<>(Collections.singletonList(ERole.ROLE_SUPPORT)));
                    userRepository.save(agent);
                }

                // Seed Customer: customer
                if (userRepository.findByUsername("customer").isEmpty()) {
                    User customer = new User("customer", "customer@aeronet.com", passwordEncoder.encode("password"));
                    customer.setRoles(new HashSet<>(Collections.singletonList(ERole.ROLE_CUSTOMER)));
                    User savedCustomer = userRepository.save(customer);

                    Subscriber sub = new Subscriber(
                            savedCustomer,
                            "Regular",
                            "Customer",
                            "+1 555-0312",
                            "ACTIVE",
                            "PREPAID",
                            0.0,
                            25.0
                    );
                    subscriberRepository.save(sub);
                }

                // Seed Customer: prasad
                if (userRepository.findByUsername("prasad").isEmpty()) {
                    User prasad = new User("prasad", "prasad@aeronet.com", passwordEncoder.encode("password"));
                    prasad.setRoles(new HashSet<>(Collections.singletonList(ERole.ROLE_CUSTOMER)));
                    User savedPrasad = userRepository.save(prasad);

                    Subscriber sub = new Subscriber(
                            savedPrasad,
                            "Prasad",
                            "Rao",
                            "+1 555-1043",
                            "ACTIVE",
                            "POSTPAID",
                            200.0,
                            45.80
                    );
                    subscriberRepository.save(sub);
                }

                // Seed Telecom Plans if catalog is empty
                if (telecomPlanRepository.count() == 0) {
                    telecomPlanRepository.save(new TelecomPlan(
                            "Unlimited Cyber 5G", "POSTPAID", 100.0, 99999, 99999, 49.99, 30, 500, "ACTIVE"
                    ));
                    telecomPlanRepository.save(new TelecomPlan(
                            "Student Super", "PREPAID", 20.0, 1000, 500, 19.99, 28, 50, "ACTIVE"
                    ));
                    telecomPlanRepository.save(new TelecomPlan(
                            "Enterprise Giga", "POSTPAID", 1000.0, 99999, 99999, 149.99, 30, 1000, "ACTIVE"
                    ));
                    telecomPlanRepository.save(new TelecomPlan(
                            "Silver Prepaid", "PREPAID", 10.0, 500, 100, 9.99, 14, 25, "ACTIVE"
                    ));
                }
            } catch (Exception e) {
                System.err.println("InitData seeding notice: " + e.getMessage());
            }
        };
    }
}
