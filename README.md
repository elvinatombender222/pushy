# Pushy

**Pushy** is a self-hosted, web-based notification dashboard inspired by [Pushover](https://pushover.net), designed for personal use on a private network.

Pushy displays rich, grouped notifications using HTML, CSS, PHP and JavaScript.  Served by your web server.

---

## 🔧 Features

- Grouped notifications by type (e.g. weather, system, status)
- Archive or delete individual notifications from within the notification
- Delete all when in "trash" view
- Optional presence indicator via .flg file (e.g. on_the_road.flg)
- Lightweight, responsive frontend (HTML/CSS/JS)
- Minimal backend: basic PHP scripts only (no database or frameworks)
- Self-hosted and private by design — ideal for use with Tailscale
- Toast alerts for group changes and interactions
- Clean UI with customizable color and image support
- Simple JSON POST API for creating notifications

---

## ⚡ Quick Start
1. Copy the project to your web server directory (e.g., `/var/www/html/Pushy`)
2. Open `index.html` in your browser
3. Send a test notification using `write_json.php` (see below)

---

## 📦 Updates

- **2025-06-11** — Added a "Trash" view
- **2025-06-11** — Version number incremented to 4.2
- **2025-06-09** — Version number added to bottom of hamburger menu
- **2025-06-09** — New `containerType: "current_location"` is pinned to the top; only one instance displays at a time and is overwritten by newer notifications

---

## 📂 Project Structure

<pre>
/
├── index.html                  # Main HTML interface
├── script.js                   # Client-side interaction logic
├── styles.css                  # Styling for layout and components
├── write_json.php              # JSON endpoint to receive and save notifications
├── move_notification.php       # Handles trash/archive moves from the frontend
├── tasker_trigger.py           # Send an http request to Tasker
├── statuses/                   # Active JSON files storage location
│   ├── saved/                  # Archived JSON files (saved) notifications
│   ├── trash/                  # Deleted JSON files (trashed) notifications
├── image/                      # Notification and presence icons (e.g., heartbeat.webp)
├── LICENSE                     # MIT License
└── README.md                   # This file
</pre>

---

## 📬 Sending Notifications

You can trigger a notification by sending a JSON payload via HTTP POST to the included `write_json.php` endpoint.

### 🔧 Example `curl` Command

<pre>
/usr/bin/curl -X POST -H "Content-Type: application/json" -d '{
  "containerType": "routine",
  "group": "heartbeat",
  "image": "'"$ALERT_ICON"'",
  "subtitle": "'"$ALERT_SUBTITLE"'",
  "details": "'"$DETAILS"'"
}' http://{server IP}/Pushy/write_json.php
</pre>

---

## 🛰️ Presence Indicator with Flag Files

Pushy supports optional presence indicators using lightweight `.flg` files.

### Use Case Example

If a file named `on_the_road.flg` is detected in the Pushy root directory, a small icon (e.g., `gpsantenna.webp`) appears in the top-right title bar next to the hamburger menu. This allows for subtle, visual context about device or user state (like whether you're in a car, on the road, or in a particular mode).

### How It Works

- Presence icons are **not clickable**
- The icon is **only shown** when a specific `.flg` file exists
- The logic is handled in JavaScript and requires no server-side scripting

### Customization

You can create and monitor your own `.flg` files, for example:

- `focus_mode.flg`
- `quiet_hours.flg`
- `office.flg`

Then associate each with a different `.webp` icon and add logic to `script.js` as needed.

---

## 📱 Android Tasker Integration
Pushy can trigger Tasker on Android via HTTP for real-time notifications (e.g., sound, screen wake).  
[See full Tasker setup →](docs/TASKER.md)


---

## Tailscale
Pushy runs entirely within my [Tailscale](https://tailscale.com) tailnet, so no certificates or login mechanisms are needed. If you’re familiar with Tailscale, no further explanation is required.

---

## 🛠️ Roadmap / Future Plans

- [X] Add "Trash" view in addition to Active and Archive  
- [ ] Configurable limit for number of notifications to retain  
- [ ] Ability to restore from Archive or Trash  
- [ ] Multi-user mode (with user selector via URL)  
- [ ] Dark mode toggle  
- [ ] Admin menu for reviewing all groups and storage usage
- [ ] Find (within notifications including active, archive and trash)
- [X] Empty Trash

---

## 🙏 Acknowledgments

Pushy was inspired by the excellent design of [Pushover](https://pushover.net), but is entirely independent and self-hosted. No affiliation or endorsement implied.

---

## 📦 License

MIT License — see [`LICENSE`](LICENSE) file for details.

For feedback, ideas, or contributions, feel free to open an issue or fork the project.

---

Pushy: Because your notifications shouldn’t leave your network.


