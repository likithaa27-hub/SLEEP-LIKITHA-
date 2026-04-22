<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . "\n");
}
echo "Connected to host.\n";

if ($conn->query("CREATE DATABASE IF NOT EXISTS job_portal")) {
    echo "Database job_portal created or already exists.\n";
} else {
    echo "Error creating database: " . $conn->error . "\n";
}

$conn->select_db("job_portal");

// Simple user table create as test
$sql = "CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','employer','user') NOT NULL DEFAULT 'user',
  status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  phone VARCHAR(20),
  phone_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql)) {
    echo "Users table created successfully.\n";
} else {
    echo "Error creating users table: " . $conn->error . "\n";
}
?>
