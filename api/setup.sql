-- Run this in phpMyAdmin > SQL tab
-- Creates the database and all required tables for JobConnect

CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','employer','user') NOT NULL DEFAULT 'user',
  status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  phone VARCHAR(20),
  phone_verified TINYINT(1) NOT NULL DEFAULT 0,
  address VARCHAR(255),
  age INT,
  gender VARCHAR(20),
  skills TEXT,
  experience TEXT,
  job_description_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Admin Account (password: admin)
INSERT IGNORE INTO users (name, email, password, role, status, phone_verified)
VALUES ('Super Admin', 'admin@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'accepted', 1);

-- JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employer_id INT NOT NULL,
  employer_name VARCHAR(100),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  locality VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(100),
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  salary VARCHAR(50),
  working_hours VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  cover_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (job_id, user_id)
);
