<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $conn->real_escape_string($data['email'] ?? '');
$password = $data['password'] ?? '';

$result = $conn->query("SELECT * FROM users WHERE email = '$email'");

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    exit();
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    exit();
}

if ($user['status'] === 'pending') {
    echo json_encode(["success" => false, "message" => "Your account is pending admin verification."]);
    exit();
}

if ($user['status'] === 'rejected') {
    echo json_encode(["success" => false, "message" => "Your account has been rejected by admin."]);
    exit();
}

// Store session
$_SESSION['user_id'] = $user['id'];
$_SESSION['role'] = $user['role'];

// Return user (without password)
unset($user['password']);
echo json_encode(["success" => true, "user" => $user]);
?>
