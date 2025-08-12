const cyan = '#4FF3E1';
const ink = '#0e1318';
const panel = '#0f1720';

export const Colors = {
  light: {
    text: '#0b1417',
    background: '#ffffff',
    tint: cyan,
    icon: '#5e7b85',
    tabIconDefault: '#7aa6a2',
    tabIconSelected: cyan,
    // extras (safe to ignore if unused)
    hudCyan: cyan,
    hudCyanDim: 'rgba(79,243,225,0.25)',
    dockBg: 'rgba(255,255,255,0.85)',
  },
  dark: {
    text: '#CFEAE7',
    background: ink,
    tint: cyan,
    icon: '#7bded4',
    tabIconDefault: '#4f6e71',
    tabIconSelected: cyan,
    // extras for HUD
    hudCyan: cyan,
    hudCyanDim: 'rgba(79,243,225,0.25)',
    hudPanel: panel,
    dockBg: 'rgba(14,19,24,0.9)',
  },
};