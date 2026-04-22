<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$result = $conn->query("SELECT * FROM jobs ORDER BY created_at DESC");

$jobs = [];
while ($row = $result->fetch_assoc()) {
    $jobs[] = $row;
}

echo json_encode(["success" => true, "jobs" => $jobs]);
?>
