fn main() -> Result<(), Box<dyn std::error::Error>> {
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("windows")
        && std::env::var("CARGO_CFG_TARGET_ENV").as_deref() == Ok("msvc")
        && std::env::var_os("CARGO_FEATURE_CLIPPY").is_some()
    {
        // Tauri's resource is linked to the app binary, but not to Rust unit-test harnesses.
        // Give mock-context builds their own manifest so tests can resolve TaskDialogIndirect.
        let out_dir = std::env::var_os("OUT_DIR").ok_or_else(|| std::io::Error::other("OUT_DIR is not set"))?;
        let manifest_path = std::path::PathBuf::from(out_dir).join("windows-test-manifest.xml");
        std::fs::write(
            &manifest_path,
            r#"<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <dependency>
    <dependentAssembly>
      <assemblyIdentity
        type="win32"
        name="Microsoft.Windows.Common-Controls"
        version="6.0.0.0"
        processorArchitecture="*"
        publicKeyToken="6595b64144ccf1df"
        language="*"
      />
    </dependentAssembly>
  </dependency>
</assembly>
"#,
        )?;
        println!("cargo:rustc-link-arg=/MANIFEST:EMBED");
        println!("cargo:rustc-link-arg=/MANIFESTINPUT:{}", manifest_path.display());
    }

    #[cfg(feature = "clippy")]
    {
        println!("cargo:warning=Skipping tauri_build during Clippy");
    }

    #[cfg(not(feature = "clippy"))]
    {
        tauri_build::build();
        patch_mihomo_android_project();
    }

    Ok(())
}

fn patch_mihomo_android_project() {
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() != Ok("android") {
        return;
    }

    let project_path = std::env::var_os("TAURI_ANDROID_PROJECT_PATH")
        .map(std::path::PathBuf::from)
        .or_else(|| {
            std::env::var_os("CARGO_MANIFEST_DIR").map(|dir| std::path::PathBuf::from(dir).join("gen/android"))
        });
    let Some(project_path) = project_path else {
        return;
    };

    // The mihomo plugin currently has no Android-native module. Its generated
    // project only contains a second copy of Tauri's API library, which would
    // produce duplicate classes when merged with the app's tauri-android module.
    for path in [
        project_path.join("tauri.settings.gradle"),
        project_path.join("app").join("tauri.build.gradle.kts"),
    ] {
        let Ok(contents) = std::fs::read_to_string(&path) else {
            continue;
        };
        let updated = contents
            .lines()
            .filter(|line| !line.contains("tauri-plugin-mihomo"))
            .collect::<Vec<_>>()
            .join("\n");
        if updated != contents {
            let _ = std::fs::write(path, format!("{updated}\n"));
        }
    }
}
