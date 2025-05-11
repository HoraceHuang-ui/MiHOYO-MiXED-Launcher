<img width="100%" style="border-radius: 15px; margin-top: 5px" src="https://repository-images.githubusercontent.com/671397180/2b5ef74f-f584-4921-872b-9fbc66155641"/>

[简体中文文档](/README_CN.md)

# miHoYo miXED Launcher

By HoraceHyy
> Launch HoYoVERSE games in one place and analyze in-game player information.

# Oops!

Just learnt something new from other projects lately, and I'd just realized how shitty my codes are. I'll
try to refactor some of the codes of this project in several weeks (or months)? Plz forgive me for
the following slow updates!

# Features

- [x] Launch `Genshin Impact`, `Honkai: Star Rail`, `Honkai Impact 3rd` and `Zenless Zone Zero` in one place.
- [x] Manually import customized game directories.
- [x] Multi-language support.
- [x] Analyze detailed player info for `Genshin Impact`, `Honkai: Star Rail` and `Zenless Zone Zero` in a special card layout.
- [x] Keeps all UI elements of official launchers.
- [x] Automatically calculate and notify about major game updates.
- [x] Gamepad support, with a standalone UI optimized for gamepad operations.
- [x] Supports reading and writing the registry to switch accounts without re-entering account information in game.
- [x] System or manual dark theme support.

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

- This app uses GitHub URLs to fetch resources for Star Rail player info. If you are from mainland
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

- The current version of `vite-plugin-electron` dependency isn't compatible with `electron@29.0.0` or later. Please
  leave the `electron` dependency version unchanged at `28.2.1`.

# Credits

- [electron-vite/electron-vite-vue](https://github.com/electron-vite/electron-vite-vue)
- [enka-network-api](https://github.com/yuko1101/enka-network-api)
- [Enka.DotNet](https://github.com/aliafuji/EnkaDotnet)
- [Mar-7th/MiHoMo API](https://march7th.xiaohei.moe/zh/resource/mihomo_api.html) | [Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes)

# Translation

## Supported Languages

| Language | Contributor | Notes |
|----------|-------------|-------|
| English | @HoraceHuang-ui | |
| 简体中文 | @HoraceHuang-ui | |
| 繁體中文 | @HoraceHuang-ui | $^1$ |
| 日本語 | @JonathanKwok | $^2$ |
| Русский | @MCheping8108 @vanja-san | $^{1,2}$ |
| Français | @MCheping8108 | $^{1,2}$ |

$^1$ `Needs revision.` Certain words or phrases may be inappropriate in context. Further localization by native speakers
is needed.

$^2$ `Needs completion.` The strings translated by machine are shown in blue, i.e., haven't been approved. Further
localization by native speakers is needed.

## Contributing

To add a new language,

1. Open an issue specifying that language and country/region.
2. Click the badge below to help translate miXeD to your language:

[![Crowdin](https://badges.crowdin.net/mihoyo-mixed-launcher/localized.svg)](https://crowdin.com/project/mihoyo-mixed-launcher)

# Other Notes
- `localStorage` items backup:
  - `lang` Language setting
  - `colorTheme` Color theme setting
  - `windowSize` The size of the window on last close
    - `width`
    - `height`
    - `isMax` Whether the window was maximized
  - `windowPos` The position of the window on last close
    - `x`
    - `y`
