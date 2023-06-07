import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItem,
} from 'react-native';
import React, {useState} from 'react';
import Header from './src/components/Header';
import ListItem from './src/components/ListItem';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import Fab from './src/components/Fab';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Colors} from './src/theme/colors';
import EmptyState from './src/components/EmptyState';

interface Item {
  id: number;
  title: string;
  description: string;
}

const listData: Item[] = [
  {
    id: 1,
    title: 'First Item',
    description: 'This is the first item',
  },
];

const SearchAnimation = () => {
  const scrollY = useSharedValue(0);
  const activationProgress = useSharedValue(0);
  const [searchText, setSearchText] = React.useState('');
  const [data, setData] = useState<Item[]>(listData);

  const renderItem: ListRenderItem<Item> = ({item}) => {
    return <ListItem title={item.title} description={item.description} />;
  };

  const onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = nativeEvent.contentOffset.y;
  };

  const onScrollEndDrag = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (nativeEvent.contentOffset.y < -50) {
      activationProgress.value = withTiming(1, {duration: 400});
    }
  };

  const onSearch = (txt: string) => {
    setSearchText(txt);
    setData(listData.filter(item => item.title.includes(txt)));
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <Header
          scrollY={scrollY}
          activationProgress={activationProgress}
          onChangeText={onSearch}
          value={searchText}
        />
        <FlatList
          data={data}
          bounces={searchText.length === 0}
          renderItem={renderItem}
          onScroll={onScroll}
          contentContainerStyle={styles.contentContainerStyle}
          onScrollEndDrag={onScrollEndDrag}
          ListEmptyComponent={EmptyState}
          scrollEventThrottle={16}
        />
        <Fab isEmpty={data.length === 0} />
      </View>
    </SafeAreaProvider>
  );
};

export default SearchAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
});
