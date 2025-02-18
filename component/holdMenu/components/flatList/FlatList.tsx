import React, {memo} from 'react';
import {
  FlatList as RNFlatList,
  type FlatListProps as RNFlatListProps,
} from 'react-native';

import _ from 'lodash';
import Animated from 'react-native-reanimated';

const AnimatedFlatList = Animated.createAnimatedComponent(RNFlatList);

export type HoldMenuFlatListProps<T> = Omit<
  RNFlatListProps<T>,
  'scrollEventThrottle'
>;

const HoldMenuFlatListComponent = (props: HoldMenuFlatListProps<any>) => {
  return <AnimatedFlatList {...props} scrollEventThrottle={16} />;
};

const HoldMenuFlatList = memo(HoldMenuFlatListComponent, _.isEqual);

export default HoldMenuFlatList;
