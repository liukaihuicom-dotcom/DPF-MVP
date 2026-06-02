import { PropsWithChildren, useState } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type NativePressableProps = PropsWithChildren<
  PressableProps & {
    disabled?: boolean;
    disableDefaultDisabledStyle?: boolean;
    focusedStyle?: ViewStyle;
    hoveredStyle?: ViewStyle;
    minTouch?: number;
    pressedStyle?: ViewStyle;
    style?: PressableProps['style'];
  }
>;

export function NativePressable({
  children,
  disabled,
  disableDefaultDisabledStyle,
  focusedStyle,
  hoveredStyle,
  minTouch = 44,
  pressedStyle,
  style,
  ...props
}: NativePressableProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const baseStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    styles.base,
    { minHeight: minTouch, minWidth: minTouch },
    typeof style === 'function' ? undefined : style,
    hovered && !disabled && hoveredStyle,
    focused && !disabled && focusedStyle,
    pressed && !disabled && (pressedStyle ?? styles.pressed),
    disabled && !disableDefaultDisabledStyle && styles.disabled,
  ]);

  return (
    <Pressable
      accessibilityRole={props.accessibilityRole ?? 'button'}
      disabled={disabled}
      hitSlop={props.hitSlop ?? 6}
      {...props}
      onBlur={(event) => {
        setFocused(false);
        props.onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        props.onFocus?.(event);
      }}
      onHoverIn={(event) => {
        setHovered(true);
        props.onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setHovered(false);
        props.onHoverOut?.(event);
      }}
      onPressIn={(event) => {
        setPressed(true);
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        props.onPressOut?.(event);
      }}
      style={baseStyle}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.56,
  },
  pressed: {
    opacity: 0.72,
  },
});
