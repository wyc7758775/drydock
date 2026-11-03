// 文件名工具（独立成模块，避免组件文件混入非组件导出导致 Fast Refresh 失效）
export function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|#^[\]]/g, "").trim();
}

/** 拼接 vault 绝对根与相对路径。相对路径约定用正斜杠（见 backend/types.ts），
 *  输出分隔符跟随根路径：Windows 根用反斜杠时输出反斜杠，其余用正斜杠。 */
export function joinVaultPath(root: string, rel: string): string {
  const base = root.replace(/[\\/]+$/, "");
  const child = rel.replace(/\\/g, "/").replace(/^\/+/, "");
  const sep = base.includes("\\") ? "\\" : "/";
  if (!base) return child;
  return child ? `${base}${sep}${child.replace(/\//g, sep)}` : base;
}
