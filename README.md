# pushy
A personal web-based notification viewer inspired by Pushover

# Pushy

**Pushy** is a self-hosted, web-based notification dashboard inspired by [Pushover](https://pushover.net), designed for personal use on a private network.

Pushy displays rich, grouped notifications using HTML, CSS, and JavaScript — served over a local web server and gated by [Tailscale](https://tailscale.com) for secure access.

---

## 🔧 Features

- Grouped notifications by type (e.g. `weather`, `system`, `status`)
- Archive system with one-click toggling between **Active** and **Archive**
- Optional presence indicator (`gpsantenna.webp`) based on `.flg` files
- Fully client-side — no server-side code required
- Tasker integration for mobile audio or automation triggers
- Toast alerts for group changes and interactions
- Clean UI with themeable color and image support

---

## 📂 Project Structure
/
├── index.html # Main HTML interface
├── script.js # Client-side interaction logic
├── styles.css # Styling for layout and components
├── image/ # Notification and presence icons
├── statuses/ # JSON files for active notifications
├── archive/ # JSON files for archived notifications
├── LICENSE # MIT License
└── README.md # This file


---

## 🚀 Setup

1. Serve the contents using any local web server (e.g. Apache, Nginx)
2. Ensure Tailscale or another secure access method is active
3. Place notification `.json` files in the `statuses/` folder
4. Pushy automatically reads and displays them grouped by type

---

## 📱 Optional: Tasker Integration

- Tasker can watch for `.flg` files (e.g. `on_the_road.flg`) and trigger actions such as audio alerts or profile switching
- The presence indicator will show/hide automatically based on this file’s existence

---

## 📦 License

MIT License — see [`LICENSE`](LICENSE) file for details.

---

## 🙏 Acknowledgments

Pushy was inspired by the excellent design of [Pushover](https://pushover.net), but is entirely independent and self-hosted. No affiliation or endorsement implied.

---
