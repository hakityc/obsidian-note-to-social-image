# 📸 Note to Social Image

> 选中文字，一键生成小红书/抖音/朋友圈风格的分享图片

[![Obsidian](https://img.shields.io/badge/Obsidian-1.5%2B-7C3AED?logo=obsidian)](https://obsidian.md)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

![](https://img.shields.io/badge/styles-12-FF6B6B)

---

## ✨ 12 种卡片风格

| | 风格 | 视觉 |
|---|------|------|
| 🫧 | **玻璃拟态** | 紫蓝渐变 · 毛玻璃 · 弥散光晕 |
| ◼️ | **瑞士极简** | 红黑白 · Helvetica · 网格系统 |
| 🎞️ | **暗色噪点** | 胶片颗粒 · 琥珀金 · 电影感 |
| 🍱 | **便当网格** | 柔色模块 · 圆角 · Apple 风 |
| ⚠️ | **新粗野主义** | 粗黑边框 · 荧光黄 · 硬阴影 |
| 🌸 | **柔和粉彩** | 莫兰迪色 · 流体圆角 · 治愈 |
| 🌅 | **渐变双色调** | 深蓝渐变 · 渐变文字 · 高对比 |
| 🔷 | **孟菲斯风** | 几何图形 · 撞色 · 80s 波普 |
| 📰 | **杂志排版** | 首字下沉 · 衬线体 · VOGUE 风 |
| 🫧 | **有机流体** | SVG 椭圆 · 柔渐变 · 呼吸感 |
| 🌆 | **复古霓虹** | 赛博朋克 · 霓虹灯 · Synthwave |
| 🎋 | **水墨留白** | 楷体 · 墨韵 · 东方禅意 |

---

## 🚀 使用

1. **安装插件** — 通过 BRAT 或手动放入 `.obsidian/plugins/`
2. **启用** — 设置 → 第三方插件 → 启用 Note to Social Image
3. **选中文字** — 在任意笔记中选中要分享的内容
4. **触发导出** — 三种方式任选：

| 方式 | 操作 |
|------|------|
| 右键菜单 | 选中 → 右键 →「导出为分享图片」|
| 命令面板 | `Cmd+P` →「选中文字导出为分享图片」|
| Ribbon 图标 | 左侧工具栏 📷 |

5. **选择风格** — 悬停预览效果，按 `1-12` 快速选择
6. **自动保存** — PNG 保存到 `attachments/social-images/`，自动复制到剪贴板

---

## ⌨️ 快捷键

| 键 | 功能 |
|----|------|
| `1`-`9` | 快速选择对应风格 |
| `Enter` | 使用默认风格快速导出 |
| `Esc` | 关闭选择器 |

---

## 🔧 安装

### 方法一：BRAT（推荐）
1. 安装 [BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件
2. 添加 Beta 插件：`hakityc/obsidian-note-to-social-image`

### 方法二：手动
```bash
cd your-vault/.obsidian/plugins
git clone https://github.com/hakityc/obsidian-note-to-social-image.git
cd obsidian-note-to-social-image
npm install
npm run build
```

---

## 🛠 开发

```bash
npm install
npm run dev     # watch 模式
npm run build   # 生产构建
```

---

## 📄 License

MIT © [haki](https://github.com/hakityc)
