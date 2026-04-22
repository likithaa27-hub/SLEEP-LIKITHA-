<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$result = $conn->query("SELECT id, name, email, role, status, phone, address, age, gender, skills, experience, job_description_info, created_at FROM users ORDER BY created_at DESC");

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode(["success" => true, "users" => $users]);
?>
