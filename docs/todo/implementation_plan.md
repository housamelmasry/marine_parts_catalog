# Implementation Plan — Image + Text Sharing to WhatsApp

## Why Text-Only Happens Today

Android does **not** allow apps to share `file://` paths to other apps directly (security policy since Android 7+). WhatsApp's URL scheme (`whatsapp://send?text=...`) only accepts plain text. React Native's built-in `Share.share({ url })` only works for the `url` parameter on **iOS** — it is silently ignored on Android.

To send an image file to WhatsApp on Android, the app must:
1. Expose the image through a **FileProvider** (a native Android content provider that grants temporary read access via a `content://` URI)
2. Fire an `ACTION_SEND` intent with that `content://` URI attached — which is exactly what `react-native-share` does automatically

---

## Proposed Changes

### Step 1: Install `react-native-share`
```bash
npm install react-native-share
```
No extra `pod install` needed (uses autolinking). A **native rebuild** (`npm run android`) is required.

---

### Step 2: Android Native — FileProvider Setup

#### [NEW] `android/app/src/main/res/xml/file_paths.xml`
Tells the FileProvider which folders it is allowed to expose:
```xml
<?xml version="1.0" encoding="utf-8"?>
<paths>
  <files-path name="files" path="." />
  <cache-path name="cache" path="." />
  <external-path name="external" path="." />
</paths>
```

#### [MODIFY] `android/app/src/main/AndroidManifest.xml`
Register the FileProvider inside `<application>`:
```xml
<provider
  android:name="androidx.core.content.FileProvider"
  android:authorities="${applicationId}.provider"
  android:exported="false"
  android:grantUriPermissions="true">
  <meta-data
    android:name="android.support.FILE_PROVIDER_PATHS"
    android:resource="@xml/file_paths" />
</provider>
```

#### [MODIFY] `MainApplication.kt`
Implement the `ShareApplication` interface for `react-native-share`:
```kotlin
import cl.json.ShareApplication

class MainApplication : Application(), ReactApplication, ShareApplication {
  override fun getFileProviderAuthority(): String = "${BuildConfig.APPLICATION_ID}.provider"
  ...
}
```

---

### Step 3: New Share Options Sheet Component

#### [NEW] `src/features/products/components/ShareOptionsSheet.tsx`
A beautiful bottom-sheet modal that allows the user to control:
- ✅ Include product title
- ✅ Include price
- ✅ Include tags
- ✅ Include notes
- ✅ Include image (only shown if product has photos)
- Radio buttons: **WhatsApp** | **System Share Sheet**

This replaces the existing `Alert.alert` dialog for sharing.

---

### Step 4: Update Share Service

#### [MODIFY] `src/services/share/index.ts`
- Add a new `shareProductWithOptions(product, options)` method that uses `react-native-share` to:
  - Build the message text from selected options
  - Attach the primary product image if selected and available
  - Target WhatsApp directly (`Share.Social.WHATSAPP`) or open the generic system share sheet

---

### Step 5: Wire Up in Product Detail Screen

#### [MODIFY] `src/features/products/screens/ProductDetailScreen.tsx`
- Replace the current `handleShare` Alert with opening the new `ShareOptionsSheet` modal

---

## Verification Plan

### Automated
- Rebuild the Android app: `npm run android`

### Manual Verification
1. Open a product with an uploaded image
2. Tap Share → the new Share Options Sheet appears
3. Toggle off "Include Price" → confirm it's excluded from text
4. With "Include Image" ON → tap "Share to WhatsApp" → WhatsApp opens with image attached + message text
5. Test on a product with **no** custom image → Image toggle should be hidden/disabled

---

## ⚠️ Important Notes

> [!IMPORTANT]
> After these changes, a fresh **native rebuild** is required (`npm run android`). The JS-only hot-reload will not pick up the new native `react-native-share` module or the `FileProvider` registration.

> [!WARNING]
> The `react-native-share` package must be version `^10.x` for compatibility with React Native 0.85. Check the installed version after install.
