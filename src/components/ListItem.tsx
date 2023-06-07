import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '../theme/colors';
import {FontSizes, Spacing} from '../theme/sizes';
import {ListItemProps} from './types';

const ListItem = ({title, description}: ListItemProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderBottomWidth: 1,
    gap: Spacing.small,
    borderBottomColor: Colors.tertiary,
  },
  title: {
    color: Colors.headline,
    fontSize: FontSizes.xLarge,
  },
  description: {
    color: Colors.subheadline,
    fontSize: FontSizes.small,
  },
});
