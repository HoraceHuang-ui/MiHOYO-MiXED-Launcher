# miHoYo miXED Launcher
米家聚合启动器 by HoraceHyy
# 待办清单 / TODO List
- [x] **支持启动游戏。** Game launch available.
- [x] **支持自定义游戏路径。** Game path customizable.
- [x] **支持原神、星铁、崩坏3。** `Genshin Impact`, `Honkai Star Rail`, `Honkai Impact 3rd` supported.
- [ ] **待支持撅区零。** `Zenless Zone Zero` to be supported.
- [ ] **界面、用户体验优化。** UI/UX optimization.
- [ ] **国际化支持。** I18n.
- [x] **原神分析玩家游戏数据。** Analyze player info for Genshin Impact.
  - [x] 获取数据 / Retrieve data
  - [x] 呈现数据 / Display data
- [x] **星铁分析玩家游戏数据。** Analyze player info for Honkai Star Rail.
  - [x] 获取数据 / Retrieve data
  - [x] 呈现数据 / Display data
# Notes
- 本程序检测自身更新目前用的是`GitHub API`，但一旦把含token的代码同步到这里就会自动销毁，所以构建时请自行申请一个token，放在`electron/main/index.ts`的`Octokit.auth`中。
# Credits
- [electron-vite/electron-vite-vue](https://github.com/electron-vite/electron-vite-vue)
- [Enka.Network](https://enka.network) | [API docs](https://github.com/EnkaNetwork/API-docs)
- [Mar-7th/MiHoMo API](https://march7th.xiaohei.moe/zh/resource/mihomo_api.html) | [Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes)
# 截图 / Screenshots
- **进入应用时加载页面** Loading screen when entering app
<img width="500" alt="微信截图_20230818161600" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/ece4c240-c58d-4587-b411-35b347fb7881">

<p></p>

- **应用主页（背景图片可自定义）** App main page, background image customizable (Pixiv @anna_drw01)
<img width="500" alt="微信截图_20230827162604" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/2340f76c-c258-40ce-8863-d71e0046a2d4">

<p></p>

- **原神启动页** Genshin Impact launcher page
<img width="500" alt="微信截图_20230818161641" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/ee98c98b-13c0-4dc6-a238-22fa36acec5b">

<p></p>

- **原神玩家信息（从启动页滚动即可）** Genshin Impact player info (accessed by scrolling on Genshin Impact launcher page)
<img width="500" alt="微信截图_20230827162742" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/fe9a3c16-dbe8-4372-979d-18e7b0febe1e">

<p></p>

- **崩坏：星穹铁道启动页** Honkai: Star Rail launcher page
<img width="500" alt="微信截图_20230823161806" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/43efa2ce-4113-4171-b133-807cf0817e47">

<p></p>

- **崩坏：星穹铁道玩家信息（从启动页滚动即可）** Honkai: Star Rail player info (accessed by scrolling on Honkai: Star Rail launcher page)
<img width="500" alt="微信截图_20230827162839" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/9ddc5022-913f-4266-ab83-c926ce780a07">

<p></p>

- **崩坏3rd启动页** Honkai Impact 3rd launcher page
<img width="500" alt="微信截图_20230818161449" src="https://github.com/HoraceHuang-ui/MiHOYO-MiXED-Launcher/assets/67905897/57506b03-b13e-4d84-8e0f-e6cc7003ecbd">

# 屎山代码的后果
- `electron-store` 存储条目备忘：
  - `targetVersion` 算上忽略更新后的（伪）当前版本
  - `mainBgPath` 主页背景图片的base64（若用户已设定）
  - `genshinPath` 原神官方启动器所在目录
  - `genshinUpd` 原神当前版本已更新
  - `genshinInfo` 原神账号信息
  - `genshinConstels` 原神命座加成json
  - `starRailPath`
  - `starRailUpd`
  - `starRailInfo`
  - `honkai3Path`
  - `honkai3Upd`
