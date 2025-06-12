<?php
$action = $_POST['action'];
$filename = $_POST['filename'];
$source = $_POST['source'] ?? 'statuses';

// Base directory
$baseDir = "/var/www/html/Pushy/statuses/";
$sourceDir = $baseDir;

// Determine source path
if ($source === 'saved') {
    $sourceDir .= "saved/";
} else if ($source === 'trash') {
    $sourceDir .= "trash/";
} else {
    $sourceDir .= "";
}

$filePath = $sourceDir . $filename;

// Handle delete
if ($action === 'delete') {
    if (file_exists($filePath)) {
        if (unlink($filePath)) {
            echo json_encode(["status" => "success", "action" => "deleted"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to delete file"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "File not found"]);
    }
    exit;
}

// Handle move to trash or saved
$targetDir = "";
switch ($action) {
    case "trash":
        $targetDir = $baseDir . "trash/";
        break;
    case "saved":
        $targetDir = $baseDir . "saved/";
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Invalid action specified"]);
        exit;
}

// Ensure target directory exists
if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0755, true)) {
        echo json_encode(["status" => "error", "message" => "Failed to create target directory"]);
        exit;
    }
}

// Move file
if (file_exists($filePath)) {
    if (rename($filePath, $targetDir . $filename)) {
        echo json_encode(["status" => "success", "action" => $action]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to move file due to permission issues"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "File not found"]);
}
?>

