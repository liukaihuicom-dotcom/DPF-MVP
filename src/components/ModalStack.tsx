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
  backInModal: () => void;
  back: () => void;
  closeRootModal: () => void;
  dismiss: () => void;
  dismissModalStack: () => void;
  presentFullScreen: (options: FullScreenModalOptions) => void;
  pushFullScreen: (options: FullScreenModalOptions) => void;
};

const ModalStackContext = createContext<ModalStackContextValue | null>(null);

export function ModalStackProvider({ children }: PropsWithChildren) {
  const [stack, setStack] = useState<FullScreenModalOptions[]>([]);

  const dismissModalStack = useCallback(() => {
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
  const backInModal = useCallback(() => {
    setStack((current) => {
      current.at(-1)?.onDismiss?.();
      return current.length > 1 ? current.slice(0, -1) : [];
    });
  }, []);
  const closeRootModal = dismissModalStack;
  const back = backInModal;
  const dismiss = dismissModalStack;
  const value = useMemo(
    () => ({ back, backInModal, closeRootModal, dismiss, dismissModalStack, presentFullScreen, pushFullScreen }),
    [back, backInModal, closeRootModal, dismiss, dismissModalStack, presentFullScreen, pushFullScreen],
  );

  return (
    <ModalStackContext.Provider value={value}>
      {children}
      <GlobalModalStackHost
        stack={stack}
        onRequestClose={stack.length > 1 ? backInModal : closeRootModal}
      />
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
