<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$id                  = intval($data['id'] ?? 0);
$phone               = $conn->real_escape_string($data['phone'] ?? '');
$address             = $conn->real_escape_string($data['address'] ?? '');
$age                 = intval($data['age'] ?? 0);
$gender              = $conn->real_escape_string($data['gender'] ?? '');
$skills              = $conn->real_escape_string($data['skills'] ?? '');
$experience          = $conn->real_escape_string($data['experience'] ?? '');
$job_description_info = $conn->real_escape_string($data['jobDescriptionInfo'] ?? '');

$conn->query("UPDATE users SET 
    phone = '$phone',
    address = '$address',
    age = $age,
    gender = '$gender',
    skills = '$skills',
    experience = '$experience',
    job_description_info = '$job_description_info'
    WHERE id = $id");

// Return updated user
$result = $conn->query("SELECT id, name, email, role, status, phone, address, age, gender, skills, experience, job_description_info FROM users WHERE id = $id");
$user = $result->fetch_assoc();
echo json_encode(["success" => true, "user" => $user]);
?>
