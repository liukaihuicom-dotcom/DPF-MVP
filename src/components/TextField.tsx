import { ReactNode, useEffect, useRef, useState } from 'react';
import { Modal, Platform, StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import type { ThemeColors } from '@/src/theme/colors';
import { layout, lineWidth, radius, size, spacing, typography } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from './AppIcon';
import { NativePressable } from './NativePressable';
import { AppText, type AppTextTone } from './Typography';

export type FormFieldState = 'default' | 'focused' | 'inputting' | 'validating' | 'success' | 'error' | 'disabled' | 'readonly';
export type FormFieldShape = 'default' | 'pill';
export type FormFieldSizePreset = 'default' | 'sm' | 'md' | 'lg';
export type FormFieldVariant = 'neutral' | 'stage';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  error?: string;
  fieldState?: FormFieldState;
  helperText?: string;
  icon?: AppIconName | ReactNode;
  inputStyle?: StyleProp<TextStyle>;
  label: string;
  labelHidden?: boolean;
  readonly?: boolean;
  rightSlot?: ReactNode;
  rightSlotFlush?: boolean;
  shape?: FormFieldShape;
  shellStyle?: StyleProp<ViewStyle>;
  sizePreset?: FormFieldSizePreset;
  successText?: string;
  variant?: FormFieldVariant;
};

export type SelectFieldOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type SelectFieldProps = {
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  error?: string;
  fieldState?: FormFieldState;
  helperText?: string;
  icon?: AppIconName | ReactNode;
  label: string;
  menuStyle?: StyleProp<ViewStyle>;
  onChangeValue: (value: string) => void;
  optionTextStyle?: StyleProp<TextStyle>;
  options: SelectFieldOption[];
  placeholder?: string;
  readonly?: boolean;
  shellStyle?: StyleProp<ViewStyle>;
  successText?: string;
  value: string;
  variant?: FormFieldVariant;
};

export type RichTextFieldProps = TextFieldProps & {
  footerSlot?: ReactNode;
  toolbarSlot?: ReactNode;
};

type SelectMenuFrame = {
  left: number;
  maxHeight: number;
  top: number;
  width: number;
};

const selectMenuMaxHeight = 240;
const selectMenuMinHeight = 140;
const selectMenuViewportInset = 8;
const selectMenuOffset = spacing.xs;
const selectMenuZIndex = 100000;
const fieldBaseBorderWidth = lineWidth.strong;
const fieldActiveBorderWidth = lineWidth.selected;
const fieldHorizontalPadding = layout.formFieldTextInset;
const fieldFloatingPaddingY = spacing.sm - lineWidth.strong;
const fieldMultilinePaddingY = spacing.md;
const fieldSelectOptionMinTouch = size.control.sm;
const centeredLabelTop = (contentHeight: number) => Math.max(0, (contentHeight - typography.bodyLg.lineHeight) / 2);
const fieldEmptyLabelDefaultTop = centeredLabelTop(size.input.contentMinHeight);
const fieldEmptyLabelSmTop = centeredLabelTop(size.control.sm - lineWidth.selected * 2);
const fieldEmptyLabelMdTop = centeredLabelTop(size.control.md - lineWidth.selected * 2);
const fieldEmptyLabelLgTop = centeredLabelTop(size.input.largeContentMinHeight);
const fieldRightSlotMinTouch = layout.touchTargetMin;
const fieldRightSlotFlushOffset = spacing.sm;

