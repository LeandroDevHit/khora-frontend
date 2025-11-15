export const Colors = {
  // Cores Primárias
  primary: '#3B82F6',
  primaryLight: '#4C6FE0',
  primaryDark: '#0D2B7A',
  primary10: 'rgba(59, 130, 246, 0.1)', // 10% opacidade
  primary20: 'rgba(59, 130, 246, 0.2)', // 20% opacidade
  primary50: 'rgba(59, 130, 246, 0.5)', // 50% opacidade

  // Cores Secundárias
  secondary: '#1E3A8A',
  secondaryLight: '#5A5A5A',
  secondaryDark: '#1A1A1A',

  // Cores de Fundo
  background: '#FFFFFF',
  backgroundLight: '#F5F5F5',
  backgroundDark: '#E0E0E0',

  // Cores de Texto
  textPrimary: '#373737',
  textSecondary: '#5A5A5A',
  textLight: '#9E9E9E',
  textWhite: '#FFFFFF',

  // Cores de Estado
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Cores de Bordas
  border: '#E0E0E0',
  borderLight: '#F5F5F5',
  borderDark: '#BDBDBD',

  // Cores Neutras
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

} as const;

// Espaçamentos
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Tamanhos de Fonte
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// Pesos de Fonte
export const FontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 10,
  xl: 12,
  round: 999,
} as const;
