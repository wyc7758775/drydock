# Plan

## 目标

（一句话：这次要解决什么）

## 约束

- （不能动的东西 / 必须遵守的既有规则）

## 方案

（关键取舍，以及为什么不选另外两条路）

## Tasks

- [x] R1 前端源码内部标识全量改名 · evidence: sed 全量替换 38 个文件；grep -rn -i -E "noteshare|note-share" src src-tauri/src ... → 0 行；typecheck exit 0
- [x] R2 Tauri 配置改名 · evidence: productName=Drydock、identifier=com.yoran.drydock、window title、updater endpoints → github.com/wyc7758775/drydock
- [x] R3 磁盘清单目录 .noteshare → .drydock · evidence: lib.rs vault.join(".drydock")；dev-server.mjs 同步；cargo check exit=0
- [x] R4 包名改名 · evidence: package.json/Cargo.toml name=drydock + [lib] drydock_lib；产物 drydock.exe
- [x] R5 可见文案改名 · evidence: index.html / VaultSwitcher / README / AGENTS.md 均已是 Drydock
- [x] R6 发布与脚本链路改名 · evidence: release.yml / 启动.bat / start-*.cmd / server / docker-compose
- [x] R7 残留扫描门禁 · evidence: grep -rn -i -E "noteshare|note_share|note-share" → wc -l = 0
- [x] R8 改名后回归全绿 · evidence: check:i18n ✓392；check:theme ✓；typecheck 0；lint 79 warnings 0 errors；vite build ✓；cargo check 0；tauri build ✓
- [x] R9 GitHub 仓库改名 note-share → drydock + remote 改写 · evidence: curl PATCH API → HTTP 200 full_name=wyc7758775/drydock；remote 已改写；旧 URL 301 → 新 URL 200
- [~] R10 本地目录重命名（守护进程等待 pi 退出） · evidence: 已杀 tauri dev/vite/esbuild/drydock.exe；pi 自身 cwd 占用无法重命名；后台守护进程跑着（本轮复查：仍存活），每 3s 重试、上限 30 分钟，pi 退出即改名并写 %TEMP%\drydock-rename.log
- [x] K1 应用图标：直接使用提供的 船舶.svg · evidence: assets/brand/drydock-icon.svg = 用户提供的 船舶.svg（原封不动）；public/favicon.svg 同步
- [x] K2 图标生成走 tauri icon，删除 make-icons.mjs · evidence: package.json "icons": "tauri icon assets/brand/drydock-icon.svg"；rm scripts/make-icons.mjs；icns/ico/Square*/android/ios 全套重生
- [x] K3 图标多尺寸目检 + exe 内嵌图标验证 · evidence: tauri build --no-bundle → drydock.exe；PowerShell ExtractAssociatedIcon 抽 exe 内嵌图标 → 已目检为船图标；16/32/512 逐档看过
- [x] K4 品牌文档 docs/branding.md · evidence: docs/branding.md：名字由来、图标来源与授权风险提示、三色表、小尺寸说明、生成与目检清单、改名范围与回滚
- [x] W1 皮卡丘图标全局替换为 DrydockMark（含删除 PikachuLogo 组件） · evidence: grep -rn "Pikachu|皮卡丘" src/ index.html README.md AGENTS.md docs/ → 0 行；icons.tsx 删除 PikachuLogo 组件；App.tsx 启动屏 72px、EmptyState 104px 改用 DrydockMark；typecheck exit 0；lint 79 warnings 0 errors
- [x] W2 窗口尺寸记忆：拖拽后落盘，下次打开恢复 · evidence: backend/window-size.ts：readSaved/writeSaved/trackMainWindowSize（400ms 防抖、最大化不覆盖、clamp 到屏幕与最小尺寸、picker 形态不记录）；App.tsx 挂 trackMainWindowSize，冷启动直接进工作区也调 setMainWindowSize。CDP 实测：原生窗口改 1000x700 → localStorage saved={w:986,h:692}；最大化 → saved 不变；杀进程冷启动 → 窗口恢复为 1001x701（inner 986x692，居中）
- [x] C1 新增 vault 绝对路径拼接 helper（Windows/Unix 分隔符）+ 中英词条 copyRelativePath/copyAbsolutePath · evidence: src/lib/files.ts 新增 joinVaultPath（去根尾分隔符、rel 统一正斜杠、分隔符跟随根）；node 实测：D:\notes + a/b.md → D:\notes\a\b.md，/Users/me/notes + a/b.md → /Users/me/notes/a/b.md，空 rel → 根；check:i18n ✓394
- [x] C2 目录树全部行类型（文件夹/笔记/图片/PDF/手绘/白板）右键菜单接入复制相对/绝对路径，vaultRoot 从 Sidebar 贯穿递归树 · evidence: FileTree 7 处菜单全部接 pathMenuItems（文件夹/笔记/图片/PDF/手绘/白板/其他附件兜底），grep 计数 7；vaultRoot 由 Sidebar.currentVault.path 贯穿递归 FileTree；typecheck exit 0
- [x] C3 回归验证：i18n/typecheck/lint/build + helper 实测 + 浏览器右键菜单烟测 · evidence: check:i18n ✓394；typecheck exit 0；lint 0 errors/79 warnings（均为既有警告）；vite build ✓；CDP 烟测 note AI-Agent-Book/00-引言.md rel=AI-Agent-Book/00-引言.md abs=D:/ProgramData/NoteShare/AI-Agent-Book/00-引言.md，folder AI-Agent-Book 同样正确，输出 UI_SMOKE_OK

## 验收

- （可执行的验证命令，以及期望结果）

## 风险

- （回滚方式 / 可能出问题的地方）
