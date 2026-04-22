<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$name     = $conn->real_escape_string($data['name'] ?? '');
$email    = $conn->real_escape_string($data['email'] ?? '');
$password = password_hash($data['password'] ?? '', PASSWORD_DEFAULT);
$role     = $conn->real_escape_string($data['role'] ?? 'user');

// Check if email exists
$check = $conn->query("SELECT id FROM users WHERE email = '$email'");
if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    exit();
}

// Admins are auto-accepted; all others are pending
$status = ($role === 'admin') ? 'accepted' : 'pending';

$conn->query("INSERT INTO users (name, email, password, role, status) VALUES ('$name', '$email', '$password', '$role', '$status')");

echo json_encode(["success" => true, "message" => "Registration successful! Please wait for admin approval."]);
?>
