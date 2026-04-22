<?php

session_start();
require_once 'config.php';

if (isset($_POST['send_otp'])) {
    $phone = trim($_POST['phone'] ?? '');

    if (!preg_match('/^[0-9]{10}$/', $phone)) {
        $_SESSION['register_error'] = 'Enter a valid 10-digit phone number.';
        $_SESSION['active_form'] = 'register';
        header("Location: login1.php");
        exit();
    }

    $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $_SESSION['otp_phone'] = $phone;
    $_SESSION['otp_code'] = $otp;
    $_SESSION['phone_verified'] = false;
    $_SESSION['register_success'] = "OTP sent successfully. Demo OTP: $otp";
    $_SESSION['active_form'] = 'register';
    header("Location: login1.php");
    exit();
}

if (isset($_POST['verify_otp'])) {
    $phone = trim($_POST['phone'] ?? '');
    $otp = trim($_POST['otp'] ?? '');

    if (
        isset($_SESSION['otp_phone'], $_SESSION['otp_code']) &&
        $_SESSION['otp_phone'] === $phone &&
        $_SESSION['otp_code'] === $otp
    ) {
        $_SESSION['phone_verified'] = true;
        $_SESSION['verified_phone'] = $phone;
        unset($_SESSION['otp_code']);
        $_SESSION['register_success'] = 'Phone number verified successfully. You can now register.';
    } else {
        $_SESSION['register_error'] = 'Invalid OTP or phone number mismatch.';
    }

    $_SESSION['active_form'] = 'register';
    header("Location: login1.php");
    exit();
}

if (isset($_POST['register'])) {
   $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone'] ?? '');
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role = strtolower(trim($_POST['role']));

    $allowedRoles = ['admin', 'employer', 'user'];
    if (!in_array($role, $allowedRoles, true)) {
        $_SESSION['register_error'] = 'Invalid role selected.';
        $_SESSION['active_form'] = 'register';
        header("Location: login1.php");
        exit();
    }

    if (!isset($_SESSION['phone_verified'], $_SESSION['verified_phone']) || $_SESSION['phone_verified'] !== true || $_SESSION['verified_phone'] !== $phone) {
        $_SESSION['register_error'] = 'Please verify your phone number before registering.';
        $_SESSION['active_form'] = 'register';
        header("Location: login1.php");
        exit();
    }

    $checkEmail = $conn->query("SELECT email FROM users WHERE email = '$email'");
    if ($checkEmail->num_rows > 0) {
        $_SESSION['register_error'] = 'Email is already registered!';
        $_SESSION['active_form'] = 'register';
    } else {
        $conn->query("INSERT INTO users (name, email, password, role, phone, phone_verified) VALUES ('$name', '$email', '$password', '$role', '$phone', 1)");
        unset($_SESSION['phone_verified'], $_SESSION['verified_phone'], $_SESSION['otp_phone']);
        $_SESSION['register_success'] = 'Registration successful. Please login.';
    }    

    header("Location: login1.php");
    exit();
}
if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $result = $conn->query("SELECT * FROM users WHERE email = '$email'");
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['name'] = $user['name'];
            $_SESSION['email'] = $user['email'];

            if ($user['role'] === 'admin') {
                header("Location: admin_page.php");
            } 
            elseif ($user['role'] === 'user'){
                header("Location: user_page.php");
            }
            else{
                header("Location: employer_page.php");
            }
            exit();
        }
    }

    $_SESSION['login_error'] = 'Incorrect email or password';
    $_SESSION['active_form'] = 'login';
    header("Location: login1.php");
    exit();
}

?>