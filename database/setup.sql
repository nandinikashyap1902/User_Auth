-- Create database
CREATE DATABASE IF NOT EXISTS user_auth_db;
USE user_auth_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Insert sample data (optional)
-- Note: Password is 'Password123' hashed with bcrypt
INSERT INTO users (first_name, last_name, email, password, phone, date_of_birth) VALUES
('John', 'Doe', 'john.doe@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukXGNUOAW', '+1234567890', '1990-01-15'),
('Jane', 'Smith', 'jane.smith@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukXGNUOAW', '+0987654321', '1992-05-20')
ON DUPLICATE KEY UPDATE id=id;
