<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli('localhost', 'root', '');

if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected to MySQL.<br>";

// Create database
if ($conn->query("CREATE DATABASE IF NOT EXISTS users_db")) {
    echo "✅ Database <strong>users_db</strong> created (or already exists).<br>";
} else {
    die("❌ Error creating database: " . $conn->error);
}

$conn->select_db("users_db");

// Create users table
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','employer','user') NOT NULL DEFAULT 'user',
    phone VARCHAR(20),
    phone_verified TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql)) {
    echo "✅ <strong>users</strong> table created (or already exists).<br>";
} else {
    echo "❌ Error creating users table: " . $conn->error . "<br>";
}

// Create jobs table
$sql2 = "CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    salary VARCHAR(100),
    description TEXT,
    employer_id INT,
    status ENUM('open','closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql2)) {
    echo "✅ <strong>jobs</strong> table created (or already exists).<br>";
} else {
    echo "❌ Error creating jobs table: " . $conn->error . "<br>";
}

echo "<br><strong>🎉 Setup complete!</strong> You can now <a href='login1.php'>go to the login page</a>.";
$conn->close();
?>
