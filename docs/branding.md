# 品牌规范：Drydock

> 权威在 `assets/brand/`（母本 SVG）+ 本文件（规则）。`src-tauri/icons/` 下所有产物都是
> 从母本跑出来的，**不要手改**；改形状只改母本，然后 `npm run icons` 重生。

## 一、名字从哪来

**Drydock = 干船坞。** 取自古希腊的「忒修斯之船」悖论：

> 忒修斯凯旋坐的那艘船被雅典人保存下来，木板一块块烂、一块块换。等船上每块木头都换过一遍，
> 它还是原来那艘船吗？

这个悖论真正问的不是船，而是**"事物的身份靠什么维持"**——靠构成它的材料，还是靠连续不断的
维护过程。程序员对它的态度一向很务实：**"废话，还是那艘——我亲眼看着它换的。"**

于是有了本产品的定位：

> 以前人类程序员划船，现在 AI 划船，人类的工作变成**换木板防止船沉**。

船沉不沉，不取决于某一版代码、某一次发布，取决于**有没有人在持续地换掉烂木板**
（维护干净环境、盯住劣化、把偏差收回去）。这就是 Drydock 要做的事：让项目一直开得动。

干船坞是这个隐喻的工作现场——**船开进来、水抽干、架在墩子上检修，修好再放回去**。
它同时是"厂房"（派活的地方）和"检修所"（维护的地方），所以比 Foundry（只讲生产）
或 Slipway（只讲下水）更能覆盖产品目标。

## 二、图标（应用图标）

母本：`assets/brand/drydock-icon.svg` —— **直接使用的第三方图标素材（船舶.svg）**，未经修改。
`public/favicon.svg` 是同一份文件。

风格：**线条描述 + 平铺素色**。只用三个色，无渐变、无阴影。

| 色值 | 角色 | 用在哪 |
|---|---|---|
| `#2C7978` | 深青 | 船体外描边、桅杆、栏杆、波浪 |
| `#AEDCDC` | 浅青 | 船体填充、吃水线下层 |
| `#F4F4F4` | 米白 | 背后的圆形（落日/天空） |

三个色值是**固定品牌色，不进主题 token**。再增加颜色就会失去"素"的属性，所以没有第四色。

> ⚠️ **授权风险**：这份素材来自图标库（iconfont 类平台，带 `p-id` / `class="icon"` 标记），
> 自己用没问题，但**上应用商店或对外分发前必须确认授权**——商用素材通常需购买或按授权协议署名。
> 若拿不到授权，回退方案是 `git log` 里之前几版自绘图标（船坞 + 龙骨墩）。

### 小尺寸注意

这幅图细节多（栏杆格、桅杆、双层波浪），30–32px 档会偏软——这是素材本身的密度导致的，
不是生成管道的问题（`tauri icon` 直接从矢量光栅化，没经过位图缩放）。如果要更硬的小尺寸图标，
只能另画一张简化版给 16/32 用。

## 三、16px 简化版（应用内 wordmark）

母本：`assets/brand/drydock-mark-16.svg`，React 侧实现在
`src/components/icons.tsx` 的 `DrydockMark`。

桌面/任务栏 16px 档下，母本里的**吃水线标记、舷缘高光、龙骨墩**都会糊成噪点，
所以 16px 版只保留船的剪影：

- 两笔填充（`fill="currentColor"`）：船体（斜首柱 + 平龙骨）、驾驶舱
- 它是 **Logo 不是 UI 图标**，因此不跟 `docs/icon-theme.md` 的描边规范；但网格仍是 16×16、
  视觉中心落在网格上，可与 `I` 里的线框图标并排
- 省略龙骨墩与坞底：抽干水的语义由**应用图标**承载，wordmark 位置只需要的“这是一艘船”
- 曾试过保留两块墩子/坞底线，在 26px 下会读成“长腿的托盘”或“小推车”，故去掉

新增/修改品牌标志时，母本与 16px 版**必须同时改**。

## 四、生成与校验

```bash
npm run icons    # = tauri icon assets/brand/drydock-icon.svg
```

一条命令重生 `src-tauri/icons/` 全套：`icon.ico` / `icon.png` / `32x32` / `128x128` /
`128x128@2x` / `icon.icns` / `Square*Logo` / `android/` / `ios/`。

浏览器模式的标签页图标用 `public/favicon.svg`（复制自母本），改母本时一并同步。

> ⚠️ **改了图标记得强制重编 Rust**：图标是编译期嵌进可执行文件的，而 `cargo build`
> 不会因为 `src-tauri/icons/` 变了就重链。只跑 `npm run icons` 的话，`tauri dev` 启动的
> 还是旧图标（cargo 报 up to date）。正确顺序：
>
> ```bash
> npm run icons && touch src-tauri/build.rs && cd src-tauri && cargo build
> ```

目检清单（改形后必过）：

- 512 与 32 两档都看得懂"船被架在墩子上"
- 船首斜柱在 32px 仍是一条斜线，不糊成圆角
- 三个墩子在 32px 仍数得出是"块"而不是"腿"

## 五、改名范围（note-share → Drydock，一次性完成，不做兼容）

本项目在开发期、单人使用，因此**品牌名当作改了，连内部标识一起换**：

| 类别 | 改后 |
|---|---|
| Tauri `productName` / 窗口标题 / `index.html` 标题 | `Drydock` |
| Tauri `identifier` | `com.yoran.drydock`（`%APPDATA%` 目录随之更换，偏好会重建一次） |
| 包名（npm / Cargo） | `drydock`，产物 `drydock.exe` |
| localStorage key | `drydock.prefs` / `drydock.lang` / `drydock.sideWidth` … |
| vault 内清单目录 | `.drydock/vault.json`（旧的 `.noteshare/` 不再读写，可删） |
| 画板卡片链接协议 / MIME / 自定义事件名 | `drydock://` / `application/x-drydock-*` / `drydock:*` |
| 更新源 | `github.com/wyc7758775/drydock/releases/...` |

回滚方式：这些都是文本替换，`git revert` 对应提交即可；但**回滚后旧偏好和旧 vault
清单不会自动回来**，需要重新设置一次。
