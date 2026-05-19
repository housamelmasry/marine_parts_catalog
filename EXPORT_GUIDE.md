# Android APK Export Guide 📱

This guide outlines the commands and folder directions for exporting Android APK files for your **Loay Marine Parts Catalog** mobile application.

---

## ⚡ Quick Reference Commands

Run these commands from the **root directory** of your React Native project:

### 1. Build a Debug APK (Easiest for quick testing)
Best for sharing with others for quick testing or side-loading on a new device. Does not require configured signing credentials.
```bash
./android/gradlew -p android assembleDebug
```

### 2. Build a Release APK (For production & distribution)
Compiles a highly optimized, minified version of the catalog app with maximum performance.
```bash
./android/gradlew -p android assembleRelease
```

---

## 📂 Output Folder Directions

After a build completes successfully, you will find the generated `.apk` files inside the following directories:

| Build Type | Absolute Project Path |
| :--- | :--- |
| **Debug APK** ⚙️ | `android/app/build/outputs/apk/debug/app-debug.apk` |
| **Release APK** 🚀 | `android/app/build/outputs/apk/release/app-release.apk` |

---

## 🛠️ Common Troubleshooting

### 1. Permission Denied Error
If you receive a `Permission Denied` error when executing `./android/gradlew`, it means the wrapper is not marked as executable. Fix it by running:
```bash
chmod +x android/gradlew
```

### 2. Clean Previous Builds
If Gradle fails or uses outdated cached files, clean the project's build directory before rebuilding:
```bash
./android/gradlew -p android clean
```

---

## 📲 How to Install on Android Devices

1. **Transfer the APK**: Send the generated `app-debug.apk` or `app-release.apk` to your phone (via USB, email, WhatsApp, or Google Drive).
2. **Enable Unknown Sources**: When you tap to open the `.apk` on your phone, Android may warn you about security. Go to settings when prompted and toggle on **"Allow installation from this source"** for your browser or file manager.
3. **Install**: Run the installer and open the app!
