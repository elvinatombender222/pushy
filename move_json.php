<?php
// Get the action (trash or archive) and file name from the request
$action = $_POST['action'];
$filename = $_POST['filename'];
$source = $_POST['source'] ?? 'statuses'; // Default to main statuses directory

// Set source directory based on where the file is coming from
$sourceDir = "/var/www/html/Pushy/";
if ($source === 'saved') {
    $sourceDir .= "statuses/saved/";
} else {
    $sourceDir .= "statuses/";
}

// Set target directory based on action
$targetDir = "";
switch ($action) {
    case "trash":
        $targetDir = "/var/www/html/Pushy/statuses/trash/";
        break;
    case "saved":
        $targetDir = "/var/www/html/Pushy/statuses/saved/";
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Invalid action specified"]);
        exit;
}

// Ensure the target directory exists
if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0755, true)) {
        echo json_encode(["status" => "error", "message" => "Failed to create target directory"]);
        exit;
    }
}

// Check if file exists before attempting to move
if (file_exists($sourceDir . $filename)) {
    if (rename($sourceDir . $filename, $targetDir . $filename)) {
        echo json_encode(["status" => "success", "action" => $action]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to move file due to permission issues"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "File not found"]);
}
?>
