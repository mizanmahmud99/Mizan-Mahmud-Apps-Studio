import JSZip from 'jszip';

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root settings and gradle
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MediCare"
include(":app")
`
  );

  zip.file(
    'build.gradle.kts',
    `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.hilt.android) apply false
    alias(libs.plugins.google.gms.services) apply false
}
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  );

  // App module build.gradle.kts
  zip.file(
    'app/build.gradle.kts',
    `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.medicare.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.medicare.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.3.1")
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // Image loading
    implementation("io.coil-kt:coil-compose:2.7.0")

    // Hilt DI
    implementation("com.google.dagger:hilt-android:2.52")

    // Video Consultation & WebRTC
    implementation("io.livekit:livekit-android:2.8.0")
}
`
  );

  // AndroidManifest.xml
  zip.file(
    'app/src/main/AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".MediCareApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MediCare">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.MediCare">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  );

  // MainActivity.kt
  zip.file(
    'app/src/main/java/com/medicare/app/MainActivity.kt',
    `package com.medicare.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.medicare.app.ui.navigation.MediCareNavGraph
import com.medicare.app.ui.theme.MediCareTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MediCareTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MediCareNavGraph()
                }
            }
        }
    }
}
`
  );

  // MediCareApplication.kt
  zip.file(
    'app/src/main/java/com/medicare/app/MediCareApplication.kt',
    `package com.medicare.app

import android.app.Application

class MediCareApplication : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
`
  );

  // Theme & Colors
  zip.file(
    'app/src/main/java/com/medicare/app/ui/theme/Color.kt',
    `package com.medicare.app.ui.theme

import androidx.compose.ui.graphics.Color

val PrimaryTeal = Color(0xFF176B62)
val PrimaryTealDark = Color(0xFF104C45)
val SecondaryEmerald = Color(0xFF2F8F83)
val LightMint = Color(0xFFEAF5F2)
val CardBackground = Color(0xFFFFFFFF)
val TextPrimary = Color(0xFF203936)
val TextSecondary = Color(0xFF7B918D)
val AccentCoral = Color(0xFFF16F6A)
val DividerColor = Color(0xFFE3ECE9)
`
  );

  zip.file(
    'app/src/main/java/com/medicare/app/ui/theme/Theme.kt',
    `package com.medicare.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = PrimaryTeal,
    onPrimary = Color.White,
    secondary = SecondaryEmerald,
    onSecondary = Color.White,
    background = LightMint,
    surface = CardBackground,
    onSurface = TextPrimary,
    outline = DividerColor
)

@Composable
fun MediCareTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
`
  );

  // Navigation
  zip.file(
    'app/src/main/java/com/medicare/app/ui/navigation/NavGraph.kt',
    `package com.medicare.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.medicare.app.ui.screens.home.HomeScreen
import com.medicare.app.ui.screens.video.VideoConsultationScreen

@Composable
fun MediCareNavGraph() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "home") {
        composable("home") { HomeScreen(navController) }
        composable("video") { VideoConsultationScreen(navController) }
    }
}
`
  );

  // Home Screen
  zip.file(
    'app/src/main/java/com/medicare/app/ui/screens/home/HomeScreen.kt',
    `package com.medicare.app.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.medicare.app.ui.theme.*

@Composable
fun HomeScreen(navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(LightMint)
            .padding(16.dp)
    ) {
        Text(
            text = "MediCare Healthcare",
            style = MaterialTheme.typography.headlineMedium,
            color = TextPrimary
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = { navController.navigate("video") },
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryTeal),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth().height(52.dp)
        ) {
            Text("Start Video Consultation", color = Color.White)
        }
    }
}
`
  );

  // Video Screen
  zip.file(
    'app/src/main/java/com/medicare/app/ui/screens/video/VideoConsultationScreen.kt',
    `package com.medicare.app.ui.screens.video

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.medicare.app.ui.theme.*

@Composable
fun VideoConsultationScreen(navController: NavController) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("Doctor Video Call Stream", color = Color.White)
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = { navController.popBackStack() },
                colors = ButtonDefaults.buttonColors(containerColor = AccentCoral),
                shape = CircleShape
            ) {
                Text("End Call")
            }
        }
    }
}
`
  );

  // Resources strings.xml
  zip.file(
    'app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">MediCare</string>
</resources>
`
  );

  // Resources colors.xml
  zip.file(
    'app/src/main/res/values/colors.xml',
    `<resources>
    <color name="primary_teal">#176B62</color>
    <color name="secondary_emerald">#2F8F83</color>
    <color name="light_mint">#EAF5F2</color>
</resources>
`
  );

  // Styles theme.xml
  zip.file(
    'app/src/main/res/values/themes.xml',
    `<resources>
    <style name="Theme.MediCare" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#176B62</item>
        <item name="android:navigationBarColor">#EAF5F2</item>
    </style>
</resources>
`
  );

  // README with build instructions
  zip.file(
    'README.md',
    `# MediCare Android Healthcare App

## Building the APK File:

### Option 1: Instant Command Line Build (Requires Android SDK & JDK 17)
Run in the project directory:
\`\`\`bash
./gradlew assembleDebug
\`\`\`
The generated APK file will be located at:
\`\`\`
app/build/outputs/apk/debug/app-debug.apk
\`\`\`

### Option 2: Android Studio Build (Recommended)
1. Open Android Studio.
2. Click **Open** and select this extracted folder.
3. Wait for Gradle sync to complete.
4. From the top menu, select:
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**
5. Android Studio will build the file and show a popup:
   **"APK(s) generated successfully: locate"**
6. Click **locate** to get your \`app-debug.apk\` ready to install directly onto any Android phone!

### Option 3: Generating Signed Release APK / AAB
1. In Android Studio, go to:
   **Build > Generate Signed Bundle / APK...**
2. Choose **APK** or **Android App Bundle (AAB)** for Play Store.
3. Select your keystore and set the build variant to \`release\`.
4. Click **Finish**. Output: \`app/release/app-release.apk\`.
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
