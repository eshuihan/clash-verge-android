# Android and Android TV

Android support is being developed on the `android` branch and tracked in
[issue #1](https://github.com/eshuihan/clash-verge-android/issues/1).

## Direction

The port keeps the existing React UI and Rust application core where they are
portable. Android-specific behavior belongs behind platform boundaries:

- The Android build uses a dedicated Tauri configuration and capability file.
- Desktop-only window controls, global shortcuts, autostart, and updater flows
  must not be required by the Android runtime.
- Tunnel ownership will be implemented with an Android `VpnService` bridge.
- Android TV uses the same navigation model with larger focus targets and
  visible keyboard or D-pad focus.

## Local prerequisites

Install Rust, Node.js, Android Studio, an Android SDK, and the Android NDK.
Configure the Android SDK environment variables required by the Tauri Android
toolchain, then install the Rust Android targets needed by the device or
emulator you will use.

After installing the repository dependencies, initialize the Tauri project and
run the Android development build:

```sh
pnpm install
pnpm tauri android init
pnpm tauri android dev
```

The current branch only adds the platform configuration and the first UI
boundary. Android VPN lifecycle, sidecar replacement, permissions, and release
signing are subsequent implementation steps.
