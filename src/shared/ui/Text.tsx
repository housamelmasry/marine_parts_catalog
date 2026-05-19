import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'caption';
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'auto' | 'left' | 'center' | 'right' | 'justify';
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'bodyMedium',
  color,
  weight,
  align = 'auto',
  style,
  ...props
}) => {
  const { typography, colors } = useTheme();

  const baseStyle = typography[variant];
  const customWeightStyle: TextStyle = weight
    ? {
        fontWeight:
          weight === 'regular'
            ? '400'
            : weight === 'medium'
            ? '500'
            : weight === 'semibold'
            ? '600'
            : '700',
      }
    : {};

  const combinedStyle: TextStyle = {
    ...baseStyle,
    color: color || baseStyle.color || colors.text,
    textAlign: align,
    ...customWeightStyle,
  };

  return (
    <RNText style={[combinedStyle, style]} {...props}>
      {children}
    </RNText>
  );
};
