<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$conn->query("CREATE DATABASE IF NOT EXISTS job_portal");
$conn->select_db("job_portal");

// Run the SQL script content
$sql = file_get_contents('api/setup.sql');
// Remove the database creation parts from the string since we handled them
$sql = preg_replace('/CREATE DATABASE IF NOT EXISTS.*;/', '', $sql);
$sql = preg_replace('/USE .*?;/', '', $sql);

if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->next_result());
    echo "Database and tables initialized successfully.";
} else {
    echo "Error: " . $conn->error;
}
$conn->close();
?>
