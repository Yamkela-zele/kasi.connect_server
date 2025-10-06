-- Kasi Konnect Database Schema
-- Run this SQL script in phpMyAdmin or MySQL Workbench to create the database

CREATE DATABASE IF NOT EXISTS kasi_konnect;
USE kasi_konnect;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('business_owner', 'freelancer', 'client', 'municipal_worker') NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_by VARCHAR(36),
  verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_verified (verified)
);

-- Business profiles table
CREATE TABLE IF NOT EXISTS businesses (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  services TEXT,
  location VARCHAR(255),
  phone VARCHAR(50),
  registration_number VARCHAR(100),
  website VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_category (category)
);

-- Freelancer profiles table
CREATE TABLE IF NOT EXISTS freelancers (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  skills TEXT,
  experience_years INT,
  hourly_rate DECIMAL(10, 2),
  portfolio_url VARCHAR(255),
  location VARCHAR(255),
  phone VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Jobs/Gigs table
CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  budget DECIMAL(10, 2),
  location VARCHAR(255),
  job_type ENUM('full-time', 'part-time', 'contract', 'gig') DEFAULT 'gig',
  status ENUM('open', 'closed', 'in_progress', 'completed') DEFAULT 'open',
  deadline DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_category (category)
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  cover_letter TEXT,
  proposal TEXT,
  proposed_budget DECIMAL(10, 2),
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_job_id (job_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- Funding applications table
CREATE TABLE IF NOT EXISTS funding_applications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  purpose TEXT NOT NULL,
  business_plan TEXT,
  financial_statements TEXT,
  status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
  reviewed_by VARCHAR(36),
  review_notes TEXT,
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY,
  sender_id VARCHAR(36) NOT NULL,
  recipient_id VARCHAR(36) NOT NULL,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sender_id (sender_id),
  INDEX idx_recipient_id (recipient_id),
  INDEX idx_read_status (read_status)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(36) PRIMARY KEY,
  reviewer_id VARCHAR(36) NOT NULL,
  target_id VARCHAR(36) NOT NULL,
  target_type ENUM('user', 'business') NOT NULL,
  job_id VARCHAR(36),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
  INDEX idx_reviewer_id (reviewer_id),
  INDEX idx_target_id (target_id),
  INDEX idx_rating (rating)
);

-- Sessions table (for JWT token management)
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);
