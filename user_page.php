<?php

session_start();
if (!isset($_SESSION['email'])) {
    header("Location: index.php");
    exit();
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Job Seeker Dashboard</title>
  <link rel="stylesheet" href="dashboard.css">
</head>
<body>

<div class="container">

  <!-- SIDEBAR -->
  <div class="sidebar">
    <h2>JobConnect</h2>
    <ul>
      <li>Dashboard</li>
      <li>Jobs</li>
      <li>Applications</li>
      <li>Messages</li>
      <li>Saved Jobs</li>
      <li>Profile</li>
    </ul>
  </div>

  <!-- MAIN CONTENT -->
  <div class="main">

    <!-- TOP BAR -->
    <div class="topbar">
      <input type="text" placeholder="Search jobs...">
      <p style="margin-left: 450px; margin-top: 15px;">Welcome, <?= $_SESSION['name'] ?> 👤</p>
      <button class="button" onclick="window.location.href='logout.php'">Logout</button>
      
    </div>

    <!-- HERO -->
    <div class="hero">
      <h1>Find Work Near You</h1>
      <p>Discover blue-collar jobs like construction, plumbing, delivery and more.</p>
      <button class="btn">Find Jobs</button>
    </div>

    <!-- JOB LIST -->
    <h2>Recommended Jobs</h2>
    <div class="jobs">

      <div class="job-card">
        <h3>Construction Worker</h3>
        <p>₹500/day • Nearby</p>
      </div>

      <div class="job-card">
        <h3>Electrician</h3>
        <p>₹700/day • 2 km away</p>
      </div>

      <div class="job-card">
        <h3>Delivery Boy</h3>
        <p>₹400/day • Flexible</p>
      </div>

    </div>

    <!-- MAP SECTION -->
    <h2>Jobs Near You</h2>
    <div class="map">
      <p>📍 Map will be shown here</p>
    </div>

  </div>

</div>

</body>
</html>