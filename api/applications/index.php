<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$user_id = intval($_GET['user_id'] ?? 0);
$job_id = intval($_GET['job_id'] ?? 0);

$query = "SELECT a.*, j.title as job_title, u.name as applicant_name 
          FROM applications a 
          JOIN jobs j ON a.job_id = j.id 
          JOIN users u ON a.user_id = u.id 
          WHERE 1=1";

if ($user_id > 0) {
    $query .= " AND a.user_id = $user_id";
}
if ($job_id > 0) {
    $query .= " AND a.job_id = $job_id";
}

$query .= " ORDER BY a.created_at DESC";

$result = $conn->query($query);
$applications = [];
while ($row = $result->fetch_assoc()) {
    $applications[] = $row;
}

echo json_encode(["success" => true, "applications" => $applications]);
?>