export function TextField({
  containerStyle,
  disabled,
  editable,
  error,
  fieldState = 'default',
  helperText,
  icon,
  inputStyle,
  label,
  labelHidden,
  multiline,
  onBlur,
  onFocus,
  placeholder,
  placeholderTextColor,
  readonly,
  rightSlot,
  rightSlotFlush,
  shape = 'default',
  shellStyle,
  sizePreset = 'default',
  successText,
  value,
  variant = 'neutral',
  ...props
}: TextFieldProps) {
  const colors = useThemeColors();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const fieldEditable = editable !== false && !disabled && !readonly;
  const filled = hasTextValue(value) || hasTextValue(props.defaultValue);
  const resolvedState = resolveFieldState({
    disabled,
    error,
    fieldState,
    focused,
    readonly,
  });
  const active = labelHidden || focused || filled;
  const stateColors = getFieldStateColors(colors, resolvedState);
  const stateTones = getFieldStateTextTones(resolvedState);
  const stateBorderWidth = getFieldBorderWidth(resolvedState);
  const statePaddingOffset = stateBorderWidth - fieldBaseBorderWidth;
  const iconTone = getFieldStateIconTone(resolvedState);
  const iconNode =
    typeof icon === 'string' ? <AppIcon name={icon as AppIconName} sizeVariant="xs" tone={iconTone} /> : icon ?? null;
  const inputPlaceholder = labelHidden || active ? placeholder : undefined;
  const focusInput = () => {
    if (fieldEditable) {
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!props.autoFocus || !fieldEditable) {
      return undefined;
    }

    const timer = setTimeout(() => inputRef.current?.focus(), 160);
    return () => clearTimeout(timer);
  }, [fieldEditable, props.autoFocus]);

  return (
    <View style={StyleSheet.flatten([styles.wrap, containerStyle])}>
      <NativePressable
        accessibilityLabel={props.accessibilityLabel ?? label}
        accessibilityRole="none"
        disabled={!fieldEditable}
        minTouch={0}
        onPress={focusInput}
        style={StyleSheet.flatten([
          styles.shell,
          !labelHidden && styles.shellFloating,
          shape === 'pill' && styles.shellPill,
          sizePreset === 'sm' && styles.shellSizeSm,
          sizePreset === 'md' && styles.shellSizeMd,
          sizePreset === 'lg' && styles.shellSizeLg,
          multiline && styles.shellMultiline,
          variant === 'stage' && styles.stageShell,
          {
            backgroundColor: stateColors.background,
            borderColor: stateColors.border,
            borderWidth: stateBorderWidth,
            paddingHorizontal: fieldHorizontalPadding - statePaddingOffset,
          },
          !labelHidden && { paddingVertical: fieldFloatingPaddingY - statePaddingOffset },
          multiline && { paddingVertical: fieldMultilinePaddingY - statePaddingOffset },
          shellStyle,
        ])}>
        {iconNode}
        <View style={styles.inputStack}>
          {labelHidden ? null : (
            <AppText
              numberOfLines={1}
              style={StyleSheet.flatten([
                styles.floatingLabel,
                active && styles.floatingLabelActive,
                !active && styles.floatingLabelEmpty,
                !active && getEmptyLabelSizeStyle(sizePreset, multiline),
              ])}
              tone={stateTones.label}
              variant={active ? 'label.default' : 'body.prominent'}>
              {label}
            </AppText>
          )}
          <TextInput
            ref={inputRef}
            accessibilityLabel={props.accessibilityLabel ?? label}
            editable={fieldEditable}
            multiline={multiline}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            placeholder={inputPlaceholder}
            placeholderTextColor={placeholderTextColor ?? colors.text.tertiary}
            selectionColor={colors.brand.fg}
            style={StyleSheet.flatten([
              styles.input,
              !labelHidden && styles.inputFloating,
              !labelHidden && !active && styles.inputEmpty,
              sizePreset === 'sm' && styles.inputSizeSm,
              sizePreset === 'md' && styles.inputSizeMd,
              sizePreset === 'lg' && styles.inputSizeLg,
              multiline && styles.inputMultiline,
              variant === 'stage' && styles.stageInput,
              (resolvedState === 'focused' || filled) && styles.inputEmphasized,
              { color: stateColors.input },
              inputStyle,
            ])}
            textAlignVertical={multiline ? 'top' : 'center'}
            value={value}
            {...props}
          />
        </View>
        {rightSlot ? <View style={StyleSheet.flatten([styles.rightSlot, rightSlotFlush && styles.rightSlotFlush])}>{rightSlot}</View> : null}
      </NativePressable>
      <FieldMessage error={error} helperText={helperText} successText={successText} />
    </View>
  );
}

