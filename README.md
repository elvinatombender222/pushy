# Pushy

**Pushy** is a self-hosted, web-based notification dashboard inspired by [Pushover](https://pushover.net), designed for personal use on a private network.

Pushy displays rich, grouped notifications using HTML, CSS, and JavaScript served via a local web server.

---

## 🔧 Features

- Grouped notifications by type (e.g. weather, system, status)
- Archive system with one-click toggle between Active and Archive
- Archive or delete individual notifications from within the notification
- Delete by view (active, archive, by group)
- Optional presence indicator via .flg file (e.g. on_the_road.flg)
- Lightweight, responsive frontend (HTML/CSS/JS)
- Minimal backend: basic PHP scripts only (no database or frameworks)
- Self-hosted and private by design — ideal for use with Tailscale
- Toast alerts for group changes and interactions
- Clean UI with customizable color and image support
- Simple JSON POST API for creating notifications

---

## Updates
- Added a "Trash" view (2025-06-11)
- Version number incremented to 4.2 (2025-06-11)
- Version number added to bottom of hamburger menu (2025-06-09)
- New containerType "current_location" is "pinned" to the top of the notification list.  Only a single instance of this container will display at any given time and is over-written by a newer notification. (2025-06-09)

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

## 📱 Tasker Integration via HTTP (Android Only)

Pushy is a web app and cannot trigger native push notifications. To work around this, [Tasker](https://tasker.joaoapps.com/) on Android can be configured to receive **HTTP requests** from the Pushy server when a new notification is added.

### How It Works

1. When a new Pushy notification is generated, your server or script sends an **HTTP request** to Tasker on your Android device.
2. Tasker listens for this request and triggers an action such as:
   - Playing a custom audio track
   - Vibrating the phone
   - Turning on the display or dimming it
3. This allows you to receive **real-time alerts** on your phone — even if Pushy is not open in a browser.

### Advantages

- No need to keep the Pushy page open
- Does not rely on Firebase or any third-party services
- Works over LAN or Tailscale using secure local HTTP requests

### Limitations

- Only works on Android
- Requires manual setup of Tasker's HTTP listener
- Each device must be individually configured
- Not ideal for supporting multiple users

### Implementation

  tasker_trigger.py --ip {Phone IP} --port 8081 --task pushy_sound &

This solution offers a reliable, user-controlled alternative to push notifications without any cloud infrastructure.

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


