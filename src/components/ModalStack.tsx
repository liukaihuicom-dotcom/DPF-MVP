import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { layout, spacing } from '@/src/theme/tokens';

type FullScreenModalOptions = {
  content: ReactNode;
  onDismiss?: () => void;
  title: string;
};

type ModalStackContextValue = {
  back: () => void;
  dismiss: () => void;
  presentFullScreen: (options: FullScreenModalOptions) => void;
  pushFullScreen: (options: FullScreenModalOptions) => void;
};

const ModalStackContext = createContext<ModalStackContextValue | null>(null);

export function ModalStackProvider({ children }: PropsWithChildren) {
  const [stack, setStack] = useState<FullScreenModalOptions[]>([]);

  const dismiss = useCallback(() => {
    setStack((current) => {
      current.at(-1)?.onDismiss?.();
      return [];
    });
  }, []);
  const presentFullScreen = useCallback((options: FullScreenModalOptions) => {
    setStack([options]);
  }, []);
  const pushFullScreen = useCallback((options: FullScreenModalOptions) => {
    setStack((current) => [...current, options]);
  }, []);
  const back = useCallback(() => {
    setStack((current) => {
      current.at(-1)?.onDismiss?.();
      return current.length > 1 ? current.slice(0, -1) : [];
    });
  }, []);
  const value = useMemo(() => ({ back, dismiss, presentFullScreen, pushFullScreen }), [back, dismiss, presentFullScreen, pushFullScreen]);

  return (
    <ModalStackContext.Provider value={value}>
      {children}
      <GlobalModalStackHost stack={stack} onRequestClose={back} />
    </ModalStackContext.Provider>
  );
}

export function useModalStack() {
  const context = useContext(ModalStackContext);

  if (!context) {
    throw new Error('useModalStack must be used inside ModalStackProvider');
  }

  return context;
}

function GlobalModalStackHost({ onRequestClose, stack }: { onRequestClose: () => void; stack: FullScreenModalOptions[] }) {
  const colors = useThemeColors();
  const active = stack.at(-1);

  return (
    <Modal
      accessibilityViewIsModal
      animationType="slide"
      onRequestClose={onRequestClose}
      presentationStyle="fullScreen"
      visible={Boolean(active)}>
      {active ? (
        <SafeAreaView style={StyleSheet.flatten([styles.fullScreen, { backgroundColor: colors.surface.canvas }])}>
          <View style={styles.content}>{active.content}</View>
        </SafeAreaView>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    maxWidth: layout.appMaxWidth,
    width: '100%',
  },
  fullScreen: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.none,
  },
});
