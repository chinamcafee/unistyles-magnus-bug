import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

// Utils
import {styles} from './styles';
import {
  CONTEXT_MENU_STATE,
  HOLD_ITEM_TRANSFORM_DURATION,
  IS_IOS,
  WINDOW_HEIGHT,
} from '../../constants';

import {useInternal} from '../../hooks';


type BackdropComponentProps = {
  blur?: boolean;
};

const BackdropComponent = ({blur}: BackdropComponentProps) => {
  const {state, theme} = useInternal();

  // 创建一个共享值来存储起始位置
  const startPosition = React.useRef({x: 0, y: 0});

  const tapGesture = Gesture.Tap()
    .onBegin((event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
      'worklet';
      // 保存起始位置
      startPosition.current = {x: event.x, y: event.y};
      console.log("startPosition.current is ===", startPosition.current)
    })
    .onFinalize((
      event: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
      success: boolean,
    ) => {
      'worklet';
      if (success) {
        state.value = CONTEXT_MENU_STATE.END;
        return;
      }

      // const distance = Math.hypot(
      //   event.x - startPosition.current.x,
      //   event.y - startPosition.current.y
      // );
      // const shouldClose = distance < 10;
      // const isStateActive = state.value === CONTEXT_MENU_STATE.ACTIVE;

      // if (shouldClose && isStateActive) {
      //   state.value = CONTEXT_MENU_STATE.END;
      // }
    });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const topValueAnimation = () =>
      state.value === CONTEXT_MENU_STATE.ACTIVE
        ? 0
        : withDelay(
            HOLD_ITEM_TRANSFORM_DURATION,
            withTiming(WINDOW_HEIGHT, {
              duration: 0,
            })
          );

    const opacityValueAnimation = () =>
      withTiming(state.value === CONTEXT_MENU_STATE.ACTIVE ? 1 : 0, {
        duration: HOLD_ITEM_TRANSFORM_DURATION,
      });

    return {
      top: topValueAnimation(),
      opacity: opacityValueAnimation(),
    };
  });

  // const animatedContainerProps = useAnimatedProps(() => {
  //   return {
  //     blurAmount: withTiming(
  //       state.value === CONTEXT_MENU_STATE.ACTIVE && blur ? 100 : 0,
  //       {
  //         duration: HOLD_ITEM_TRANSFORM_DURATION,
  //       }
  //     ),
  //   };
  // });

  const animatedInnerContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = "rgba(0,0,0,0.3)";

    return {backgroundColor};
  }, [theme]);

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[styles.container, animatedContainerStyle]}>
        <Animated.View
          style={[
            {...StyleSheet.absoluteFillObject},
            animatedInnerContainerStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const Backdrop = memo(BackdropComponent);

export default Backdrop;
