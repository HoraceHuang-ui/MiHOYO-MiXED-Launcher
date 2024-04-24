<img width="100%" style="border-radius: 15px; margin-top: 5px" src="https://repository-images.githubusercontent.com/671397180/2b5ef74f-f584-4921-872b-9fbc66155641"/>

[English Document](/README.md)

# 米家聚合启动器

By HoraceHyy
> 聚合启动米哈游游戏并分析游戏内玩家信息。

# 咕咕咕

最近做别的项目学到了点新知识，顿觉本项目的代码写的依托史，故接下来想浅浅改一下代码，可能更新会很慢，请见谅！

# 功能

- [x] 聚合启动原神、崩坏：星穹铁道、崩坏3rd。
- [ ] 待支持绝区零。
- [x] 手动导入游戏路径。
- [x] 多语言支持。
- [x] 以卡片形式展现原神和崩坏：星穹铁道的游戏内账号信息。
- [x] 保留了官方启动器的所有UI元素。
- [x] 自动计算游戏大版本更新并提醒。
- [x] 可跟随系统或手动选择暗黑模式。

# 截图

<details>
  <summary>点击展开</summary>

- 应用主页，背景图片可自定义 (Pixiv @anna_drw01)

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/93617970-7d3e-43ea-8004-d7fbcbc55452"/>

  <p></p>

- 原神启动页面

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/1a3d48f7-a636-40d4-8272-52d81b0f8069"/>

  <p></p>

- 原神账号数据

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/9434ed2a-fa32-49fa-9ce3-353060e80d81"/>

  <p></p>

- 崩坏：星穹铁道启动页面

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/99800c57-707d-4753-bd6d-0783556cd427"/>

  <p></p>

- 崩坏：星穹铁道账号数据

  <img width="500" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/d366f516-3441-4cb8-8afa-64342982bcd8"/>

</details>

# 注意事项

- 本软件使用 GitHub 域名的 URL 来检测自身更新与获取崩坏：星穹铁道角色信息相关资源。如果您是中国大陆用户，请确保代理网络条件通畅。

# 开发

## 依赖

```
pnpm i
```

## 调试

```
pnpm dev
```

## 构建

```
pnpm build
```

## 提示

- 本程序检测自身更新目前用的是 GitHub
  API，但一旦把含 token 的代码同步到这里就会自动销毁，所以构建时请自行申请一个 token，放在 `electron/main/index.ts` 
  的 `Octokit.auth` 中。

```ts
const {Octokit} = require("@octokit/core")
const octokit = new Octokit({
    auth: "<YOUR TOKEN HERE>"
})
```

- 由于一些原因，在开发和生产环境中某些文件的相对路径可能会改变。在 `src/pages/SettingsPage.vue` 中， `package.json` 的相对路径取决于环境。

```ts
// BUILD: '../../app.asar/package.json'
// DEV: '../../package.json'
fetch('../../app.asar/package.json')
    .then(response => response.json())
    .then((resp) => {
        appVer.value = resp.version
    })
```
- 当前最新版本的 `vite-plugin-electron` 依赖与 `electron@29.0.0` 或更高版本不兼容。请将依赖 `electron` 的版本保持在 `28.2.1` 不要变。
- 本项目尚未准备好向 ES Module 转型。最新的 `@octokit/core@6.0.1` 已经转为 ES Module，与本项目不兼容。请将依赖 `@octokit/core`
的版本保持在 `5.1.0` 不要变。

# 鸣谢

- [electron-vite/electron-vite-vue](https://github.com/electron-vite/electron-vite-vue)
- [enka-network-api](https://github.com/yuko1101/enka-network-api)
- [Mar-7th/MiHoMo API](https://march7th.xiaohei.moe/zh/resource/mihomo_api.html) | [Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes)

# 翻译

## 支持的语言

| 语言       | 贡献者                      | 备注       |
|----------|--------------------------|----------|
| English  | @HoraceHuang-ui          |          |
| 简体中文     | @HoraceHuang-ui          |          |
| 繁體中文     | @HoraceHuang-ui          | $^1$     |
| 日本語      | @JonathanKwok            | $^2$     |
| Русский  | @MCheping8108 @vanja-san | $^{1,2}$ |
| Français | @MCheping8108            | $^{1,2}$ |

$^1$ `需要修改。` 部分用词或短语可能在上下文中不合适。需要母语人士进一步修改。

$^2$ `需要补全。` 标蓝的（即未被批准的）字符串是机翻的。需要母语人士进一步修改。

## 贡献

要添加一个新语言翻译，

1. 开启一个 issue 并指定语言和国家/地区。
2. 点击下方徽章来帮助参与翻译：

[![Crowdin](https://badges.crowdin.net/mihoyo-mixed-launcher/localized.svg)](https://crowdin.com/project/mihoyo-mixed-launcher)

# 其他

- `electron-store` 存储条目备忘：
    - `targetVersion` 算上忽略更新后的（伪）当前版本
    - `mainBgPath` 主页背景图片的 `base64`
    - `dialogStyle` 非游戏界面的弹窗样式
    - `gsLauncherPath` 原神官方启动器所在目录
    - `gsGamePath` 原神游戏本体可执行文件的路径
    - `gsUpd` 原神当前版本已更新
    - `gsInfo` 原神账号信息
    - `srLauncherPath`
    - `srGamePath`
    - `srUpd`
    - `srInfo`
    - `hi3LauncherPath`
    - `hi3GamePath`
    - `hi3Upd`
    - `gsCostume` 原神显示衣装立绘 ~~（国服会痛失原皮莫娜哦）~~
    - `windowState` 上次关闭时的窗口状态
      - `width` 窗口宽度
      - `height` 窗口高度
      - `isMax` 窗口是否最大化
    - `autoEnterGamepad` 连接到手柄时自动进入手柄模式
    - `gamepadDisableMouse` 手柄模式禁用鼠标操作
    - `showGamepadToolbar` 在手柄模式中显示底部键位操作栏
- `localStorage` 存储条目备忘：
  - `lang` 语言设置
  - `colorTheme` 颜色主题设置
