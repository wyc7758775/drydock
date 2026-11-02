// 桌面端窗口尺寸策略（Obsidian 式）：启动页小窗、工作区大窗。
// 工作区尺寸会记住上次——resize 防抖落盘，下次进工作区按记忆恢复（最大化时不覆盖记忆值）。
// web 模式 / 窗口 API 不可用时静默跳过，不影响页面本身。
import { LogicalSize, getCurrentWindow } from "@tauri-apps/api/window";

const PICKER = new LogicalSize(720, 540);
const MAIN = new LogicalSize(1280, 820);
const MIN_W = 560; // 与 tauri.conf.json 的 minWidth 对齐
const MIN_H = 420; // 与 tauri.conf.json 的 minHeight 对齐
const KEY = "drydock.window.main";
const DEBOUNCE_MS = 400;

type Mode = "picker" | "main";

/** 当前窗口处于哪种形态：决定 resize 是否值得记下来（启动小窗的尺寸不覆盖工作区尺寸） */
let mode: Mode | null = null;

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(Math.round(v), lo), hi);
}

/** 可用屏幕尺寸（拿不到就不做上限裁剪） */
function screenMax() {
  const w = typeof screen !== "undefined" ? screen.availWidth : 0;
  const h = typeof screen !== "undefined" ? screen.availHeight : 0;
  return { w: w > 0 ? w : 8192, h: h > 0 ? h : 8192 };
}

/** 读记忆尺寸；无记录或数值不合法 → null（回退默认大窗） */
function readSaved(): LogicalSize | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { w?: unknown; h?: unknown };
    const w = Number(v?.w);
    const h = Number(v?.h);
    if (!Number.isFinite(w) || !Number.isFinite(h)) return null;
    const max = screenMax();
    return new LogicalSize(clamp(w, MIN_W, max.w), clamp(h, MIN_H, max.h));
  } catch {
    return null;
  }
}

function writeSaved(w: number, h: number) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ w: Math.round(w), h: Math.round(h) }));
  } catch {
    /* 隐私模式/配额满：记不住就记不住，不影响使用 */
  }
}

async function apply(size: LogicalSize, center: boolean) {
  try {
    const win = getCurrentWindow();
    await win.setSize(size);
    if (center) await win.center();
  } catch {
    /* 非 Tauri 环境或权限缺失：保持当前尺寸 */
  }
}

export function setPickerWindowSize() {
  mode = "picker";
  return apply(PICKER, true);
}

/** 进工作区：有记忆尺寸按记忆，没有则用默认大窗 */
export function setMainWindowSize() {
  mode = "main";
  return apply(readSaved() ?? MAIN, true);
}

/**
 * 开始记录工作区窗口尺寸。只在 main 形态下记；拖拽 resize 防抖 400ms 落盘。
 * 返回卸载函数（App 卸载时调用）。
 */
export function trackMainWindowSize(): () => void {
  let timer: number | undefined;
  const flush = async () => {
    // 最大化/全屏时的 innerWidth 不是用户设定的尺寸，不该写进记忆
    try {
      if (await getCurrentWindow().isMaximized()) return;
    } catch {
      /* 非 Tauri：照常记录 */
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w < MIN_W || h < MIN_H) return;
    writeSaved(w, h);
  };
  const onResize = () => {
    if (mode !== "main") return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => void flush(), DEBOUNCE_MS);
  };
  window.addEventListener("resize", onResize);
  return () => {
    window.removeEventListener("resize", onResize);
    window.clearTimeout(timer);
  };
}
