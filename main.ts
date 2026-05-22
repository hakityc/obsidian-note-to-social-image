import { App, Plugin, PluginSettingTab, Setting, Notice, Modal, MarkdownView, TFile, normalizePath } from "obsidian";
import html2canvas from "html2canvas";

// ============================================================
// 风格预设
// ============================================================
interface CardStyle {
    id: string;
    name: string;
    description: string;
    icon: string;
    render: (text: string, title: string) => string;
}

// 获取当前时间的格式化字符串
function getTimeStr(): string {
    const now = new Date();
    return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// 纯文本提取（去掉 markdown 标记）
function stripMarkdown(text: string): string {
    return text
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/!\[\[.+?\]\]/g, '')
        .trim();
}

const CARD_WIDTH = 750;

const STYLES: CardStyle[] = [
    // ================================================================
    // 1. 玻璃拟态 (Glassmorphism)
    // ================================================================
    {
        id: "glassmorphism",
        name: "玻璃拟态",
        description: "毛玻璃 + 弥散光晕 + 通透感",
        icon: "🫧",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding:60px 50px 50px; font-family:-apple-system,'PingFang SC','Hiragino Sans GB',sans-serif; border-radius:28px; box-sizing:border-box; position:relative; overflow:hidden;">
  <div style="position:absolute;top:-80px;right:-80px;width:280px;height:280px;background:rgba(255,255,255,0.08);border-radius:50%;filter:blur(40px);"></div>
  <div style="position:absolute;bottom:-60px;left:-40px;width:200px;height:200px;background:rgba(255,255,255,0.06);border-radius:50%;filter:blur(30px);"></div>
  <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:20px;border:1px solid rgba(255,255,255,0.25);padding:36px 32px;position:relative;">
    ${title ? `<div style="font-size:26px;font-weight:800;color:#FFFFFF;margin-bottom:16px;line-height:1.3;letter-spacing:-0.3px;text-shadow:0 2px 10px rgba(0,0,0,0.1);">${title}</div>` : ''}
    <div style="font-size:15px;color:rgba(255,255,255,0.92);line-height:2;letter-spacing:0.2px;">
      ${lines.map((l, i) => i === 0 && l.length < 30
        ? `<div style="font-size:19px;font-weight:600;color:#FFFFFF;margin-bottom:12px;">${l}</div>`
        : `<div style="margin-bottom:6px;">${l}</div>`
      ).join('')}
    </div>
  </div>
  <div style="margin-top:20px;text-align:right;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.5px;">${getTimeStr()}</div>
</div>`;
        }
    },

    // ================================================================
    // 2. 瑞士极简 (Swiss Minimal)
    // ================================================================
    {
        id: "swiss-minimal",
        name: "瑞士极简",
        description: "Helvetica 排版 + 红黑白 + 网格系统",
        icon: "◼️",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:#FBFBFB; padding:0; font-family:'Helvetica Neue',-apple-system,'PingFang SC',sans-serif; border-radius:0; box-sizing:border-box; position:relative; overflow:hidden; border:1px solid #E8E8E8;">
  <div style="height:8px;background:#E53935;"></div>
  <div style="padding:48px 44px 40px;">
    ${title ? `<div style="font-size:32px;font-weight:900;color:#1A1A1A;margin-bottom:6px;line-height:1.1;letter-spacing:-1px;text-transform:uppercase;">${title}</div>` : ''}
    <div style="width:48px;height:4px;background:#E53935;margin-bottom:28px;"></div>
    <div style="font-size:15px;color:#3A3A3A;line-height:2;letter-spacing:0.2px;font-weight:400;">
      ${lines.map((l, i) => i === 0
        ? `<div style="font-size:18px;font-weight:600;color:#1A1A1A;margin-bottom:14px;">${l}</div>`
        : l.startsWith('- ') || l.startsWith('• ')
          ? `<div style="padding-left:20px;position:relative;margin-bottom:4px;"><span style="position:absolute;left:0;color:#E53935;font-weight:700;">—</span>${l.replace(/^[-•]\s*/, '')}</div>`
          : `<div style="margin-bottom:6px;">${l}</div>`
      ).join('')}
    </div>
    <div style="margin-top:36px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #E8E8E8;padding-top:20px;">
      <span style="font-size:10px;color:#999;font-weight:600;letter-spacing:2px;text-transform:uppercase;">${getTimeStr()}</span>
      <span style="font-size:10px;color:#E53935;font-weight:700;">OBSIDIAN</span>
    </div>
  </div>
</div>`;
        }
    },

    // ================================================================
    // 3. 暗色噪点 (Grainy Noir)
    // ================================================================
    {
        id: "grainy-noir",
        name: "暗色噪点",
        description: "胶片颗粒 + 琥珀色点缀 + 电影感",
        icon: "🎞️",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:#1A1817; padding:52px 44px 44px; font-family:'Georgia','Times New Roman','PingFang SC',serif; border-radius:16px; box-sizing:border-box; position:relative; overflow:hidden;">
  <div style="position:absolute;inset:0;background-image:url('data:image/svg+xml,<svg viewBox=\\'0 0 256 256\\' xmlns=\\'http://www.w3.org/2000/svg\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23n)\\' opacity=\\'0.04\\'/></svg>');opacity:0.6;pointer-events:none;"></div>
  <div style="position:relative;z-index:1;">
    <div style="width:32px;height:2px;background:#D4A574;margin-bottom:32px;"></div>
    ${title ? `<div style="font-size:30px;font-weight:700;color:#E8D5C0;margin-bottom:8px;line-height:1.2;letter-spacing:-0.5px;">${title}</div>` : ''}
    <div style="font-size:16px;color:#B8956E;line-height:2.2;letter-spacing:0.3px;">
      ${lines.map((l, i) => i === 0
        ? `<div style="font-size:18px;color:#D4A574;margin-bottom:14px;font-style:italic;">${l}</div>`
        : `<div style="margin-bottom:8px;color:#C8B8A8;">${l}</div>`
      ).join('')}
    </div>
    <div style="margin-top:36px;display:flex;gap:12px;">
      <span style="border:1px solid #3A3530;color:#8A7A68;padding:4px 14px;border-radius:2px;font-size:10px;letter-spacing:1px;text-transform:uppercase;font-family:-apple-system,sans-serif;">Note</span>
      <span style="border:1px solid #3A3530;color:#8A7A68;padding:4px 14px;border-radius:2px;font-size:10px;letter-spacing:1px;text-transform:uppercase;font-family:-apple-system,sans-serif;">Obsidian</span>
    </div>
    <div style="margin-top:20px;font-size:10px;color:#5A5048;letter-spacing:1px;">${getTimeStr()}</div>
  </div>
</div>`;
        }
    },

    // ================================================================
    // 4. 便当网格 (Bento Grid)
    // ================================================================
    {
        id: "bento-grid",
        name: "便当网格",
        description: "圆角模块 + 柔色块 + Apple 风",
        icon: "🍱",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            const colors = ['#F2F0F5', '#E8F4F8', '#F0F4E8', '#FDF2F0', '#F0EEFA'];
            return `
<div style="width:${CARD_WIDTH}px; background:#FFFFFF; padding:36px; font-family:-apple-system,'PingFang SC','Hiragino Sans GB',sans-serif; border-radius:24px; box-sizing:border-box; position:relative;">
  <div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:12px;">
    ${title ? `<div style="grid-column:1/-1;background:${colors[0]};border-radius:18px;padding:24px 28px;">
      <div style="font-size:24px;font-weight:700;color:#1D1D1F;line-height:1.3;">${title}</div>
      <div style="font-size:12px;color:#86868B;margin-top:6px;">${getTimeStr()}</div>
    </div>` : ''}
    ${lines.map((l, i) => {
        const span = i === 0 ? '1/-1' : 'auto';
        const bg = colors[(i + (title ? 1 : 0)) % colors.length];
        return `<div style="grid-column:${span};background:${bg};border-radius:16px;padding:20px 22px;">
          <div style="font-size:14px;color:#1D1D1F;line-height:1.7;font-weight:${i === 0 ? '600' : '400'};font-size:${i === 0 ? '17px' : '14px'};">${l}</div>
        </div>`;
    }).join('')}
  </div>
  <div style="margin-top:16px;text-align:center;font-size:10px;color:#C7C7CC;">Made with Obsidian</div>
</div>`;
        }
    },

    // ================================================================
    // 5. 新粗野主义 (Neo-Brutalist)
    // ================================================================
    {
        id: "neo-brutalist",
        name: "新粗野主义",
        description: "粗黑边框 + 荧光黄 + 反精致",
        icon: "⚠️",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:#FFFBE6; padding:0; font-family:'Arial Black','Impact','PingFang SC',sans-serif; box-sizing:border-box; position:relative; border:5px solid #000000; box-shadow:12px 12px 0 #000000;">
  <div style="padding:44px 38px 38px;">
    ${title ? `<div style="display:inline-block;background:#000000;color:#FFE600;padding:8px 20px;font-size:24px;font-weight:900;margin-bottom:24px;letter-spacing:-0.5px;">${title}</div>` : ''}
    <div style="font-size:16px;color:#000000;line-height:1.9;font-weight:700;font-family:-apple-system,'PingFang SC',sans-serif;">
      ${lines.map((l, i) => i === 0
        ? `<div style="background:#000000;color:#FFE600;padding:12px 16px;margin-bottom:16px;font-size:17px;display:inline-block;">${l}</div>`
        : `<div style="margin-bottom:10px;padding:4px 0;border-bottom:3px solid #000000;">${l}</div>`
      ).join('')}
    </div>
    <div style="margin-top:28px;display:flex;gap:10px;flex-wrap:wrap;">
      <span style="border:3px solid #000000;padding:6px 16px;font-size:12px;font-weight:900;font-family:-apple-system,sans-serif;">#RAW</span>
      <span style="border:3px solid #000000;background:#FFE600;padding:6px 16px;font-size:12px;font-weight:900;font-family:-apple-system,sans-serif;">#REAL</span>
    </div>
    <div style="margin-top:20px;font-size:10px;font-weight:700;text-align:right;">${getTimeStr()}</div>
  </div>
</div>`;
        }
    },

    // ================================================================
    // 6. 柔和粉彩 (Soft Pastel)
    // ================================================================
    {
        id: "soft-pastel",
        name: "柔和粉彩",
        description: "莫兰迪色系 + 圆润 + 治愈感",
        icon: "🌸",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:linear-gradient(160deg, #F5F0F0 0%, #F0EEF5 40%, #F0F2F5 100%); padding:50px 44px 44px; font-family:-apple-system,'PingFang SC','Hiragino Sans GB',sans-serif; border-radius:30px; box-sizing:border-box; position:relative; overflow:hidden;">
  <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:#E8D5E0;border-radius:50%;opacity:0.4;"></div>
  <div style="position:absolute;bottom:-30px;left:-30px;width:120px;height:120px;background:#D5E0E8;border-radius:50%;opacity:0.35;"></div>
  <div style="position:relative;z-index:1;">
    ${title ? `<div style="font-size:25px;font-weight:700;color:#5C4B51;margin-bottom:8px;line-height:1.3;letter-spacing:-0.3px;">${title}</div>` : ''}
    <div style="width:36px;height:3px;background:linear-gradient(90deg,#C4A8B8,#A8C4C0);border-radius:2px;margin-bottom:24px;"></div>
    <div style="font-size:15px;color:#6B5B62;line-height:2.1;letter-spacing:0.3px;">
      ${lines.map((l, i) => {
          if (i === 0 && l.length < 30) return `<div style="font-weight:600;color:#5C4B51;margin-bottom:10px;font-size:17px;">${l}</div>`;
          if (l.startsWith('- ') || l.startsWith('• ')) return `<div style="padding-left:16px;margin-bottom:4px;color:#8B7D84;"><span style="color:#C4A8B8;">·</span> ${l.replace(/^[-•]\s*/, '')}</div>`;
          return `<div style="margin-bottom:6px;">${l}</div>`;
      }).join('')}
    </div>
    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #E0D8DD;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:11px;color:#A898A0;">${getTimeStr()}</span>
      <span style="font-size:11px;color:#C4A8B8;">✦</span>
    </div>
  </div>
</div>`;
        }
    },

    // ================================================================
    // 7. 渐变双色调 (Duotone)
    // ================================================================
    {
        id: "duotone",
        name: "渐变双色调",
        description: "双色渐变 + 粗体大字 + 高对比",
        icon: "🌅",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:linear-gradient(150deg, #0F2027 0%, #203A43 50%, #2C5364 100%); padding:56px 48px 48px; font-family:-apple-system,'PingFang SC','Hiragino Sans GB',sans-serif; border-radius:24px; box-sizing:border-box; position:relative; overflow:hidden;">
  ${title ? `<div style="font-size:34px;font-weight:900;background:linear-gradient(90deg,#FF6B6B,#FFE66D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:16px;line-height:1.15;letter-spacing:-1px;">${title}</div>` : ''}
  <div style="font-size:15px;color:rgba(255,255,255,0.85);line-height:2;letter-spacing:0.3px;">
    ${lines.map((l, i) => i === 0
      ? `<div style="font-size:18px;font-weight:600;color:#FFE66D;margin-bottom:14px;">${l}</div>`
      : `<div style="margin-bottom:6px;color:rgba(255,255,255,0.7);">${l}</div>`
    ).join('')}
  </div>
  <div style="margin-top:32px;display:flex;gap:10px;">
    <span style="background:rgba(255,107,107,0.2);color:#FF6B6B;padding:5px 16px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid rgba(255,107,107,0.3);">Hot</span>
    <span style="background:rgba(255,230,109,0.2);color:#FFE66D;padding:5px 16px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid rgba(255,230,109,0.3);">Vibe</span>
  </div>
  <div style="margin-top:20px;font-size:10px;color:rgba(255,255,255,0.35);">${getTimeStr()}</div>
</div>`;
        }
    },

    // ================================================================
    // 8. 孟菲斯风 (Memphis)
    // ================================================================
    {
        id: "memphis",
        name: "孟菲斯风",
        description: "几何图形 + 撞色 + 80 年代波普",
        icon: "🔷",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:#FFFDF7; padding:0; font-family:'Comic Sans MS','Chalkboard SE',-apple-system,'PingFang SC',sans-serif; border-radius:4px; box-sizing:border-box; position:relative; overflow:hidden; border:3px solid #000000;">
  <div style="position:absolute;top:20px;right:24px;width:50px;height:50px;background:#FF6B6B;border-radius:50%;border:3px solid #000;"></div>
  <div style="position:absolute;bottom:40px;right:60px;width:30px;height:30px;background:#4ECDC4;transform:rotate(45deg);border:3px solid #000;"></div>
  <div style="position:absolute;top:100px;left:20px;width:25px;height:60px;background:#FFE66D;border:3px solid #000;"></div>
  <div style="padding:48px 40px 44px;">
    ${title ? `<div style="font-size:28px;font-weight:900;color:#1A1A2E;margin-bottom:16px;line-height:1.2;letter-spacing:-0.5px;text-shadow:3px 3px 0 #FF6B6B;">${title}</div>` : ''}
    <div style="font-size:14px;color:#1A1A2E;line-height:2;">
      ${lines.map((l, i) => i === 0
        ? `<div style="background:#FFE66D;display:inline-block;padding:6px 14px;margin-bottom:14px;font-weight:700;border:2px solid #000;">${l}</div>`
        : `<div style="margin-bottom:8px;padding:4px 0;">${l}</div>`
      ).join('')}
    </div>
    <div style="margin-top:28px;display:flex;gap:8px;">
      <div style="width:40px;height:6px;background:#FF6B6B;"></div>
      <div style="width:40px;height:6px;background:#4ECDC4;"></div>
      <div style="width:40px;height:6px;background:#FFE66D;"></div>
      <div style="width:40px;height:6px;background:#1A1A2E;"></div>
    </div>
    <div style="margin-top:16px;font-size:10px;color:#666;font-weight:700;">${getTimeStr()}</div>
  </div>
</div>`;
        }
    },

    // ================================================================
    // 9. 杂志排版 (Editorial)
    // ================================================================
    {
        id: "editorial",
        name: "杂志排版",
        description: "大字 + 留白 + 衬线体 + VOGUE 感",
        icon: "📰",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:#FAFAF7; padding:64px 56px 48px; font-family:'Georgia','Times New Roman','STSong','PingFang SC',serif; border-radius:4px; box-sizing:border-box; position:relative;">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:#1A1A1A;"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:#1A1A1A;"></div>
  ${title ? `<div style="font-size:42px;font-weight:400;color:#1A1A1A;margin-bottom:4px;line-height:1.05;letter-spacing:-1px;text-transform:uppercase;">${title}</div>` : ''}
  <div style="font-size:11px;color:#999;letter-spacing:3px;text-transform:uppercase;margin-bottom:32px;font-family:-apple-system,sans-serif;">${getTimeStr()} · OBSIDIAN NOTES</div>
  <div style="width:60px;height:1px;background:#1A1A1A;margin-bottom:32px;"></div>
  <div style="font-size:17px;color:#333;line-height:2;letter-spacing:0.2px;">
    ${lines.map((l, i) => {
        if (i === 0) return `<div style="font-size:24px;font-weight:400;color:#1A1A1A;margin-bottom:20px;line-height:1.5;"><span style="font-family:-apple-system,sans-serif;font-size:56px;float:left;line-height:0.8;margin-right:8px;margin-top:4px;font-weight:900;color:#1A1A1A;">${l.charAt(0)}</span>${l.slice(1)}</div>`;
        return `<div style="margin-bottom:10px;">${l}</div>`;
    }).join('')}
  </div>
</div>`;
        }
    },

    // ================================================================
    // 10. 有机流体 (Organic Fluid)
    // ================================================================
    {
        id: "organic-fluid",
        name: "有机流体",
        description: "流体形状 + 柔和渐变 + 呼吸感",
        icon: "🫧",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:linear-gradient(170deg, #F8F6F0 0%, #F0EBF5 50%, #F5F0EB 100%); padding:48px 42px 42px; font-family:-apple-system,'PingFang SC','Hiragino Sans GB',sans-serif; border-radius:40px; box-sizing:border-box; position:relative; overflow:hidden;">
  <svg style="position:absolute;top:-60px;right:-30px;width:200px;height:200px;opacity:0.3;pointer-events:none;" viewBox="0 0 200 200"><ellipse cx="100" cy="100" rx="90" ry="70" fill="#E8C4D0" transform="rotate(-20 100 100)"/></svg>
  <svg style="position:absolute;bottom:-40px;left:-40px;width:180px;height:180px;opacity:0.25;pointer-events:none;" viewBox="0 0 200 200"><ellipse cx="100" cy="100" rx="85" ry="75" fill="#C4D0E8" transform="rotate(15 100 100)"/></svg>
  <div style="position:relative;z-index:1;">
    ${title ? `<div style="font-size:27px;font-weight:700;color:#3D3550;margin-bottom:12px;line-height:1.3;letter-spacing:-0.3px;">${title}</div>` : ''}
    <div style="font-size:15px;color:#5A4E6B;line-height:2;letter-spacing:0.3px;">
      ${lines.map((l, i) => {
          if (i === 0) return `<div style="background:rgba(255,255,255,0.6);border-radius:16px;padding:14px 18px;margin-bottom:14px;font-weight:500;color:#3D3550;">${l}</div>`;
          return `<div style="margin-bottom:6px;">${l}</div>`;
      }).join('')}
    </div>
    <div style="margin-top:28px;display:flex;align-items:center;gap:10px;">
      <div style="width:32px;height:32px;background:linear-gradient(135deg,#E8C4D0,#C4D0E8);border-radius:50%;"></div>
      <span style="font-size:11px;color:#9A8BAA;font-weight:500;">${getTimeStr()}</span>
    </div>
  </div>
</div>`;
        }
    },

    // ================================================================
    // 11. 复古霓虹 (Synthwave)
    // ================================================================
    {
        id: "synthwave",
        name: "复古霓虹",
        description: "赛博朋克 + 霓虹灯 + 80 年代电子",
        icon: "🌆",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:linear-gradient(180deg, #0A0A1A 0%, #1A0A2E 40%, #2D0A3E 100%); padding:50px 42px 44px; font-family:'SF Mono','Fira Code',-apple-system,'PingFang SC',monospace; border-radius:16px; box-sizing:border-box; position:relative; overflow:hidden; border:1px solid rgba(255,0,128,0.2);">
  <div style="position:absolute;bottom:0;left:0;right:0;height:120px;background:linear-gradient(0deg,rgba(255,0,128,0.08),transparent);pointer-events:none;"></div>
  <div style="position:absolute;top:30px;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(0,255,255,0.3),transparent);"></div>
  ${title ? `<div style="font-size:26px;font-weight:800;color:#FF2D95;margin-bottom:8px;line-height:1.2;text-shadow:0 0 20px rgba(255,45,149,0.5),0 0 40px rgba(255,45,149,0.3);">◈ ${title}</div>` : ''}
  <div style="font-size:15px;color:#00D4FF;line-height:2;letter-spacing:0.5px;">
    ${lines.map((l, i) => {
        if (i === 0) return `<div style="color:#FFE5B4;font-size:16px;margin-bottom:12px;text-shadow:0 0 10px rgba(255,229,180,0.3);">▸ ${l}</div>`;
        return `<div style="margin-bottom:6px;color:rgba(200,200,255,0.8);">  ${l}</div>`;
    }).join('')}
  </div>
  <div style="margin-top:28px;display:flex;gap:12px;">
    <span style="border:1px solid #FF2D95;color:#FF2D95;padding:4px 14px;font-size:10px;font-weight:700;letter-spacing:1px;text-shadow:0 0 8px rgba(255,45,149,0.5);">SYNTH</span>
    <span style="border:1px solid #00D4FF;color:#00D4FF;padding:4px 14px;font-size:10px;font-weight:700;letter-spacing:1px;text-shadow:0 0 8px rgba(0,212,255,0.5);">WAVE</span>
  </div>
  <div style="position:absolute;bottom:16px;right:24px;font-size:9px;color:rgba(255,255,255,0.2);">${getTimeStr()}</div>
</div>`;
        }
    },

    // ================================================================
    // 12. 水墨留白 (Ink Wash)
    // ================================================================
    {
        id: "ink-wash",
        name: "水墨留白",
        description: "东方美学 + 水墨晕染 + 禅意",
        icon: "🎋",
        render: (text, title) => {
            const clean = stripMarkdown(text);
            const lines = clean.split('\n').filter(l => l.trim());
            return `
<div style="width:${CARD_WIDTH}px; background:linear-gradient(180deg, #FEFEFC 0%, #F7F6F2 100%); padding:60px 52px 48px; font-family:'KaiTi','STKaiti','PingFang SC','Hiragino Sans GB',serif; border-radius:8px; box-sizing:border-box; position:relative; overflow:hidden; border:1px solid #E8E4D9;">
  <div style="position:absolute;top:30px;right:40px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,rgba(80,60,40,0.04) 0%,transparent 70%);"></div>
  <div style="position:absolute;bottom:50px;left:40px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,rgba(80,60,40,0.03) 0%,transparent 70%);"></div>
  ${title ? `<div style="font-size:28px;font-weight:400;color:#2C2416;margin-bottom:6px;line-height:1.3;letter-spacing:2px;">${title}</div>` : ''}
  <div style="width:40px;height:1px;background:#C4B8A8;margin-bottom:28px;"></div>
  <div style="font-size:16px;color:#5A4E3C;line-height:2.4;letter-spacing:0.5px;">
    ${lines.map((l, i) => {
        if (i === 0) return `<div style="font-size:20px;color:#2C2416;margin-bottom:18px;">${l}</div>`;
        return `<div style="margin-bottom:8px;">${l}</div>`;
    }).join('')}
  </div>
  <div style="margin-top:36px;text-align:right;">
    <span style="font-size:12px;color:#B8A898;">${getTimeStr()}</span>
    <span style="display:inline-block;margin-left:12px;width:20px;height:20px;border:1px solid #C4B8A8;border-radius:50%;vertical-align:middle;position:relative;top:-1px;"></span>
  </div>
</div>`;
        }
    }
];

