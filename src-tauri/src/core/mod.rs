#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub mod autostart;
#[cfg(any(target_os = "android", target_os = "ios"))]
pub mod autostart {
    use anyhow::Result;

    pub async fn update_launch() -> Result<()> {
        Ok(())
    }
}
pub mod backup;
pub mod handle;
#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub mod hotkey;
#[cfg(any(target_os = "android", target_os = "ios"))]
pub mod hotkey {
    use anyhow::Result;

    pub struct Hotkey;

    static HOTKEY: Hotkey = Hotkey;

    impl Hotkey {
        pub(crate) fn global() -> &'static Self {
            &HOTKEY
        }

        pub async fn init(&self, _skip: bool) -> Result<()> {
            Ok(())
        }

        pub fn reset(&self) -> Result<()> {
            Ok(())
        }

        pub async fn update(&self, _hotkeys: Vec<smartstring::alias::String>) -> Result<()> {
            Ok(())
        }
    }
}
pub mod listener;
pub mod logger;
pub mod manager;
#[cfg(target_os = "macos")]
pub mod network_watch;
pub mod notification;
pub(crate) mod owner_identity;
pub mod proxy_control;
pub mod proxy_view;
pub mod runstate;
pub(crate) mod runtime_bundle;
pub mod service;
#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub mod sysopt;
#[cfg(any(target_os = "android", target_os = "ios"))]
pub mod sysopt {
    use anyhow::{Result, anyhow};

    pub(crate) struct Sysopt;

    static SYSOPT: Sysopt = Sysopt;

    impl Sysopt {
        pub(crate) fn global() -> &'static Self {
            &SYSOPT
        }

        pub(crate) async fn wait_idle(&self) {}

        pub(super) async fn update_sysproxy(&self) -> Result<()> {
            Err(anyhow!("system proxy is unavailable on mobile platforms"))
        }

        pub(super) async fn reset_sysproxy(&self) -> Result<()> {
            Ok(())
        }

        pub(super) async fn stop_proxy_guard(&self) -> bool {
            true
        }

        pub(super) async fn refresh_guard(&self) -> bool {
            false
        }
    }
}
pub mod timer;
#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub mod tray;
#[cfg(any(target_os = "android", target_os = "ios"))]
pub mod tray {
    use anyhow::Result;

    pub struct Tray;

    static TRAY: Tray = Tray;

    impl Tray {
        pub(crate) fn global() -> &'static Self {
            &TRAY
        }

        pub async fn init(&self) -> Result<()> {
            Ok(())
        }

        pub async fn update_part(&self) -> Result<()> {
            Ok(())
        }

        pub async fn update_menu(&self) -> Result<()> {
            Ok(())
        }

        pub async fn update_icon(&self, _verge: &crate::config::IVerge) -> Result<()> {
            Ok(())
        }

        pub async fn update_tooltip(&self) -> Result<()> {
            Ok(())
        }

        pub async fn update_click_behavior(&self) -> Result<()> {
            Ok(())
        }

        pub async fn update_menu_and_icon(&self) {}

        pub fn update_speed_task(&self, _enabled: bool) {}
    }
}
#[cfg(not(any(target_os = "android", target_os = "ios")))]
pub mod updater;
#[cfg(any(target_os = "android", target_os = "ios"))]
pub mod updater {
    pub struct SilentUpdater;

    static SILENT_UPDATER: SilentUpdater = SilentUpdater;

    impl SilentUpdater {
        pub(crate) fn global() -> &'static Self {
            &SILENT_UPDATER
        }

        pub async fn try_install_on_startup(&self, _app_handle: &tauri::AppHandle) -> bool {
            false
        }

        pub async fn start_background_check(&self, _app_handle: tauri::AppHandle) {}
    }
}
pub mod validate;
pub mod win_uwp;

pub use self::{manager::CoreManager, timer::Timer, updater::SilentUpdater};
