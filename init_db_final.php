<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    file_put_contents('db_init_log.txt', "Connection failed: " . $conn->connect_error . "\n", FILE_APPEND);
    die();
}

$conn->query("CREATE DATABASE IF NOT EXISTS job_portal");
$conn->select_db("job_portal");

$sql = file_get_contents('api/setup.sql');
$sql = preg_replace('/CREATE DATABASE IF NOT EXISTS.*;/', '', $sql);
$sql = preg_replace('/USE .*?;/', '', $sql);

if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->next_result());
    file_put_contents('db_init_log.txt', "Success: Database and tables initialized.\n", FILE_APPEND);
} else {
    file_put_contents('db_init_log.txt', "Error: " . $conn->error . "\n", FILE_APPEND);
}
$conn->close();
?>
