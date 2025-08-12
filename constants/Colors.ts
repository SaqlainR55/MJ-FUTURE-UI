// constants/Colors.ts
// Dawn palette: caring + hopeful (periwinkle accent on deep twilight)

const cyan  = '#A7C5FF'; // Accent — hopeful periwinkle (not green)
const ink   = '#0A0E17'; // Background — deep twilight blue-black
const panel = '#0E1522'; // Panels — soft navy

export const Colors = {
  light: {
    text: '#101421',
    background: '#FFFFFF',
    tint: cyan,
    icon: '#7983A6',
    tabIconDefault: '#8FA0BE',
    tabIconSelected: cyan,
    // extras
    hudCyan: cyan,
    hudCyanDim: 'rgba(167,197,255,0.28)',
    dockBg: 'rgba(255,255,255,0.88)',
  },
  dark: {
    text: '#F2F6FF',
    background: ink,
    tint: cyan,
    icon: '#AEB8D9',
    tabIconDefault: '#6E7BA6',
    tabIconSelected: cyan,
    // extras for HUD
    hudCyan: cyan,
    hudCyanDim: 'rgba(167,197,255,0.30)',
    hudPanel: panel,
    dockBg: 'rgba(10,14,23,0.92)',
  },
};