export function SelectField({
  containerStyle,
  disabled,
  error,
  fieldState = 'default',
  helperText,
  icon,
  label,
  menuStyle,
  onChangeValue,
  optionTextStyle,
  options,
  placeholder,
  readonly,
  shellStyle,
  successText,
  value,
  variant: _variant = 'neutral',
}: SelectFieldProps) {
  const colors = useThemeColors();
  const shellRef = useRef<View>(null);
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuFrame, setMenuFrame] = useState<SelectMenuFrame | null>(null);
  const selected = options.find((item) => item.value === value);
  const filled = hasTextValue(value);
  const resolvedState = resolveFieldState({ disabled, error, fieldState, focused: focused || open, readonly });
  const stateColors = getFieldStateColors(colors, resolvedState);
  const stateTones = getFieldStateTextTones(resolvedState);
  const stateBorderWidth = getFieldBorderWidth(resolvedState);
  const statePaddingOffset = stateBorderWidth - fieldBaseBorderWidth;
  const iconTone = getFieldStateIconTone(resolvedState);
  const active = focused || open || hasTextValue(value);
  const iconNode =
    typeof icon === 'string' ? <AppIcon name={icon as AppIconName} sizeVariant="xs" tone={iconTone} /> : icon ?? null;
  const fieldText = selected?.label ?? (active ? value : '');
  const canEdit = !disabled && !readonly;
  const usesWebMenu = Platform.OS === 'web' && canEdit;
  const closeWebMenu = () => {
    setOpen(false);
    setFocused(false);
  };
  const openWebMenu = () => {
    setFocused(true);

    shellRef.current?.measureInWindow((left, top, width, height) => {
      setMenuFrame(resolveSelectMenuFrame({ height, left, top, width }));
      setOpen(true);
    });
  };

  return (
    <View style={StyleSheet.flatten([styles.wrap, containerStyle, open && styles.selectWrapOpen])}>
      <View
        ref={shellRef}
        style={StyleSheet.flatten([
          styles.shell,
          styles.shellFloating,
          open && styles.selectShellOpen,
          {
            backgroundColor: stateColors.background,
            borderColor: stateColors.border,
            borderWidth: stateBorderWidth,
            paddingHorizontal: fieldHorizontalPadding - statePaddingOffset,
          },
          { paddingVertical: fieldFloatingPaddingY - statePaddingOffset },
          shellStyle,
        ])}>
        {iconNode}
        <View style={styles.inputStack}>
          <AppText
            numberOfLines={1}
            style={StyleSheet.flatten([
              styles.floatingLabel,
              active && styles.floatingLabelActive,
              !active && styles.floatingLabelEmpty,
              !active && styles.floatingLabelEmptyDefault,
            ])}
            tone={stateTones.label}
            variant={active ? 'label.default' : 'body.prominent'}>
            {label}
          </AppText>
          <AppText
            numberOfLines={1}
            style={StyleSheet.flatten([
              styles.selectText,
              styles.selectValueText,
              (resolvedState === 'focused' || filled) && styles.inputEmphasized,
              !active && styles.inputEmpty,
            ])}
            tone={stateTones.input}
            variant="body.prominent">
            {fieldText || placeholder}
          </AppText>
        </View>
        <AppIcon name="icon.system.chevron_down" sizeVariant="xs" />
        {usesWebMenu ? (
          <NativePressable
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityState={{ expanded: open }}
            minTouch={0}
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
            onPress={() => {
              if (open) {
                closeWebMenu();
                return;
              }

              openWebMenu();
            }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <NativePressable
            accessibilityLabel={label}
            accessibilityRole="button"
            disabled={!canEdit}
            minTouch={0}
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
            onPress={() => {
              const currentIndex = Math.max(0, options.findIndex((item) => item.value === value));
              const nextOptions = options.filter((item) => !item.disabled);
              const nextIndex = nextOptions.findIndex((item) => item.value === options[currentIndex]?.value);
              const fallbackIndex = nextIndex >= 0 ? nextIndex : -1;
              const next = nextOptions[(fallbackIndex + 1) % nextOptions.length];

              if (next) {
                onChangeValue(next.value);
              }
            }}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>
      {usesWebMenu && open ? (
        <Modal animationType="none" onRequestClose={closeWebMenu} transparent visible={open}>
          <View style={styles.webSelectLayer}>
            <NativePressable
              accessibilityLabel={label}
              accessibilityRole="button"
              minTouch={0}
              onPress={closeWebMenu}
              pressedStyle={styles.webSelectBackdrop}
              style={styles.webSelectBackdrop}
            />
            <View
              style={StyleSheet.flatten([
                styles.webSelectMenu,
                menuFrame ? getWebSelectMenuFrameStyle(menuFrame) : null,
                { backgroundColor: colors.surface.raised, borderColor: colors.border.default },
                menuStyle,
              ])}>
              {placeholder ? (
                <SelectOptionRow
                  disabled={false}
                  label={placeholder}
                  onPress={() => {
                    onChangeValue('');
                    closeWebMenu();
                  }}
                  selected={value === ''}
                  textStyle={optionTextStyle}
                />
              ) : null}
              {options.map((item) => (
                <SelectOptionRow
                  disabled={item.disabled}
                  key={item.value}
                  label={item.label}
                  onPress={() => {
                    onChangeValue(item.value);
                    closeWebMenu();
                  }}
                  selected={item.value === value}
                  textStyle={optionTextStyle}
                />
              ))}
            </View>
          </View>
        </Modal>
      ) : null}
      <FieldMessage error={error} helperText={helperText} successText={successText} />
    </View>
  );
}

function resolveSelectMenuFrame({
  height,
  left,
  top,
  width,
}: {
  height: number;
  left: number;
  top: number;
  width: number;
}): SelectMenuFrame {
  const belowTop = top + height + selectMenuOffset;
  const belowSpace = getViewportHeight() - belowTop - selectMenuViewportInset;

  return {
    left,
    maxHeight: Math.max(selectMenuMinHeight, Math.min(selectMenuMaxHeight, belowSpace)),
    top: belowTop,
    width,
  };
}

function getViewportHeight() {
  if (typeof globalThis === 'object' && 'innerHeight' in globalThis && typeof globalThis.innerHeight === 'number') {
    return globalThis.innerHeight;
  }

  return 720;
}

function getWebSelectMenuFrameStyle(frame: SelectMenuFrame): ViewStyle {
  return {
    left: frame.left,
    maxHeight: frame.maxHeight,
    position: 'fixed' as unknown as 'absolute',
    right: undefined,
    top: frame.top,
    width: frame.width,
  };
}

function SelectOptionRow({
  disabled,
  label,
  onPress,
  selected,
  textStyle,
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  selected: boolean;
  textStyle?: StyleProp<TextStyle>;
}) {
  const colors = useThemeColors();

  return (
    <NativePressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      minTouch={fieldSelectOptionMinTouch}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.webSelectOption,
        {
          backgroundColor: 'transparent',
          borderColor: selected ? colors.text.primary : 'transparent',
        },
      ])}>
      <AppText numberOfLines={1} style={textStyle} tone={disabled ? 'dim' : 'default'} variant="caption">
        {label}
      </AppText>
    </NativePressable>
  );
}

