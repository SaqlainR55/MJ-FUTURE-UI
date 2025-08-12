import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    // NEW futuristic variants
    | 'hudLabel'
    | 'hudDigits'
    | 'muted';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'hudLabel' && styles.hudLabel,
        type === 'hudDigits' && styles.hudDigits,
        type === 'muted' && styles.muted,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  defaultSemiBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: 'bold', lineHeight: 34 },
  subtitle: { fontSize: 20, fontWeight: 'bold' },
  link: { lineHeight: 30, fontSize: 16, color: '#0a7ea4' },

  // NEW
  hudLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: '#7bded4',
    textTransform: 'uppercase',
  },
  hudDigits: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'right',
    fontVariant: ['tabular-nums'], // monospaced numerals
    color: '#4FF3E1',
    textShadowColor: 'rgba(79,243,225,0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  muted: { opacity: 0.6 },
});