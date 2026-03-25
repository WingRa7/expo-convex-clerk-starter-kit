import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Use selectionAsync for tab-switching as it's the platform standard 
          // and often more reliable in simulators than specific impact patterns.
          try {
            Haptics.selectionAsync();
          } catch (error) {
            // Silently ignore haptic errors (common in iOS simulators)
          }
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

