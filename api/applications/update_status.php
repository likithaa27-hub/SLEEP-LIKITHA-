<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$app_id = intval($data['id'] ?? 0);
$status = $conn->real_escape_string($data['status'] ?? '');

if ($app_id === 0 || !in_array($status, ['pending', 'accepted', 'rejected'])) {
    echo json_encode(["success" => false, "message" => "Invalid application ID or status."]);
    exit();
}

$sql = "UPDATE applications SET status = '$status' WHERE id = $app_id";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Application status updated to $status."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating status: " . $conn->error]);
}
?>
