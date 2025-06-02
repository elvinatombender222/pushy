<?php
$data = file_get_contents("php://input");

if (json_decode($data) === null) {
    http_response_code(400);
    echo "Invalid JSON received";
    exit;
}

$timestamp = round(microtime(true) * 1000);
$directory = "/var/www/html/Pushy/statuses/";
$filename = $directory . "{$timestamp}.json";

if (!is_dir($directory)) {
    mkdir($directory, 0755, true);
}

if (file_put_contents($filename, $data)) {
    http_response_code(200);
    echo "JSON saved successfully to $filename";

    chown($filename, "www-data");
    chgrp($filename, "john");
    chmod($filename, 0664);

    $output = [];
    $return_var = 0;
    exec('sudo /var/www/html/Pushy/pushy_sound.sh', $output, $return_var);
} else {
    http_response_code(500);
    echo "Failed to save JSON";
}
?>

