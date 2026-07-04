-- Seed initial roles and users using auto-generated IDs
-- Default passwords are all: "password"
INSERT INTO users (username, email, password) VALUES 
('admin', 'admin@aeronet.com', '$2a$10$8tE.uU/qC/e5wD3K.P9VVu3e2Bv2.dO2N2Lw3e52v8sK/e53j.8vG'),
('agent', 'agent@aeronet.com', '$2a$10$8tE.uU/qC/e5wD3K.P9VVu3e2Bv2.dO2N2Lw3e52v8sK/e53j.8vG'),
('customer', 'customer@aeronet.com', '$2a$10$8tE.uU/qC/e5wD3K.P9VVu3e2Bv2.dO2N2Lw3e52v8sK/e53j.8vG'),
('prasad', 'prasad@aeronet.com', '$2a$10$8tE.uU/qC/e5wD3K.P9VVu3e2Bv2.dO2N2Lw3e52v8sK/e53j.8vG');

-- Seed user roles using subqueries to find user IDs dynamically
INSERT INTO user_roles (user_id, role_name) VALUES 
((SELECT id FROM users WHERE username = 'admin'), 'ROLE_ADMIN'),
((SELECT id FROM users WHERE username = 'agent'), 'ROLE_SUPPORT'),
((SELECT id FROM users WHERE username = 'customer'), 'ROLE_CUSTOMER'),
((SELECT id FROM users WHERE username = 'prasad'), 'ROLE_CUSTOMER');

-- Seed initial plans using auto-generated IDs
INSERT INTO telecom_plans (name, type, data_limit_gb, voice_limit_minutes, sms_limit, price, validity_days, speed_limit_mbps, status) VALUES 
('Unlimited Cyber 5G', 'POSTPAID', 100.0, 99999, 99999, 49.99, 30, 500, 'ACTIVE'),
('Student Super', 'PREPAID', 20.0, 1000, 500, 19.99, 28, 50, 'ACTIVE'),
('Enterprise Giga', 'POSTPAID', 1000.0, 99999, 99999, 149.99, 30, 1000, 'ACTIVE'),
('Silver Prepaid', 'PREPAID', 10.0, 500, 100, 9.99, 14, 25, 'ACTIVE');

-- Seed initial subscribers using subqueries to find user IDs dynamically
INSERT INTO subscribers (user_id, first_name, last_name, phone_number, status, billing_type, credit_limit, balance, created_at) VALUES 
((SELECT id FROM users WHERE username = 'customer'), 'Regular', 'Customer', '+1 555-0312', 'ACTIVE', 'PREPAID', 0.0, 15.50, CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE username = 'prasad'), 'Prasad', 'Rao', '+1 555-1043', 'ACTIVE', 'POSTPAID', 200.0, 45.80, CURRENT_TIMESTAMP);
