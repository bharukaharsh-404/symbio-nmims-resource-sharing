# Symbio - Android Build Guide

Convert Symbio into a native Android APK using Capacitor.

---

## Prerequisites (Already installed on your laptop)
- Android Studio (with Android SDK)
- Node.js v16+
- Java JDK 11+ (bundled with Android Studio)

---

## Step 1: Download / Clone the Project

**Option A - ZIP:**
1. Download the project ZIP from Caffeine platform
2. Extract to a folder (e.g., `C:\Projects\symbio`)

**Option B - Git:**
```bash
git clone <your-repo-url>
cd symbio
```

---

## Step 2: Install Dependencies

Open a terminal in the project root folder and run:

```bash
npm install
```

Then go into the frontend folder:

```bash
cd src/frontend
npm install
cd ../..
```

---

## Step 3: Build the Web App

From the project root:

```bash
cd src/frontend
npm run build
cd ../..
```

This creates the `src/frontend/dist/` folder that Capacitor will package into the Android app.

---

## Step 4: Add Android Platform

From the **project root** (where `capacitor.config.json` is located):

```bash
npx cap add android
```

This generates the `android/` folder with the full Android Studio project.

---

## Step 5: Copy App Icon

After the `android/` folder is generated, copy the Symbio icon:

1. Find the icon at: `src/frontend/public/assets/generated/symbio-icon-transparent.dim_512x512.png`
2. Copy it to these locations (replace existing files):
   - `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (resize to 72x72)
   - `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (resize to 48x48)
   - `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (resize to 96x96)
   - `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (resize to 144x144)
   - `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (resize to 192x192)

   **Tip:** In Android Studio, right-click `res` > New > Image Asset to import automatically.

---

## Step 6: Sync Web Assets to Android

```bash
npx cap sync android
```

This copies the built web app into the Android project.

---

## Step 7: Open in Android Studio

```bash
npx cap open android
```

Android Studio will open automatically with the Symbio project.

---

## Step 8: Build the APK in Android Studio

1. Wait for Gradle sync to finish (bottom progress bar)
2. Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
3. Click **"locate"** in the notification that appears when done
4. Your APK is at: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Step 9: Install on Your Android Phone

**Option A - USB:**
1. Enable Developer Mode on your phone (Settings > About Phone > tap Build Number 7 times)
2. Enable USB Debugging (Settings > Developer Options > USB Debugging)
3. Connect phone via USB
4. In Android Studio, select your phone from the device dropdown and click the green Run button

**Option B - Transfer APK:**
1. Copy `app-debug.apk` to your phone via USB or Google Drive
2. On your phone, open the file and tap Install
3. Allow "Install from unknown sources" if prompted

---

## Quick Reference Commands

```bash
# Full build sequence (run from project root)
cd src/frontend && npm run build && cd ../..
npx cap sync android
npx cap open android
```

---

## Troubleshooting

**"SDK location not found"**
- Open Android Studio > SDK Manager > copy the SDK path
- Create `android/local.properties` with: `sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk`

**"Gradle sync failed"**
- File > Invalidate Caches > Restart

**App crashes on launch**
- Make sure you ran `npm run build` in `src/frontend/` before `npx cap sync`
- Check that `src/frontend/dist/index.html` exists

**Internet Identity login not working on Android**
- This is expected in local APK builds. The app will work fully when accessed via the live web URL.
- For the Android APK, the app runs in demo mode by default.

---

## App Details

| Field | Value |
|-------|-------|
| App Name | Symbio |
| Package ID | com.nmims.symbio |
| Version | 1.0.0 |
| Min SDK | Android 5.0 (API 21) |
| Target SDK | Android 14 (API 34) |

---

Built with love for NMIMS University -- Symbio, Smart Resource Sharing Ecosystem.
