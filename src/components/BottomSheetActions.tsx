import type { ReactNode } from 'react';

import { bottomSheetPresets, type BottomSheetAction, type BottomSheetHeaderOptions, type BottomSheetOptions } from './BottomSheet';

type BottomSheetController = {
  back: () => void;
  hide: () => void;
  hideForce: () => void;
  push: (options: BottomSheetOptions) => void;
  show: (options: BottomSheetOptions) => void;
  update: (options: BottomSheetOptions) => void;
};

type SheetOpenMode = 'push' | 'show' | 'update';

type SheetBaseOptions = {
  allowPanDownDismiss?: boolean;
  content: ReactNode;
  footer?: ReactNode | BottomSheetAction[];
  onDismiss?: () => void;
  onRequestClose?: () => false | void;
};

type HeaderSheetOptions = SheetBaseOptions & BottomSheetHeaderOptions;

type ActionSheetOptions = SheetBaseOptions & {
  leftIcon?: BottomSheetHeaderOptions['leftIcon'];
  sheetSurface?: NonNullable<BottomSheetOptions['sheetSurface']>;
  title?: BottomSheetHeaderOptions['title'];
};

type SelectionSheetOptions = HeaderSheetOptions & {
  cardSelection?: boolean;
  contentPadding?: NonNullable<BottomSheetOptions['contentPadding']>;
  fixed?: boolean;
  sheetSurface?: NonNullable<BottomSheetOptions['sheetSurface']>;
};

function dispatchSheet(bottomSheet: BottomSheetController, options: BottomSheetOptions, mode: SheetOpenMode = 'show') {
  if (mode === 'push') {
    bottomSheet.push(options);
    return;
  }

  if (mode === 'update') {
    bottomSheet.update(options);
    return;
  }

  bottomSheet.show(options);
}

export function openActionSheet(bottomSheet: BottomSheetController, options: ActionSheetOptions, mode?: SheetOpenMode) {
  const { leftIcon, title, ...sheetOptions } = options;
  const presetOptions = {
    ...sheetOptions,
    allowPanDownDismiss: sheetOptions.allowPanDownDismiss ?? true,
    contentPadding: sheetOptions.sheetSurface === 'canvas' ? 'card' as const : 'plain' as const,
    contentSizing: 'auto' as const,
    heightMode: 'adaptive' as const,
    sheetSurface: sheetOptions.sheetSurface ?? 'panel',
  };

  dispatchSheet(
    bottomSheet,
    title ? bottomSheetPresets.detail({ ...presetOptions, leftIcon, title }) : bottomSheetPresets.actionMenu(presetOptions),
    mode,
  );
}

export function openDetailSheet(bottomSheet: BottomSheetController, options: HeaderSheetOptions, mode?: SheetOpenMode) {
  dispatchSheet(
    bottomSheet,
    bottomSheetPresets.detail({
      ...options,
      allowPanDownDismiss: options.allowPanDownDismiss ?? true,
      contentPadding: 'card',
      contentSizing: 'auto',
      heightMode: 'adaptive',
      sheetSurface: 'canvas',
    }),
    mode,
  );
}

export function openScrollableDetailSheet(bottomSheet: BottomSheetController, options: HeaderSheetOptions, mode?: SheetOpenMode) {
  dispatchSheet(
    bottomSheet,
    bottomSheetPresets.detail({
      ...options,
      allowPanDownDismiss: options.allowPanDownDismiss ?? true,
      contentPadding: 'card',
      contentSizing: 'fill',
      heightMode: 'fixed',
      sheetSurface: 'canvas',
    }),
    mode,
  );
}

export function openSelectionSheet(bottomSheet: BottomSheetController, options: SelectionSheetOptions, mode?: SheetOpenMode) {
  const { cardSelection, contentPadding, fixed = true, sheetSurface, ...sheetOptions } = options;

  dispatchSheet(
    bottomSheet,
    bottomSheetPresets.selection({
      ...sheetOptions,
      allowPanDownDismiss: sheetOptions.allowPanDownDismiss ?? true,
      contentPadding: contentPadding ?? (cardSelection ? 'card' : 'plain'),
      contentSizing: fixed ? 'fill' : 'auto',
      heightMode: fixed ? 'fixed' : 'adaptive',
      sheetSurface: sheetSurface ?? (cardSelection ? 'canvas' : 'panel'),
    }),
    mode,
  );
}

export function openFixedListSheet(bottomSheet: BottomSheetController, options: HeaderSheetOptions, mode?: SheetOpenMode) {
  dispatchSheet(
    bottomSheet,
    bottomSheetPresets.selection({
      ...options,
      allowPanDownDismiss: options.allowPanDownDismiss ?? true,
      contentPadding: 'plain',
      contentSizing: 'fill',
      heightMode: 'fixed',
      sheetSurface: 'panel',
    }),
    mode,
  );
}

export function openConfirmSheet(bottomSheet: BottomSheetController, options: HeaderSheetOptions, mode: SheetOpenMode = 'push') {
  openDetailSheet(bottomSheet, options, mode);
}