export function RichTextField({ footerSlot, toolbarSlot, ...props }: RichTextFieldProps) {
  return (
    <View style={styles.richTextWrap}>
      {toolbarSlot ? <View style={styles.richTextSlot}>{toolbarSlot}</View> : null}
      <TextField multiline {...props} />
      {footerSlot ? <View style={styles.richTextSlot}>{footerSlot}</View> : null}
    </View>
  );
}

function FieldMessage({
  error,
  helperText,
  successText,
}: {
  error?: string;
  helperText?: string;
  successText?: string;
}) {
  if (error) {
    return (
      <AppText tone="danger" variant="caption">
        {error}
      </AppText>
    );
  }

  if (successText) {
    return (
      <AppText tone="down" variant="caption">
        {successText}
      </AppText>
    );
  }

  if (helperText) {
    return (
      <AppText tone="muted" variant="caption">
        {helperText}
      </AppText>
    );
  }

  return null;
}

function hasTextValue(value: unknown) {
  return typeof value === 'string' ? value.length > 0 : value !== undefined && value !== null;
}

function resolveFieldState({
  disabled,
  error,
  fieldState,
  focused,
  readonly,
}: {
  disabled?: boolean;
  error?: string;
  fieldState: FormFieldState;
  focused: boolean;
  readonly?: boolean;
}): FormFieldState {
  if (disabled || fieldState === 'disabled') {
    return 'disabled';
  }

  if (error || fieldState === 'error') {
    return 'error';
  }

  if (readonly || fieldState === 'readonly') {
    return 'readonly';
  }

  if (focused) {
    return 'focused';
  }

  if (fieldState === 'inputting' || fieldState === 'validating' || fieldState === 'success') {
    return fieldState;
  }

  return 'default';
}

