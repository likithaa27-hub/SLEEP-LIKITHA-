<?php
require_once 'api/config.php';
$result = $conn->query("SHOW TABLES");
if ($result) {
    $tables = [];
    while ($row = $result->fetch_array()) {
        $tables[] = $row[0];
    }
    echo "Connected successfully. Tables: " . implode(", ", $tables);
} else {
    echo "Query failed: " . $conn->error;
}
?>
