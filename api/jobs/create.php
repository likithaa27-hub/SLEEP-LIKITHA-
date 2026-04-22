<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$employer_id   = intval($data['employer_id'] ?? 0);
$employer_name = $conn->real_escape_string($data['employer_name'] ?? '');
$title         = $conn->real_escape_string($data['title'] ?? '');
$description   = $conn->real_escape_string($data['description'] ?? '');
$locality      = $conn->real_escape_string($data['locality'] ?? '');
$city          = $conn->real_escape_string($data['city'] ?? '');
$state         = $conn->real_escape_string($data['state'] ?? '');
$salary        = $conn->real_escape_string($data['salary'] ?? '');
$working_hours = $conn->real_escape_string($data['workingHours'] ?? '');

$conn->query("INSERT INTO jobs (employer_id, employer_name, title, description, locality, city, state, lat, lng, salary, working_hours)
    VALUES ($employer_id, '$employer_name', '$title', '$description', '$locality', '$city', '$state', $lat, $lng, '$salary', '$working_hours')");

$newId = $conn->insert_id;
$result = $conn->query("SELECT * FROM jobs WHERE id = $newId");
$job = $result->fetch_assoc();

echo json_encode(["success" => true, "job" => $job]);
?>