function getFieldStateColors(colors: ThemeColors, state: FormFieldState) {
  const base = {
    background: 'transparent',
    border: colors.border.default,
    icon: colors.text.tertiary,
    input: colors.text.primary,
    label: colors.text.primary,
  };

  if (state === 'disabled') {
    return {
      ...base,
      background: colors.surface.subtle,
      border: colors.border.subtle,
      icon: colors.text.tertiary,
      input: colors.text.tertiary,
      label: colors.text.primary,
    };
  }

  if (state === 'readonly') {
    return {
      ...base,
      background: colors.surface.subtle,
      border: colors.border.subtle,
      icon: colors.text.tertiary,
      input: colors.text.secondary,
      label: colors.text.primary,
    };
  }

  if (state === 'error') {
    return {
      ...base,
      border: colors.status.danger.fg,
      icon: colors.status.danger.fg,
      label: colors.status.danger.fg,
    };
  }

  if (state === 'validating') {
    return {
      ...base,
      border: colors.status.warning.fg,
      icon: colors.text.tertiary,
      label: colors.text.secondary,
    };
  }

  if (state === 'success') {
    return {
      ...base,
      border: colors.market.down.fg,
      icon: colors.text.tertiary,
      label: colors.text.secondary,
    };
  }

  if (state === 'focused') {
    return {
      ...base,
      border: colors.text.primary,
      label: colors.text.primary,
    };
  }

  return base;
}

function getFieldStateTextTones(state: FormFieldState): { input: AppTextTone; label: AppTextTone } {
  if (state === 'disabled') {
    return { input: 'dim', label: 'dim' };
  }

  if (state === 'error') {
    return { input: 'default', label: 'danger' };
  }

  if (state === 'validating' || state === 'success' || state === 'focused' || state === 'readonly') {
    return { input: 'default', label: 'default' };
  }

  return { input: 'default', label: 'default' };
}

function getFieldStateIconTone(state: FormFieldState): IconTone {
  if (state === 'error') {
    return 'danger';
  }

  return 'textDim';
}

function getFieldBorderWidth(state: FormFieldState) {
  if (state === 'focused' || state === 'inputting' || state === 'error') {
    return fieldActiveBorderWidth;
  }

  return fieldBaseBorderWidth;
}

function getEmptyLabelSizeStyle(sizePreset: FormFieldSizePreset, multiline?: boolean) {
  if (multiline) {
    return styles.floatingLabelEmptyMultiline;
  }

  if (sizePreset === 'sm') {
    return styles.floatingLabelEmptySm;
  }

  if (sizePreset === 'md') {
    return styles.floatingLabelEmptyMd;
  }

  if (sizePreset === 'lg') {
    return styles.floatingLabelEmptyLg;
  }

  return styles.floatingLabelEmptyDefault;
}

