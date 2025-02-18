import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';

import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  menuAnimationAnchor,
} from '../../utils/calculations';


import {
  SPRING_CONFIGURATION_MENU,
  HOLD_ITEM_TRANSFORM_DURATION,
  IS_IOS,
  CONTEXT_MENU_STATE,
} from '../../constants';

import { useInternal } from '../../hooks';
import { leftOrRight } from './calculations';
import styles from './styles';
import { Div } from 'react-native-magnus';


const MenuListComponent = () => {
  const { state, theme, menuProps, menuBgColors } = useInternal();

  const [itemList, setItemList] = React.useState<(() => JSX.Element)[]>([]);

  const prevList = useSharedValue<(() => JSX.Element)[]>([]);

  const messageStyles = useAnimatedStyle(() => {
    'worklet';

    const translate = menuAnimationAnchor(
      menuProps.value.anchorPosition,
      menuProps.value.itemWidth,
      menuProps.value
    );

    const _leftPosition = leftOrRight(menuProps);

    const menuScaleAnimation = () =>
      state.value === CONTEXT_MENU_STATE.ACTIVE
        ? withSpring(1, SPRING_CONFIGURATION_MENU)
        : withTiming(0, {
          duration: HOLD_ITEM_TRANSFORM_DURATION,
        });

    const opacityAnimation = () =>
      withTiming(state.value === CONTEXT_MENU_STATE.ACTIVE ? 1 : 0, {
        duration: HOLD_ITEM_TRANSFORM_DURATION,
      });

    return {
      left: _leftPosition,
      height: menuProps.value.menuHeight,
      width: menuProps.value.menuWidth,
      opacity: opacityAnimation(),
      transform: [
        { translateX: translate.beginningTransformations.translateX },
        { translateY: translate.beginningTransformations.translateY },
        {
          scale: menuScaleAnimation(),
        },
        { translateX: translate.endingTransformations.translateX },
        { translateY: translate.endingTransformations.translateY },
      ],
    };
  });

  const animatedInnerContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:
        theme.value === 'light'
          ? IS_IOS
            ? menuBgColors?.light ?? 'rgba(255, 255, 255, .75)'
            : menuBgColors?.light ?? 'rgba(255, 255, 255, .95)'
          : IS_IOS
            ? menuBgColors?.dark ?? 'rgba(0,0,0,0.5)'
            : menuBgColors?.dark ?? 'rgba(39, 39, 39, .8)',
    };
  }, [theme]);

  const animatedProps = useAnimatedProps(() => {
    return { blurType: theme.value };
  }, [theme]);

  const setter = (items: (() => React.ReactElement)[]) => {

    setItemList(items);
    prevList.value = items;
  };

  useAnimatedReaction(
    () => menuProps.value.items,
    _items => {
      // if (!deepEqual(_items, prevList.value)) {
       
      // }
      runOnJS(setter)(_items);
    },
    [menuProps]
  );



  return (
    <Animated.View
      style={[styles.menuContainer, messageStyles]}
      >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.menuInnerContainer,
          animatedInnerContainerStyle,
          {
            backgroundColor: 'blue'
          }
        ]}>
        <Div h={menuProps.value.menuHeight} w={menuProps.value.menuWidth} bg="red">
          {menuProps.value.isGrid ? (
            // 网格布局
            <Div 
              flexDir="row" 
              flexWrap="wrap"
              justifyContent="flex-start"
            >
              {Array.isArray(itemList) && itemList.map((item, index) => (
                <Div 
                  key={index}
                  w={`${100 / menuProps.value.maxColumns!!}%`}
                >
                  {item()}
                </Div>
              ))}
            </Div>
          ) : (
            // 原有的列表布局
            Array.isArray(itemList) && itemList.map((item, index) => (
              <React.Fragment key={index}>
                {item()}
              </React.Fragment>
            ))
          )}
        </Div>
      </Animated.View>
    </Animated.View>
  );
};

const MenuList = React.memo(MenuListComponent);

export default MenuList;
