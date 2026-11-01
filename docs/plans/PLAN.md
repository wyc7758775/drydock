# Plan

## 目标

（一句话：这次要解决什么）

## 约束

- （不能动的东西 / 必须遵守的既有规则）

## 方案

（关键取舍，以及为什么不选另外两条路）

## Tasks

- [x] R1 前端源码内部标识全量改名：localStorage key / 事件名 / MIME / 卡片链接协议 / excalidraw source · evidence: sed 全量替换 38 个文件（NoteShare/noteShare/NOTESHARE/noteshare/note-share 五种写法）；grep -rn -i -E "noteshare|note-share" src src-tauri/src ... → 0 行；npm run typecheck -> exit 0
- [x] R2 Tauri 配置改名：productName / window title / identifier / updater endpoints · evidence: tauri.conf.json：productName=Drydock、identifier=com.yoran.drydock、window title=Drydock、updater endpoints → github.com/wyc7758775/drydock；实机已生成 %APPDATA%\com.yoran.drydock
- [x] R3 磁盘清单目录 .noteshare → .drydock（Rust + dev-server 同步） · evidence: lib.rs vault.join(".drydock")；dev-server.mjs path.join(abs, ".drydock", "vault.json")；cargo check exit=0；实机 D:/ProgramData/NoteShare/.drydock/vault.json 已生成
- [x] R4 包名改名：npm / Cargo / [lib] name / main.rs，产物 drydock.exe · evidence: package.json name=drydock；Cargo.toml name=drydock + [lib] name=drydock_lib；main.rs；tauri build 产物 = target/release/drydock.exe（13.7MB）
- [x] R5 可见文案改名：index.html / VaultSwitcher / README / AGENTS.md · evidence: index.html <title>Drydock；VaultSwitcher wordmark=Drydock；README 标题与两个 badge；AGENTS.md # Drydock 架构纪律
- [x] R6 发布与脚本链路改名：release.yml / 启动.bat / start-*.cmd / server · evidence: release.yml releaseName 与 web.zip url；启动.bat 3 处；start-dev.cmd + start-vite.cmd；server/publish-server.mjs 头注释；docker-compose 容器名 drydock-publish
- [x] R7 残留扫描门禁：代码与配置里搜不到 noteshare / note_share / note-share · evidence: grep -rn -i -E "noteshare|note_share|note-share" 11 个代码/配置路径 + assets -> 0 行（wc -l = 0），exit 0
- [x] R8 改名后回归：lint / typecheck / check:i18n / check:theme / build / cargo 全绿 · evidence: check:i18n ✓ 392 key；check:theme ✓ 36/35/2 套；typecheck exit 0；lint ✖ 79 problems (0 errors，与基线同数)；vite build ✓ 17.60s；cargo check exit 0；tauri build --no-bundle ✓ release 1m28s
- [ ] R9 手动两步（我做不了，需你操作）：GitHub repo 改名 + 本地目录重命名 · evidence: 未执行（需用户操作）：GitHub 仓库改名、重命名本地目录 D:\programer\note-share（pi 正跑在这个目录里，不能自己重命名）。代码侧 URL 已全部指向新仓
- [x] K1 品牌母本 SVG（干船坞方案）与 16px 简化版 · evidence: assets/brand/drydock-icon.svg（1024 画板）；assets/brand/drydock-mark-16.svg（16 网格填充剪影）
- [x] K2 图标生成改走 tauri icon（npm run icons），移除旧的 make-icons.mjs · evidence: package.json "icons": "tauri icon assets/brand/drydock-icon.svg"；rm scripts/make-icons.mjs；tauri icon 输出 icns/ico/32/128/128@2x/Square*/android/ios 全套
- [x] K3 多尺寸目检与修形（16/32/128/512） · evidence: 对 render 迭代 12 轮，每轮读 icon.png / 32x32.png 目检：依次修掉“碗”、“相框”、“礼帽”、“拖鞋”、“长腿托盘”，最终 32/512 两档可读为“船架在三块墩上”；水位线从背景入船体（Plimsoll 记号），墩子改等高
- [x] K4 应用内 logo：icons.tsx 新增 DrydockMark，VaultSwitcher wordmark 换用它 · evidence: icons.tsx 新增 DrydockMark（两个填充路径，currentColor）；VaultSwitcher 改用 <DrydockMark size={26}/> + Drydock 文字；PikachuLogo 保留在 EmptyState/App.tsx；typecheck exit 0，lint 79 warnings 0 errors
- [x] K5 品牌文档 docs/branding.md · evidence: docs/branding.md：名字由来、图标元素几何/色值表、三条比例规则、色值归属、16px 简化规则（含为何去掉墩子）、生成与目检清单、改名范围与回滚
- [x] K6 实机目检：exe 内嵌图标与 16px wordmark 渲染 · evidence: npm run tauri build -- --no-bundle -> 产出 src-tauri/target/release/drydock.exe；PowerShell [Icon]::ExtractAssociatedIcon 抽取 exe 内嵌图标 → 32x32 PNG 已目检为新船坞标志（即任务栏/开始菜单/安装包所用图标）；16px wordmark 另以 g=currentColor 预览图目检

## 验收

- （可执行的验证命令，以及期望结果）

## 风险

- （回滚方式 / 可能出问题的地方）