const styles = StyleSheet.create({
  floatingLabel: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
  floatingLabelActive: {
    top: spacing.none,
    transform: [{ translateY: spacing.none }],
  },
  floatingLabelEmpty: {
    ...typography.bodyLg,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  floatingLabelEmptyDefault: {
    top: fieldEmptyLabelDefaultTop,
  },
  floatingLabelEmptyLg: {
    top: fieldEmptyLabelLgTop,
  },
  floatingLabelEmptyMd: {
    top: fieldEmptyLabelMdTop,
  },
  floatingLabelEmptyMultiline: {
    top: '50%',
    transform: [{ translateY: -typography.bodyLg.lineHeight / 2 }],
  },
  floatingLabelEmptySm: {
    top: fieldEmptyLabelSmTop,
  },
  input: {
    flex: 1,
    ...typography.bodyLg,
    minHeight: size.input.contentMinHeight,
    minWidth: 0,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null),
    padding: 0,
  },
  inputEmphasized: {
    fontWeight: typography.titleSm.fontWeight,
  },
  inputEmpty: {
    opacity: 0,
  },
  inputFloating: {
    paddingTop: 16,
  },
  inputMultiline: {
    minHeight: size.input.multilineContentMinHeight,
    paddingTop: 20,
  },
  inputStack: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    position: 'relative',
  },
  richTextSlot: {
    minWidth: 0,
  },
  richTextWrap: {
    gap: spacing.sm,
  },
  rightSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: fieldRightSlotMinTouch,
    minWidth: fieldRightSlotMinTouch,
  },
  rightSlotFlush: {
    marginRight: -fieldRightSlotFlushOffset,
  },
  selectText: {
    paddingTop: 16,
  },
  selectValueText: {
    ...typography.bodyLg,
  },
  shell: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: fieldBaseBorderWidth,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: size.input.singleLineMinHeight,
    paddingHorizontal: fieldHorizontalPadding,
    position: 'relative',
  },
  shellFloating: {
    minHeight: size.input.floatingMinHeight,
    paddingVertical: fieldFloatingPaddingY,
  },
  shellPill: {
    borderRadius: radius.full,
  },
  shellSizeMd: {
    minHeight: size.control.md,
  },
  shellSizeSm: {
    minHeight: size.control.sm,
  },
  shellSizeLg: {
    minHeight: size.input.largeFloatingMinHeight,
  },
  shellMultiline: {
    alignItems: 'flex-start',
    minHeight: size.input.multilineMinHeight,
    paddingVertical: fieldMultilinePaddingY,
  },
  inputSizeMd: {
    minHeight: size.control.md - lineWidth.selected * 2,
  },
  inputSizeSm: {
    minHeight: size.control.sm - lineWidth.selected * 2,
  },
  inputSizeLg: {
    minHeight: size.input.largeContentMinHeight,
  },
  stageInput: {
    ...typography.quoteLg,
    minHeight: size.input.multilineContentMinHeight,
  },
  stageShell: {
    minHeight: size.input.multilineMinHeight,
  },
  wrap: {
    gap: spacing.sm,
  },
  selectShellOpen: {
    zIndex: 31,
  },
  selectWrapOpen: {
    zIndex: 30,
  },
  webSelectBackdrop: {
    bottom: 0,
    left: 0,
    minHeight: 0,
    minWidth: 0,
    opacity: 1,
    position: 'fixed' as unknown as 'absolute',
    right: 0,
    top: 0,
    zIndex: selectMenuZIndex,
  },
  webSelectLayer: {
    bottom: 0,
    left: 0,
    position: 'fixed' as unknown as 'absolute',
    right: 0,
    top: 0,
    zIndex: selectMenuZIndex,
  },
  webSelectMenu: {
    borderRadius: radius.sm,
    borderWidth: lineWidth.strong,
    gap: spacing.xs,
    maxHeight: 240,
    overflowY: 'auto' as unknown as 'visible',
    padding: spacing.xs,
    position: 'fixed' as unknown as 'absolute',
    zIndex: selectMenuZIndex + 1,
  },
  webSelectOption: {
    borderRadius: radius.xs,
    borderWidth: lineWidth.selected,
    minHeight: fieldSelectOptionMinTouch,
    minWidth: 0,
    paddingHorizontal: spacing.sm,
  },
});
