# Pushy

**Pushy** is a self-hosted, web-based notification dashboard inspired by [Pushover](https://pushover.net), designed for personal use on a private network.

Pushy displays rich, grouped notifications using HTML, CSS, and JavaScript — served over a local web server and gated by [Tailscale](https://tailscale.com) for secure access.

---

## 🔧 Features

- Grouped notifications by type (e.g. weather, system, status)
- Archive system with one-click toggle between Active and Archive
- Optional presence indicator via .flg file (e.g. on_the_road.flg)
- Lightweight, responsive frontend (HTML/CSS/JS)
- Minimal backend: basic PHP scripts only (no database or frameworks)
- Self-hosted and private by design — ideal for use with Tailscale
- Tasker integration for mobile audio or automation triggers
- Toast alerts for group changes and interactions
- Clean UI with customizable color and image support
- Simple JSON POST API for creating notifications
- Group-based organization (e.g., "heartbeat", "media", "download")

---

## 📂 Project Structure

<pre>
/
├── index.html                  # Main HTML interface
├── script.js                   # Client-side interaction logic
├── styles.css                  # Styling for layout and components
├── write_json.php              # JSON endpoint to receive and save notifications
├── move_notification.php       # Handles trash/archive moves from the frontend
├── statuses/                   # JSON files storage location
│   ├── saved/                  # Archived (saved) notifications
│   ├── trash/                  # Deleted (trashed) notifications
├── image/                      # Notification and presence icons (e.g., {image name.webp)
├── LICENSE                     # MIT License
└── README.md                   # This file
</pre>

---

## 📬 Sending Notifications

You can trigger a notification by sending a JSON payload via HTTP POST to the included `write_json.php` endpoint.

### 🔧 Example `curl` Command

<pre>
```bash
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

Pushy is a web app and cannot trigger native push notifications. To work around this, Tasker on Android can be configured to receive **HTTP requests** from the Pushy server when a new notification is added.

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

This solution offers a reliable, user-controlled alternative to push notifications without any cloud infrastructure.

---

## 🛠️ Roadmap / Future Plans

- [ ] Add optional "Trash" view in addition to Active and Archive  
- [ ] Configurable limit for number of notifications to retain  
- [ ] Ability to restore from Archive or Trash  
- [ ] Mobile audio support via improved Tasker hooks or optional native bridge  
- [ ] Optional multi-user mode (with user selector via URL)  
- [ ] Optional dark mode toggle  
- [ ] Admin menu for reviewing all groups and storage usage  
- [ ] Optional GitHub auto-deploy or static sync via script  

---

## 🙏 Acknowledgments

Pushy was inspired by the excellent design of [Pushover](https://pushover.net), but is entirely independent and self-hosted. No affiliation or endorsement implied.

---

## 📦 License

MIT License — see [`LICENSE`](LICENSE) file for details.
