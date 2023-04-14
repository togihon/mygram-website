<?php

session_start();
include("php/function.php");

if (isset($_GET["set_token"])) {
    $_SESSION["token"] = $_GET["set_token"];
}

include("html/header.html");
if (!isset($_SESSION["token"])) {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        switch ($id) {
            case "register":
                include("html/register.html");
                break;
            case "login":
                include("html/login.html");
                break;
            default:
                include("html/login.html");
                header("location: /mygram");
                break;
        }
    } else {
        include("html/login.html");
    }
}

if (isset($_SESSION['token'])) {

    $token = $_SESSION['token'];
    $data = decodeJWT($token);
    $photos = getData("https://mygram-production-2f89.up.railway.app/photos/")->data;

    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        switch ($id) {
            case "logout":
                session_destroy();
                header("location: /mygram/");
                break;
            case "upload":
                include("html/upload.html");
                break;
            case "profile":
                include("html/profile.html");
                break;
            default:
                include("html/home.html");
                break;
        }
    } else {
        include("html/home.html");
    }
}


include("html/footer.html");
