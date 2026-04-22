<?php
session_start();
require_once '../headers.php';
require_once '../config.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data['id'] ?? 0);

$conn->query("DELETE FROM jobs WHERE id = $id");
echo json_encode(["success" => true, "message" => "Job deleted."]);
?>
