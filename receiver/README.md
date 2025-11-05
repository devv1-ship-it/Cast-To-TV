# Cast To TV - Chromecast Receiver Setup Guide

## Overview
This folder contains the Custom Receiver application for your Cast To TV app. This HTML file needs to be hosted on a publicly accessible HTTPS server for Chromecast devices to load it.

## Important: Your Receiver URL Must Match Google Cast Console
According to your Google Cast Console registration, your receiver URL is:
- **http://192.168.1.23:8000/index.html**

⚠️ **CRITICAL**: This is a local IP address and won't work in production! You need to:
1. Host this file on a publicly accessible HTTPS URL, OR
2. Update your Google Cast Console with the correct URL

## Quick Setup Options

### Option 1: Use a Public Hosting Service (RECOMMENDED for Production)

#### A. GitHub Pages (Free & Easy)
1. Create a new GitHub repository
2. Upload `index.html` to the repository
3. Enable GitHub Pages in repository settings
4. Your URL will be: `https://yourusername.github.io/repository-name/index.html`
5. Update this URL in Google Cast Console

#### B. Firebase Hosting (Free & Fast)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

#### C. Netlify (Free & Simple)
1. Go to https://www.netlify.com
2. Drag and drop the `receiver` folder
3. Get your URL: `https://your-site.netlify.app/index.html`

### Option 2: Local Testing (Development Only)

For local testing on your network, you can use Python's HTTP server:

```bash
# Navigate to receiver folder
cd c:\Users\quang\AndroidStudioProjects\CastToTV\receiver

# Start HTTP server on port 8000
python -m http.server 8000
```

Then access via: `http://YOUR_LOCAL_IP:8000/index.html`

**Note**: This only works for testing with devices on the same network!

## Update Google Cast Console

After hosting your receiver application:

1. Go to: https://cast.google.com/publish
2. Find your application: **Cast To TV & Screen Mirroring** (ID: D4B7E07C)
3. Update the "Receiver Application URL" to your new HTTPS URL
4. Save and wait for changes to propagate (can take up to 15 minutes)

## Testing Your Receiver

### Test the receiver directly:
1. Open the hosted URL in a Chrome browser
2. Open Developer Console (F12)
3. You should see: "Cast receiver started"
4. No errors should appear in the console

### Test with your Android app:
1. Make sure your app uses Application ID: **D4B7E07C** ✓ (Already configured)
2. Connect to a Chromecast device
3. Start screen mirroring
4. Check TV for the receiver interface

## Troubleshooting

### Issue: No devices found
- Ensure Chromecast and phone are on the same WiFi network
- Check that Location permission is granted to the app
- Restart the Chromecast device

### Issue: Connection established but black screen on TV
- Verify the receiver URL is correct and publicly accessible
- Check browser console on the receiver for errors
- Ensure Application ID D4B7E07C is used in the app ✓

### Issue: "Receiver Application URL" shows error
- URL must be HTTPS (except localhost for testing)
- URL must be publicly accessible
- File must be named exactly as registered

## Current Configuration Status

✓ Application ID configured: **D4B7E07C**
✓ CastOptionsProvider updated
✓ ScreenCaptureService sends data to receiver
✓ Custom namespace: `urn:x-cast:com.xxx.screenmirroring`

⚠️ **TO-DO**: Host receiver on HTTPS and update Google Cast Console

## File Structure
```
receiver/
├── index.html          # Custom receiver application
└── README.md          # This file
```

## Advanced: Production Considerations

For production deployment:

1. **Use HTTPS**: Required for public apps
2. **Add error handling**: Improve receiver robustness
3. **Optimize video transmission**: Current implementation sends limited frames
4. **Add user feedback**: Show connection status on receiver
5. **Consider CDN**: For better global performance

## Support

For more information:
- Google Cast SDK Documentation: https://developers.google.com/cast
- Cast Console: https://cast.google.com/publish

