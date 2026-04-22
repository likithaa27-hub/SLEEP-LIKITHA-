<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$id     = intval($data['id'] ?? 0);
$status = $conn->real_escape_string($data['status'] ?? '');

if (!in_array($status, ['accepted', 'rejected', 'pending'])) {
    echo json_encode(["success" => false, "message" => "Invalid status."]);
    exit();
}

$conn->query("UPDATE users SET status = '$status' WHERE id = $id");
echo json_encode(["success" => true, "message" => "User status updated to $status."]);
?>
