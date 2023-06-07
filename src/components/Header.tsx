import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {HeaderProps} from './types';
import {FontSizes, Spacing} from '../theme/sizes';
import {Colors} from '../theme/colors';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

const SEARCH_ICON_SIZE = 24;
const SEARCH_CONTAINER_SIZE = 40;
const MAX_SCALE = 4;
const MIN_SCALE = 1.3;
const DEFAULT_SCALE = 1;
const SEARCH_ACTIVATION_THRESHOLD_Y = -50;
const SEARCH_SCALE_THRESHOLD_Y = -45;

const MIN_ACTIVATION_RANGE = 0;
const MAX_ACTIVATION_RANGE = 1;

const MENU_ICON_MAX_TRANSLATE_X = -100;
const TITLE_MAX_TRANSLATE_Y = 80;
const CANCEL_BUTTON_MAX_TRANSLATE_X = 50;

const Header = ({
  scrollY,
  activationProgress,
  onChangeText,
  value,
}: HeaderProps) => {
  const {top} = useSafeAreaInsets();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const showScaleMax = useSharedValue(true);

  const inputRef = useRef<TextInput>(null);

  useDerivedValue(() => {
    runOnJS(setIsSearchActive)(activationProgress.value === 1);
    showScaleMax.value =
      activationProgress.value > 0 &&
      activationProgress.value < 1 &&
      scrollY.value < 0;
  });

  useEffect(() => {
    if (isSearchActive) {
      inputRef?.current?.focus();
    } else {
      inputRef?.current?.blur();
    }
  }, [isSearchActive]);

  const onSearchPress = () => {
    activationProgress.value = withTiming(1, {duration: 400});
  };

  const onCancelPress = () => {
    onChangeText('');
    activationProgress.value = withTiming(0, {duration: 400});
  };

  const searchCircleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-10, SEARCH_ACTIVATION_THRESHOLD_Y],
          [0, SEARCH_ACTIVATION_THRESHOLD_Y],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const searchContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: showScaleMax.value
            ? interpolate(
                activationProgress.value,
                [0, 1],
                [MIN_SCALE, MAX_SCALE],
                Extrapolate.CLAMP,
              )
            : interpolate(
                scrollY.value,
                [SEARCH_ACTIVATION_THRESHOLD_Y, SEARCH_SCALE_THRESHOLD_Y, 0],
                [MIN_SCALE, DEFAULT_SCALE, DEFAULT_SCALE],
                Extrapolate.CLAMP,
              ),
        },
        {
          translateX: showScaleMax.value
            ? 0
            : interpolate(
                activationProgress.value,
                [MIN_ACTIVATION_RANGE, MAX_ACTIVATION_RANGE],
                [0, CANCEL_BUTTON_MAX_TRANSLATE_X],
              ),
        },
      ],
      opacity: interpolate(
        activationProgress.value,
        [MIN_ACTIVATION_RANGE, MAX_ACTIVATION_RANGE],
        [1, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  const menuWrapperStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          activationProgress.value,
          [MIN_ACTIVATION_RANGE, MAX_ACTIVATION_RANGE],
          [0, MENU_ICON_MAX_TRANSLATE_X],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          activationProgress.value,
          [MIN_ACTIVATION_RANGE, MAX_ACTIVATION_RANGE],
          [0, TITLE_MAX_TRANSLATE_Y],
          Extrapolate.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      activationProgress.value,
      [0, 0.5],
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }));

  const searchBarStyle = useAnimatedStyle(() => ({
    opacity: activationProgress.value,
  }));

  const cancelButtonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          activationProgress.value,
          [0, 1],
          [CANCEL_BUTTON_MAX_TRANSLATE_X, 0],
          Extrapolate.CLAMP,
        ),
      },
    ],
    opacity: interpolate(activationProgress.value, [0.9, 1], [0, 1]),
    top: top + Spacing.xMedium,
  }));

  return (
    <View style={[styles.container, {paddingTop: top + 10}]}>
      <Animated.View style={menuWrapperStyle}>
        <Icon name="menu" size={24} color={Colors.tertiary} />
      </Animated.View>

      <Animated.Text style={[styles.title, animatedTitleStyle]}>
        NOTES
      </Animated.Text>

      <AnimatedButton
        onPress={onSearchPress}
        style={[styles.searchContainer, searchContainerStyle]}>
        <Animated.View style={[styles.circle, searchCircleStyle]} />
        <Icon name="search" size={SEARCH_ICON_SIZE} color={Colors.tertiary} />
      </AnimatedButton>

      <AnimatedTextInput
        style={[styles.textInput, searchBarStyle]}
        placeholder="Search Here"
        onChangeText={onChangeText}
        value={value}
        ref={inputRef}
        pointerEvents={isSearchActive ? 'auto' : 'none'}
        placeholderTextColor={Colors.subheadline}
      />

      <Animated.Text
        onPress={onCancelPress}
        style={[styles.cancelTextStyle, cancelButtonStyle]}>
        Cancel
      </Animated.Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.xSmall,
    backgroundColor: Colors.primary,
  },
  searchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: SEARCH_CONTAINER_SIZE,
    height: SEARCH_CONTAINER_SIZE,
    borderRadius: SEARCH_CONTAINER_SIZE / 2,
    backgroundColor: Colors.secondary,
  },
  title: {
    color: Colors.subheadline,
    fontSize: FontSizes.xLarge,
  },
  cancelTextStyle: {
    color: Colors.subheadline,
    fontSize: FontSizes.medium,
    position: 'absolute',
    right: 20,
  },
  circle: {
    position: 'absolute',
    width: SEARCH_CONTAINER_SIZE,
    height: SEARCH_CONTAINER_SIZE,
    backgroundColor: '#211F24',
  },
  textInput: {
    width: '80%',
    bottom: Spacing.xSmall,
    left: Spacing.xMedium,
    color: Colors.headline,
    backgroundColor: Colors.inputBackground,
    fontSize: FontSizes.medium,
    borderRadius: Spacing.tiny,
    padding: Spacing.xSmall,
    position: 'absolute',
  },
});