// ============================================================
// 风格选择 Modal
// ============================================================
class StylePickerModal extends Modal {
    plugin: NoteToSocialImagePlugin;
    selectedText: string;
    noteTitle: string;
    onChoose: (style: CardStyle) => void;
    private previewContainer: HTMLElement | null = null;
    private activeIndex: number = 0;

    constructor(app: App, plugin: NoteToSocialImagePlugin, selectedText: string, noteTitle: string, onChoose: (style: CardStyle) => void) {
        super(app);
        this.plugin = plugin;
        this.selectedText = selectedText;
        this.noteTitle = noteTitle;
        this.onChoose = onChoose;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass("ntsi-modal");

        // 标题栏
        const header = contentEl.createEl("div", { cls: "ntsi-header" });
        header.createEl("h2", { text: "🎨 选择分享风格", cls: "ntsi-modal-title" });
        header.createEl("div", { text: "按 1-6 快速选择 · Esc 关闭", cls: "ntsi-hint" });

        // 选中文本 + 实时预览区
        const previewWrap = contentEl.createEl("div", { cls: "ntsi-preview-wrap" });
        const textInfo = previewWrap.createEl("div", { cls: "ntsi-preview-text" });
        const raw = this.selectedText.slice(0, 60);
        textInfo.createEl("span", { text: "预览: ", cls: "ntsi-preview-label" });
        textInfo.createEl("span", { text: `${raw}${this.selectedText.length > 60 ? '...' : ''}`, cls: "ntsi-preview-content" });

        // 实时预览卡片（小尺寸）
        this.previewContainer = previewWrap.createEl("div", { cls: "ntsi-live-preview" });
        this.updatePreview(0);

        // 风格选项网格
        const grid = contentEl.createEl("div", { cls: "ntsi-style-grid" });

        STYLES.forEach((style, idx) => {
            const card = grid.createEl("div", { cls: "ntsi-style-card" });
            card.setAttribute("tabindex", "0");
            card.setAttribute("data-index", String(idx));
            card.createEl("div", { text: style.icon, cls: "ntsi-style-icon" });
            card.createEl("div", { text: style.name, cls: "ntsi-style-name" });
            card.createEl("div", { text: style.description, cls: "ntsi-style-desc" });
            // 快捷键数字徽标
            card.createEl("div", { text: `${idx + 1}`, cls: "ntsi-shortcut-badge" });

            // 点击选择
            card.addEventListener("click", (e) => {
                e.preventDefault();
                this.selectStyle(idx);
            });

            // 悬停预览
            card.addEventListener("mouseenter", () => {
                this.updatePreview(idx);
            });

            // 键盘导航
            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.selectStyle(idx);
                }
            });
        });

        // 底部操作按钮
        const footer = contentEl.createEl("div", { cls: "ntsi-footer" });
        const quickBtn = footer.createEl("button", { text: "⚡ 快速导出（默认风格）", cls: "ntsi-btn ntsi-btn-quick" });
        quickBtn.addEventListener("click", () => {
            const defaultStyle = STYLES.find(s => s.id === this.plugin.settings.defaultStyle) ?? STYLES[0];
            this.close();
            this.onChoose(defaultStyle);
        });

        // 键盘绑定
        this.scope.register([], "Escape", () => { this.close(); });
        for (let i = 1; i <= STYLES.length; i++) {
            this.scope.register([], String(i), () => {
                this.selectStyle(i - 1);
            });
        }
        this.scope.register([], "Enter", () => {
            const defaultStyle = STYLES.find(s => s.id === this.plugin.settings.defaultStyle) ?? STYLES[0];
            this.close();
            this.onChoose(defaultStyle);
        });

        // 聚焦第一个卡片
        setTimeout(() => {
            const firstCard = grid.querySelector(".ntsi-style-card") as HTMLElement;
            firstCard?.focus();
        }, 100);
    }

    private updatePreview(index: number) {
        if (!this.previewContainer) return;
        const style = STYLES[index];
        // 用缩放容器包裹预览
        const previewHTML = style.render(this.selectedText, this.noteTitle);
        this.previewContainer.innerHTML = `
            <div class="ntsi-preview-inner" style="transform:scale(${280/CARD_WIDTH});transform-origin:top left;width:${CARD_WIDTH}px;">
                ${previewHTML}
            </div>
        `;

        // 更新活跃卡片
        const allCards = this.contentEl.querySelectorAll(".ntsi-style-card");
        allCards.forEach((c, i) => {
            if (i === index) {
                c.classList.add("ntsi-active");
                (c as HTMLElement).focus();
            } else {
                c.classList.remove("ntsi-active");
            }
        });
    }

    private selectStyle(index: number) {
        this.plugin.settings.lastUsedStyle = STYLES[index].id;
        this.plugin.saveSettings();
        const style = STYLES[index];
        // 选中动画
        const card = this.contentEl.querySelector(`.ntsi-style-card[data-index="${index}"]`);
        card?.classList.add("ntsi-selected");
        setTimeout(() => {
            this.close();
            this.onChoose(style);
        }, 150);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// ============================================================
// 设置
// ============================================================
interface NoteToSocialImageSettings {
    defaultStyle: string;
    exportFolder: string;
    lastUsedStyle: string;
}

const DEFAULT_SETTINGS: NoteToSocialImageSettings = {
    defaultStyle: "xhs-cream",
    exportFolder: "attachments/social-images",
    lastUsedStyle: "xhs-cream"
};

// ============================================================
// 主插件
// ============================================================
export default class NoteToSocialImagePlugin extends Plugin {
    settings: NoteToSocialImageSettings;

    async onload() {
        await this.loadSettings();

        // 注册命令
        this.addCommand({
            id: "export-selection-as-image",
            name: "选中文字导出为分享图片",
            icon: "image",
            editorCallback: (editor, view) => {
                const selection = editor.getSelection();
                if (!selection) {
                    new Notice("⚠️ 请先选中要分享的文字");
                    return;
                }
                const noteTitle = view.file?.basename ?? "未命名笔记";
                this.openStylePicker(selection, noteTitle);
            }
        });

        // 带预览的命令
        this.addCommand({
            id: "export-selection-quick",
            name: "快速导出（使用默认风格）",
            icon: "zap",
            editorCallback: (editor, view) => {
                const selection = editor.getSelection();
                if (!selection) {
                    new Notice("⚠️ 请先选中要分享的文字");
                    return;
                }
                const noteTitle = view.file?.basename ?? "未命名笔记";
                const style = STYLES.find(s => s.id === this.settings.defaultStyle) ?? STYLES[0];
                this.exportAsImage(selection, noteTitle, style);
            }
        });

        // 添加 ribbon 图标
        this.addRibbonIcon("image-up", "导出为分享图片", (evt: MouseEvent) => {
            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (!view) {
                new Notice("⚠️ 请打开一个笔记");
                return;
            }
            const editor = view.editor;
            const selection = editor.getSelection();
            if (!selection) {
                new Notice("⚠️ 请先选中要分享的文字");
                return;
            }
            this.openStylePicker(selection, view.file?.basename ?? "未命名笔记");
        });

        // 右键菜单
        this.registerEvent(
            this.app.workspace.on("editor-menu", (menu, editor, view) => {
                const selection = editor.getSelection();
                if (!selection) return;
                const noteTitle = (view as MarkdownView).file?.basename ?? "未命名笔记";

                menu.addItem((item) => {
                    item
                        .setTitle("导出为分享图片")
                        .setIcon("image-up")
                        .setSection("action")
                        .onClick(() => this.openStylePicker(selection, noteTitle));
                });

                const defaultStyle = STYLES.find(s => s.id === this.settings.defaultStyle) ?? STYLES[0];
                menu.addItem((item) => {
                    item
                        .setTitle(`快速导出: ${defaultStyle.icon} ${defaultStyle.name}`)
                        .setIcon("zap")
                        .setSection("action")
                        .onClick(() => this.exportAsImage(selection, noteTitle, defaultStyle));
                });
            })
        );

        // 设置页
        this.addSettingTab(new NoteToSocialImageSettingTab(this.app, this));

        console.log("📸 Note to Social Image plugin loaded!");
    }

    onunload() {
        console.log("📸 Note to Social Image plugin unloaded");
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    openStylePicker(text: string, title: string) {
        new StylePickerModal(this.app, this, text, title, (style) => {
            this.exportAsImage(text, title, style);
        }).open();
    }

    async exportAsImage(text: string, title: string, style: CardStyle, retryCount = 0) {
        const notice = new Notice("", 0);
        const updateNotice = (msg: string) => {
            notice.setMessage(msg);
        };
        updateNotice("🎨 正在渲染...");

        try {
            // 生成 HTML
            const htmlContent = style.render(text, title);

            // 创建隐藏容器
            const container = document.createElement("div");
            container.style.position = "absolute";
            container.style.left = "-9999px";
            container.style.top = "-9999px";
            container.style.zIndex = "-1";
            container.innerHTML = htmlContent;
            document.body.appendChild(container);

            // 等待渲染
            await new Promise(r => setTimeout(r, 200));
            updateNotice("📸 正在截图...");

            // 使用 html2canvas 渲染
            const element = container.firstElementChild as HTMLElement;
            if (!element) {
                throw new Error("渲染失败");
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                logging: false
            });

            // 清理容器
            document.body.removeChild(container);
            updateNotice("💾 正在保存...");

            // 导出为 PNG blob
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), "image/png", 1.0);
            });

            // 保存到 vault
            const folderPath = normalizePath(this.settings.exportFolder);
            const folder = this.app.vault.getAbstractFileByPath(folderPath);
            if (!folder) {
                await this.app.vault.createFolder(folderPath);
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const fileName = `social-${timestamp}.png`;
            const filePath = normalizePath(`${folderPath}/${fileName}`);

            const arrayBuffer = await blob.arrayBuffer();
            const file = await this.app.vault.createBinary(filePath, arrayBuffer);

            // 复制到剪贴板
            let copiedToClipboard = false;
            try {
                const item = new ClipboardItem({ "image/png": blob });
                await navigator.clipboard.write([item]);
                copiedToClipboard = true;
            } catch (e) {
                // clipboard API 可能不可用
            }

            notice.hide();

            // 成功通知 + 操作按钮
            const successNotice = new Notice("", 8000);
            const msgEl = successNotice.noticeEl;
            msgEl.empty();
            msgEl.addClass("ntsi-success-notice");

            const msgText = msgEl.createEl("div", { cls: "ntsi-success-text" });
            msgText.createEl("span", { text: `✅ ${style.icon} 已导出: ` });
            msgText.createEl("strong", { text: fileName });
            if (copiedToClipboard) {
                msgText.createEl("span", { text: " · 已复制到剪贴板", cls: "ntsi-copied" });
            }

            // 操作按钮
            const actions = msgEl.createEl("div", { cls: "ntsi-success-actions" });
            const viewBtn = actions.createEl("button", { text: "👁 查看图片", cls: "ntsi-action-btn" });
            viewBtn.addEventListener("click", () => {
                const file = this.app.vault.getAbstractFileByPath(filePath);
                if (file instanceof TFile) {
                    this.app.workspace.getLeaf("tab").openFile(file);
                }
                successNotice.hide();
            });

            const revealBtn = actions.createEl("button", { text: "📂 打开目录", cls: "ntsi-action-btn" });
            revealBtn.addEventListener("click", () => {
                // @ts-ignore - electron API
                const { shell } = require("electron");
                const fullPath = (this.app.vault.adapter as any).getFullPath(filePath);
                shell.showItemInFolder(fullPath);
                successNotice.hide();
            });


        } catch (err) {
            notice.hide();
            if (retryCount < 2) {
                new Notice(`⚠️ 第${retryCount + 1}次失败，正在重试...`);
                await new Promise(r => setTimeout(r, 500));
                return this.exportAsImage(text, title, style, retryCount + 1);
            }
            new Notice(`❌ 导出失败，请重试或检查控制台`);
            console.error("Note to Social Image error:", err);
        }
    }
}

// ============================================================
// 设置面板
// ============================================================
class NoteToSocialImageSettingTab extends PluginSettingTab {
    plugin: NoteToSocialImagePlugin;

    constructor(app: App, plugin: NoteToSocialImagePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "📸 Note to Social Image 设置" });

        new Setting(containerEl)
            .setName("默认风格")
            .setDesc("快速导出时使用的风格")
            .addDropdown(dropdown => {
                STYLES.forEach(s => {
                    dropdown.addOption(s.id, `${s.icon} ${s.name}`);
                });
                dropdown.setValue(this.plugin.settings.defaultStyle);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.defaultStyle = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName("导出目录")
            .setDesc("图片保存位置（相对于 vault 根目录）")
            .addText(text => text
                .setPlaceholder("attachments/social-images")
                .setValue(this.plugin.settings.exportFolder)
                .onChange(async (value) => {
                    this.plugin.settings.exportFolder = value || "attachments/social-images";
                    await this.plugin.saveSettings();
                }));
    }
}
