Pushy as a web app and cannot trigger native push notifications. To work around this [Tasker](https://tasker.joaoapps.com/) on Android can be configured to receive **HTTP requests** from the Pushy server when a new notification is added.

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
