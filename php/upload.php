<?php
$link = "https://hardy-lip-production.up.railway.app/";
if (isset($_FILES['photo'])) {
    $title = $_POST['title'];
    if ($title == "") {
        echo $link;
    } else {
        $extension = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $new_name = time() . '.' . $extension;
        move_uploaded_file($_FILES['photo']['tmp_name'], '../photos/' . $new_name);

        echo $link . $new_name;
    }
}
