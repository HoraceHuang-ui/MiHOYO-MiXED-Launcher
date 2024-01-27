[简体中文文档](/README_CN.md)

# miHoYo miXED Launcher

By HoraceHyy
> Launch HoYoVERSE games in one place and analyze in-game player informations.

# Oops!

Just learnt something new from other projects lately, and I'd just realized how shitty my codes are. I'll
try to refactor some of the codes of this project in several weeks (or months)? Plz forgive me for
the following slow updates!

# Features

- [x] Launch `Genshin Impact`, `Honkai: Star Rail` and `Honkai Impact 3rd` in one place.
- [ ] `Zenless Zone Zero` to be supported.
- [x] Manually import customized game directories.
- [x] Multi-language support.
- [x] Analyze detailed player info for `Genshin Impact` and `Honkai: Star Rail` in a special card layout.
- [x] Keeps all UI elements of official launchers.
- [x] Automatically calculate and remind major game updates.

# Screenshots

<details>
  <summary>Click to expand</summary>

- App main page, background image customizable (Pixiv @anna_drw01)

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/1a5f4c7e-47ca-4416-9839-09680da8f0e0"/>

  <p></p>

- Genshin Impact launcher page

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/4bdffcb6-2f86-4302-b6df-d5152bc27a69"/>

  <p></p>

- Genshin Impact player info

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/de6aefee-0e61-4e49-ab83-ca5468f0c300"/>

<p></p>

- Honkai: Star Rail launcher page

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/439881fa-4a07-44fa-be28-c55d70fd8931"/>

<p></p>

- Honkai: Star Rail player info

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/c7923cc0-7b8f-4b4f-aa5b-ec557a28acc0"/>

</details>

# Notes

- This app uses GitHub URLs to check its updates and resources for Star Rail player info. If you are from mainland
  China, a proxy is needed.

# Development

## Dependencies

```
pnpm i
```

## Debug

```
pnpm dev
```

## Build

```
pnpm build
```

## Notes

- This app checks for updates via the GitHub API, which will automatically expire once it is uploaded publicly on
  GitHub. Therefore, during development, please create a token yourself and place it in `Octokit.auth`
  inside `electron/main/index.ts`.

```ts
const {Octokit} = require("@octokit/core")
const octokit = new Octokit({
    auth: "<YOUR TOKEN HERE>"
})
```

- For some reason, relative paths in the `dev` and `build` environments varies for some files. In `onMounted`
  inside `src/pages/SettingsPage.vue`, the path of `package.json` is determined by environment.

```ts
// BUILD: '../../app.asar/package.json'
// DEV: '../../package.json'
fetch('../../app.asar/package.json')
    .then(response => response.json())
    .then((resp) => {
        appVer.value = resp.version
    })
```

# Credits

- [electron-vite/electron-vite-vue](https://github.com/electron-vite/electron-vite-vue)
- [enka-network-api](https://github.com/yuko1101/enka-network-api)
- [Mar-7th/MiHoMo API](https://march7th.xiaohei.moe/zh/resource/mihomo_api.html) | [Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes)

# Translation

- **English** @HoraceHuang-ui
- **简体中文** @HoraceHuang-ui
- **繁體中文** @HoraceHuang-ui *(Needs revision)*
- **日本語** @JonathanKwok
- **Русский** @MCheping8108
- **Français** @MCheping8108

Click the badge below to help translate miXeD to your language:

[![Crowdin](https://badges.crowdin.net/mihoyo-mixed-launcher/localized.svg)](https://crowdin.com/project/mihoyo-mixed-launcher)

# Other Notes

- `electron-store` items backup:
    - `targetVersion` The seemingly "current" version taking `ignore current version` into account
    - `mainBgPath` The main page background image in `base64` format
    - `dialogStyle` The style of non-game UI dialogs
    - `gsLauncherPath` The directory of the official Genshin Impact launcher
    - `gsGamePath` The path of the Genshin Impact game executable
    - `genshinUpd` Whether Genshin Impact is updated in the current version
    - `genshinInfo` Genshin Impact player info
    - `genshinConstels` JSON object containing Constellations bonuses of Genshin Impact
    - `srLauncherPath`
    - `srGamePath`
    - `starRailUpd`
    - `starRailInfo`
    - `hi3LauncherPath`
    - `hi3GamePath`
    - `honkai3Upd`
