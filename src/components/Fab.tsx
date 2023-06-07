import {StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '../theme/colors';
import {Spacing} from '../theme/sizes';
import {FabProps} from './types';

const FAB_SIZE = 60;

const Fab = ({isEmpty}: FabProps) => {
  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isEmpty ? -keyboard.height.value : 0, {
            duration: 200,
          }),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.container, translateStyle]}>
      <Icon name="document-text-outline" size={FAB_SIZE / 2} color="#02122F" />
    </Animated.View>
  );
};

export default Fab;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Spacing.xMedium,
    right: Spacing.none,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.xMedium,
  },
});
