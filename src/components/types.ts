import Animated from 'react-native-reanimated';

export type HeaderProps = {
  scrollY: Animated.SharedValue<number>;
  activationProgress: Animated.SharedValue<number>;
  onChangeText: (text: string) => void;
  value: string;
};

export type FabProps = {
  isEmpty: boolean;
};

export type ListItemProps = {
  title: string;
  description: string;
};
