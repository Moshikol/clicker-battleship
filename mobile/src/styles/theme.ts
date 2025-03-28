import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color Palette
export const colors = {
  // Primary Colors
  primary: '#FF0000',  // Red for the digital display
  secondary: '#2196F3', // Blue
  accent: '#FFC107',    // Amber
  
  // UI Colors
  background: '#1A1A1A', // Dark background for the checkered pattern
  backgroundSecondary: '#262626', // Slightly lighter for the checkers
  surface: '#1E1E1E',
  error: '#CF6679',
  
  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisabled: '#757575',
  
  // Game Colors
  digitalRed: '#FF0000', // Red for the digital display
  digitalBackground: '#111111', // Dark background for the digital display
  counterBorder: '#3E3E3E', // Border for the counter display
  water: '#1976D2',
  hit: '#F44336',
  miss: '#757575',
  ship: '#795548',
  shield: '#E91E63',
  
  // Gradients
  gradientStart: '#121212',
  gradientEnd: '#2D2D2D',
};

// Typography
export const typography = {
  fontSizes: {
    tiny: 10,
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32,
    counter: 48, // Size for the digital counter
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
    black: '900',
  },
  fontFamily: {
    regular: 'System',
    bold: 'System',
    monospace: 'monospace', // For the digital display
  },
};

// Spacing
export const spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
};

// Responsive dimensions
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Border radius
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  round: 999,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};

// Export all theme variables
export default {
  colors,
  typography,
  spacing,
  scale,
  verticalScale,
  moderateScale,
  borderRadius,
  shadows,
}; 