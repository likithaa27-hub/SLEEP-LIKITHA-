<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$job_id = intval($data['job_id'] ?? 0);
$user_id = intval($data['user_id'] ?? 0);
$cover_message = $conn->real_escape_string($data['cover_message'] ?? '');

if ($job_id === 0 || $user_id === 0) {
    echo json_encode(["success" => false, "message" => "Invalid job or user ID."]);
    exit();
}

// Check if already applied
$check = $conn->query("SELECT id FROM applications WHERE job_id = $job_id AND user_id = $user_id");
if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "You have already applied for this job."]);
    exit();
}

$sql = "INSERT INTO applications (job_id, user_id, cover_message) VALUES ($job_id, $user_id, '$cover_message')";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Application submitted successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Error submitting application: " . $conn->error]);
}
?>
