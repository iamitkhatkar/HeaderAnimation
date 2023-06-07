import {useWindowDimensions, StyleSheet, Image} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EmptyStateImg from '../assets/images/empty-state.png';
import {Colors} from '../theme/colors';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {FontSizes, Spacing} from '../theme/sizes';

const HEADER_HEIGHT = 60;
const MAX_TRANSLATE_X = 50;
const MIN_TRANSLATE_X = 0;

const EmptyState = () => {
  const {top} = useSafeAreaInsets();
  const {height} = useWindowDimensions();
  const isFocused = useSharedValue(0);
  const containerHeight = height - HEADER_HEIGHT - top;

  const onLayout = () => {
    isFocused.value = withTiming(1, {duration: 200});
  };

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            isFocused.value,
            [0, 1],
            [MAX_TRANSLATE_X, MIN_TRANSLATE_X],
          ),
        },
      ],
      opacity: interpolate(isFocused.value, [0, 1], [0, 1]),
    };
  }, []);

  return (
    <Animated.View
      onLayout={onLayout}
      style={[styles.container, {height: containerHeight}]}>
      <Image source={EmptyStateImg} style={styles.image} />
      <Animated.Text style={[styles.text, translateStyle]}>
        No Results!
      </Animated.Text>
    </Animated.View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
    paddingBottom: Spacing.xxxLarge,
  },
  image: {
    width: '100%',
    height: '40%',
    resizeMode: 'contain',
  },
  text: {
    fontSize: FontSizes.xLarge,
    fontWeight: 'bold',
    paddingTop: Spacing.xxLarge,
    color: Colors.subheadline,
  },
});
