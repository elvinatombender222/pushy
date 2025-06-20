<?php
$flagPath = __DIR__ . '/on_the_road.flg';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (file_exists($flagPath)) {
        echo unlink($flagPath) ? 'stopped' : 'error';
    } else {
        echo touch($flagPath) ? 'started' : 'error';
    }
    exit;
}

$flagExists = file_exists($flagPath);
$initialState = $flagExists ? 'Stop' : 'Start';
$initialClass = $flagExists ? 'menu-btn stop-flag-btn' : 'menu-btn start-flag-btn';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <title>Pushy</title>
    <link rel="stylesheet" href="styles.css" />
    <style>
        .start-flag-btn {
            background-color: #28a745;
            color: white;
        }
        .stop-flag-btn {
            background-color: #dc3545;
            color: white;
        }
        .start-flag-btn:hover {
            background-color: #218838;
        }
        .stop-flag-btn:hover {
            background-color: #c82333;
        }
    </style>
</head>
<body>
    <div class="app-header">
        <div class="app-title" id="app-title">Pushy</div>
        <img id="presence-icon" class="presence-icon" src="images/gpsantenna.webp" alt="GPS Active" style="display: none;">
        <div class="hamburger-icon" id="hamburger-icon">
            <span></span><span></span><span></span>
        </div>
    </div>

    <div id="side-menu" class="side-menu">
        <div class="menu-section-title">View Options</div>
        <div class="toggle-buttons">
            <select id="view-selector" class="toggle-btn">
                <option value="statuses">Active</option>
                <option value="statuses/saved">Archive</option>
                <option value="statuses/trash">Trash</option>
            </select>
        </div>

        <div class="menu-section-title">Filter by Group</div>
        <div class="group-filter-container">
            <select id="group-filter">
                <option value="all">All Groups</option>
            </select>
        </div>

        <div class="menu-section-title">Actions</div>
        <div class="action-buttons-menu">
            <button id="delete-all-btn" class="menu-btn delete-all-btn">Delete All in View</button>
            <button id="toggle-flag-btn" class="<?= $initialClass ?>" onclick="toggleFlag()" aria-live="polite"><?= $initialState ?></button>
        </div>

        <div class="menu-version">Version 4.3</div>
    </div>

    <div id="main-content-wrapper">
        <div id="archive-banner" style="display: none;">Archive View</div>
        <div id="status-container"></div>
    </div>

    <script src="script.js"></script>
    <script>
    async function toggleFlag() {
        const btn = document.getElementById('toggle-flag-btn');
        btn.disabled = true;
        try {
            const response = await fetch(window.location.href + '?_=' + Date.now(), { method: 'POST' });
            const state = await response.text();
            if (state === 'started') {
                btn.textContent = 'Stop';
                btn.className = 'menu-btn stop-flag-btn';
            } else if (state === 'stopped') {
                btn.textContent = 'Start';
                btn.className = 'menu-btn start-flag-btn';
            } else {
                console.error("Unexpected response:", state);
            }
        } catch (error) {
            console.error("Toggle error:", error);
        } finally {
            btn.disabled = false;
        }
    }
    </script>
    <div id="toast" class="toast"></div>
</body>
</html>

