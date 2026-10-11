#!/usr/bin/env bash
set -e

echo "=== Building MediCare Native Android APK ==="

WORK_DIR="/tmp/medicare_apk_build"
rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"
mkdir -p "$WORK_DIR/src/com/medicare/app"
mkdir -p "$WORK_DIR/res/values"
mkdir -p "$WORK_DIR/res/drawable"
mkdir -p "$WORK_DIR/assets"
mkdir -p "$WORK_DIR/bin"

APPLET_DIR="$(pwd)"
ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"

# 1. AndroidManifest.xml
cat << 'EOF' > "$WORK_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.medicare.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    <uses-feature android:name="android.hardware.microphone" android:required="false" />

    <application
        android:label="@string/app_name"
        android:icon="@drawable/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 2. Resources: strings.xml
cat << 'EOF' > "$WORK_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">MediCare</string>
</resources>
EOF

# 3. Create a clean launcher icon PNG
python3 -c "
import struct, zlib

def make_png(width, height, color):
    raw = b''
    r, g, b, a = color
    for _ in range(height):
        raw += b'\x00' + bytes([r, g, b, a]) * width
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b'')

with open('$WORK_DIR/res/drawable/ic_launcher.png', 'wb') as f:
    f.write(make_png(144, 144, (23, 107, 98, 255))) # MediCare Dark Teal #176B62
"

# 4. Copy built web app into assets/
npm run build
cp -r "$APPLET_DIR/dist" "$WORK_DIR/assets/www"

# 5. Native MainActivity.java with Camera/Mic permission & Offline asset loading
cat << 'EOF' > "$WORK_DIR/src/com/medicare/app/MainActivity.java"
package com.medicare.app;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.PermissionRequest;
import android.content.pm.PackageManager;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(0xFF176B62);
        }

        // Request runtime permissions for Camera and Audio if Android 6.0+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(android.Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED ||
                checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{
                    android.Manifest.permission.CAMERA,
                    android.Manifest.permission.RECORD_AUDIO
                }, 101);
            }
        }

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                // Grant camera & microphone access for video consultation
                request.grant(request.getResources());
            }
        });

        // Load bundled standalone MediCare application
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
EOF

# 6. Step A: AAPT compile resources & create R.java
echo "== Generating R.java and initial package =="
aapt package -f -m \
    -J "$WORK_DIR/src" \
    -M "$WORK_DIR/AndroidManifest.xml" \
    -S "$WORK_DIR/res" \
    -I "$ANDROID_JAR"

# 7. Step B: Javac compile Java sources
echo "== Compiling Java classes =="
javac -encoding UTF-8 \
    -source 1.8 -target 1.8 \
    -bootclasspath "$ANDROID_JAR" \
    -d "$WORK_DIR/bin" \
    "$WORK_DIR/src/com/medicare/app/"*.java

# 8. Step C: Convert to Dalvik Executable (classes.dex)
echo "== Converting to classes.dex =="
dalvik-exchange --dex --output="$WORK_DIR/classes.dex" "$WORK_DIR/bin"

# 9. Step D: Package initial unaligned APK
echo "== Packaging unaligned APK =="
aapt package -f \
    -M "$WORK_DIR/AndroidManifest.xml" \
    -S "$WORK_DIR/res" \
    -A "$WORK_DIR/assets" \
    -I "$ANDROID_JAR" \
    -F "$WORK_DIR/medicare-unaligned.apk"

# Add classes.dex into APK
cd "$WORK_DIR"
aapt add medicare-unaligned.apk classes.dex

# 10. Step E: Zipalign 4 bytes
echo "== Aligning APK =="
zipalign -f -p 4 "$WORK_DIR/medicare-unaligned.apk" "$WORK_DIR/medicare-aligned.apk"

# 11. Step F: Generate debug keystore and Sign APK
echo "== Signing APK =="
KEYSTORE="$WORK_DIR/debug.keystore"
if [ ! -f "$KEYSTORE" ]; then
    keytool -genkey -v -keystore "$KEYSTORE" \
        -alias androiddebugkey -storepass android -keypass android \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -dname "CN=MediCare, OU=Health, O=MediCare, L=Dhaka, ST=Dhaka, C=BD"
fi

apksigner sign \
    --ks "$KEYSTORE" \
    --ks-pass pass:android \
    --key-pass pass:android \
    --out "$WORK_DIR/medicare.apk" \
    "$WORK_DIR/medicare-aligned.apk"

# Verify signature
apksigner verify --verbose "$WORK_DIR/medicare.apk"

# 12. Copy finished APK to public/ and dist/
mkdir -p "$APPLET_DIR/public"
mkdir -p "$APPLET_DIR/dist"
cp "$WORK_DIR/medicare.apk" "$APPLET_DIR/public/medicare.apk"
cp "$WORK_DIR/medicare.apk" "$APPLET_DIR/dist/medicare.apk"

echo "SUCCESS: $APPLET_DIR/public/medicare.apk and $APPLET_DIR/dist/medicare.apk created!"
ls -lh "$APPLET_DIR/public/medicare.apk"
