<?php

session_start();

$errors = [
    'login' => $_SESSION['login_error'] ?? '',
    'register' => $_SESSION['register_error'] ?? '',
    'register_success' => $_SESSION['register_success'] ?? ''
];
$activeForm = $_SESSION['active_form'] ?? 'login';

session_unset();

function showError($error) {
    return !empty($error) ? "<p class='error-message'>$error</p>" : '';
}
function showSuccess($message) {
    return !empty($message) ? "<p class='success-message'>$message</p>" : '';
}

function isActiveForm($formName, $activeForm) {
    return $formName === $activeForm ? 'active' : '';
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="styles1.css">
</head>

 <body1 style="background: #111; color: white; display:flex; justify-content:center; align-items:center; height:100vh;">

    <div class="container">
        <div class="form-box <?= isActiveForm('login', $activeForm); ?>" id="login-form">
            <form action="login_register.php" method="post">
                <h2>Login</h2>
                <?= showError($errors['login']); ?>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit" name="login">Login</button>
                <p1>Don't have an account? <a href="#" onclick="showForm('register-form')">Register</a></p1>
            </form>
        </div>

        <div class="form-box <?= isActiveForm('register', $activeForm); ?>" id="register-form">
            <form action="login_register.php" method="post">
                <h2>Register</h2>
                <?= showError($errors['register']); ?>
                <?= showSuccess($errors['register_success']); ?>
                <input type="text" name="name" placeholder="Name" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="tel" name="phone" placeholder="Phone Number" pattern="[0-9]{10}" required>
                <button type="submit" name="send_otp">Send OTP</button>
                <input type="text" name="otp" placeholder="Enter OTP" pattern="[0-9]{6}">
                <button type="submit" name="verify_otp">Verify Phone</button>
                <input type="password" name="password" placeholder="Password" required>
                <select name="role" required>
                        <option value="">--Select Role--</option>
                        <option value="user">User</option>
                        <option value="employer">Employer</option>
                        <option value="admin">Admin</option>
                </select>
                 <button type="submit" name="register">Register</button>
                <p1>Already have an account? <a href="#" onclick="showForm('login-form')">Login</a></p1>
            </form>
        </div>
    </div>
<script src="script.js"></script>
</body1>

</html>
