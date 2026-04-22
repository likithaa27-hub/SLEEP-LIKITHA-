<?php
session_start();
require_once '../headers.php';
session_destroy();
echo json_encode(["success" => true]);
?>
