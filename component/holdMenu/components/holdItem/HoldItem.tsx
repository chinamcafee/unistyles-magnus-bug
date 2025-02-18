import React, {memo, useMemo} from 'react';
//#region reanimated & gesture handler
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSequence,
  withSpring,
  useAnimatedReaction,
} from 'react-native-reanimated';
//#endregion
import type {ViewProps} from 'react-native';

//#region dependencies
// import {Portal} from '@gorhom/portal';
import {nanoid} from 'nanoid/non-secure';
import {trigger} from 'react-native-haptic-feedback';
import { Portal } from 'react-native-magnus';
//#endregion

//#region utils & types
import {
  TransformOriginAnchorPosition,
  getTransformOrigin,
  calculateMenuHeight,
} from '../../utils/calculations';
import {
  HOLD_ITEM_TRANSFORM_DURATION,
  HOLD_ITEM_SCALE_DOWN_DURATION,
  HOLD_ITEM_SCALE_DOWN_VALUE,
  SPRING_CONFIGURATION,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  CONTEXT_MENU_STATE,
} from '../../constants';
import {useDeviceOrientation} from '../../hooks';
import styles from './styles';

import styleGuide from '../../styleGuide';
import {useInternal} from '../../hooks';
import type {HoldItemProps, GestureHandlerProps} from './types';
//#endregion

/**
 * HoldItem 组件的主要功能是实现长按/点击菜单功能
 * 当用户长按或点击时，会显示一个上下文菜单
 */

/**
 * Context 类型定义
 * didMeasureLayout: 用于跟踪是否已经测量了组件布局
 */
type Context = {didMeasureLayout: boolean};

const HoldItemComponent = ({
  items,                    // 菜单项数组
  bottom,                   // 是否从底部显示菜单
  containerStyles,          // 容器样式
  disableMove,             // 是否禁用移动动画
  menuAnchorPosition,      // 菜单锚点位置
  activateOn,              // 激活方式：'hold'|'tap'|'double-tap'
  hapticFeedback,          // 触觉反馈类型
  actionParams,            // 动作参数
  closeOnTap,              // 点击时是否关闭
  longPressMinDurationMs = 150,  // 长按最小持续时间
  children,                // 子组件
  isGrid = false,
  maxColumns = 4,
}: HoldItemProps) => {
  //#region hooks & variables
  // 内部状态管理 hook
  const {state, menuProps, safeAreaInsets} = useInternal();
  // 设备方向 hook
  const deviceOrientation = useDeviceOrientation();

  // 共享值定义
  const isActive = useSharedValue(false);           // 菜单是否激活
  const isAnimationStarted = useSharedValue(false); // 动画是否开始
  
  // 项目位置和尺寸的共享值
  const itemRectY = useSharedValue<number>(0);      // HoldItem包裹的组件的 Y 坐标
  const itemRectX = useSharedValue<number>(0);      // HoldItem包裹的组件的 X 坐标
  const itemRectWidth = useSharedValue<number>(0);  // HoldItem包裹的组件的宽度
  const itemRectHeight = useSharedValue<number>(0); // HoldItem包裹的组件的高度
  const itemScale = useSharedValue<number>(1);      // 缩放值
  const transformValue = useSharedValue<number>(0);  // 变换值

  // 菜单锚点位置
  const transformOrigin = useSharedValue<TransformOriginAnchorPosition>(
    menuAnchorPosition || 'top-right'
  );

  // 为每个实例创建一个唯一的 menuId
  const menuId = useMemo(() => nanoid(), []);

  // 计算菜单高度
  const calculateTotalMenuHeight = useMemo(() => {
    // 默认每个项的高度
    const defaultItemHeight = 44;

    // 如果不是网格布局，使用原来的计算逻辑
    if (!isGrid) {
      return items.reduce((total, item) => {
        const itemHeight = item().props.height || 
                          item().props.h || 
                          (item().props.style && item().props.style.height) || 
                          defaultItemHeight;
        return total + itemHeight;
      }, 0);
    }

    // 网格布局的高度计算
    const totalItems = items.length;
    const rows = Math.ceil(totalItems / maxColumns);
    
    // 计算每一行的高度
    let totalHeight = 0;
    for (let row = 0; row < rows; row++) {
      // 获取当前行的所有项
      const startIndex = row * maxColumns;
      const endIndex = Math.min(startIndex + maxColumns, totalItems);
      
      // 找出当前行中最高的项
      let maxRowHeight = 0;
      for (let i = startIndex; i < endIndex; i++) {
        const item = items[i];
        console.log("item props is ===", item().props)
        const itemHeight = item().props.height || 
                          item().props.h || 
                          (item().props.style && item().props.style.height) || 
                          defaultItemHeight;

        maxRowHeight = Math.max(maxRowHeight, itemHeight);
      }
      
      totalHeight += maxRowHeight;
    }
    console.log("[ FINISHED ]totalHeight is ===", totalHeight)
    return totalHeight;
  }, [items, isGrid, maxColumns]);

  // 计算菜单宽度
  const calculateTotalMenuWidth = useMemo(() => {
    // 默认每个项的宽度
    const defaultItemWidth = 120;

    // 如果不是网格布局，使用原来的计算逻辑
    if (!isGrid) {
      return items.reduce((maxWidth, item) => {
        const itemWidth = item().props.width || 
                         item().props.w || 
                         (item().props.style && item().props.style.width) || 
                         defaultItemWidth;
        return Math.max(maxWidth, itemWidth);
      }, 0);
    }

    // 网格布局的宽度计算
    const totalItems = items.length;
    const rows = Math.ceil(totalItems / maxColumns);
    
    // 计算每一行的总宽度，并找出最大值
    let maxRowWidth = 0;
    for (let row = 0; row < rows; row++) {
      // 获取当前行的起始和结束索引
      const startIndex = row * maxColumns;
      const endIndex = Math.min(startIndex + maxColumns, totalItems);
      const itemsInCurrentRow = endIndex - startIndex;
      
      // 计算当前行的总宽度
      let rowWidth = 0;
      for (let i = startIndex; i < endIndex; i++) {
        const item = items[i];
        const itemWidth = item().props.width || 
                         item().props.w || 
                         (item().props.style && item().props.style.width) || 
                         defaultItemWidth;
        rowWidth += itemWidth;
      }

      // 如果是最后一行且项目数不足maxColumns
      // 则按比例计算实际占用的宽度
      if (itemsInCurrentRow < maxColumns) {
        rowWidth = (rowWidth / itemsInCurrentRow) * maxColumns;
      }

      maxRowWidth = Math.max(maxRowWidth, rowWidth);
    }

    return maxRowWidth;
  }, [items, isGrid, maxColumns]);

  // 判断是否为长按模式
  const isHold = !activateOn || activateOn === 'hold';
  //#endregion

  //#region refs
  // 动画容器引用
  const containerRef = useAnimatedRef<Animated.View>();
  //#endregion

  /**
   * 触觉反馈函数
   * 根据不同的反馈类型触发不同的震动效果
   */
  const hapticResponse = () => {
    const style = !hapticFeedback ? 'Medium' : hapticFeedback;
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    switch (style) {
      case `Selection`:
        trigger('selection', options);
        break;
      case `Light`:
      case `Medium`:
      case `Heavy`:
        trigger(`impact${style}`, options);
        break;
      case `Success`:
      case `Warning`:
      case `Error`:
        trigger(`notification${style}`, options);
        break;
      default:
    }
  };

  /**
   * 工作线程函数
   */
  
  /**
   * 激活动画
   * 测量组件位置和尺寸，并设置相关共享值
   */
  const activateAnimation = (ctx: any) => {
    'worklet';
    if (!ctx.didMeasureLayout) {
      const measured = measure(containerRef)!;
      
      // 设置组件位置和尺寸
      itemRectY.value = measured.pageY;
      itemRectX.value = measured.pageX;
      itemRectHeight.value = measured.height;
      itemRectWidth.value = measured.width;

      // 如果没有指定锚点位置，则自动计算
      if (!menuAnchorPosition) {
        const position = getTransformOrigin(
          measured.pageX,
          itemRectWidth.value,
          deviceOrientation === 'portrait' ? WINDOW_WIDTH : WINDOW_HEIGHT,
          bottom
        );
        transformOrigin.value = position;
      }
    }
  };

  /**
   * 计算变换值
   * 确保菜单在屏幕范围内显示
   */
  const calculateTransformValue = () => {
    // 标记这是一个工作线程函数，可以在 Reanimated 的工作线程中执行
    'worklet';

    // 根据设备方向获取屏幕高度
    // 如果是竖屏，使用 WINDOW_HEIGHT，如果是横屏，使用 WINDOW_WIDTH
    const height =
      deviceOrientation === 'portrait' ? WINDOW_HEIGHT : WINDOW_WIDTH;

    // 检查菜单的锚点是否在顶部
    // transformOrigin.value 可能的值如: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    const isAnchorPointTop = transformOrigin.value.includes('top');

    // 初始化垂直方向的位移值
    let tY = 0;
    
    // 如果允许移动（disableMove 为 false）
    if (!disableMove) {
      if (isAnchorPointTop) {
        // 计算菜单从顶部展开时的总高度：
        // itemRectY.value：当前项的 Y 坐标
        // itemRectHeight.value：当前项的高度
        // menuHeight：菜单的高度
        // styleGuide.spacing：间距
        // safeAreaInsets?.bottom：底部安全区域的高度（如果有）
        const topTransform =
          itemRectY.value +
          itemRectHeight.value +
          calculateTotalMenuHeight +
          styleGuide.spacing +
          (safeAreaInsets?.bottom || 0);

        // 如果总高度超出屏幕，计算需要向上移动的距离
        // 否则不需要移动（tY = 0）
        tY = topTransform > height ? height - topTransform : 0;
      } else {
        // 如果锚点在底部，计算菜单从底部展开时的位置：
        // itemRectY.value：当前项的 Y 坐标
        // menuHeight：菜单的高度
        // safeAreaInsets?.top：顶部安全区域的高度（如果有）
        const bottomTransform =
          itemRectY.value - calculateTotalMenuHeight - (safeAreaInsets?.top || 0);
        
        // 如果菜单位置小于0（超出屏幕顶部）
        // 则向下移动 bottomTransform 的距离，并额外添加两倍的间距
        // 否则不需要移动（tY = 0）
        tY =
          bottomTransform < 0 ? -bottomTransform + styleGuide.spacing * 2 : 0;
      }
    }
    
    // 返回最终的垂直位移值
    return tY;
  };

  /**
   * 设置菜单属性
   * 更新菜单的位置、尺寸和其他相关属性
   */
  const setMenuProps = () => {
    'worklet';
    menuProps.value = {
      itemHeight: itemRectHeight.value,
      itemWidth: itemRectWidth.value,
      itemY: itemRectY.value,
      itemX: itemRectX.value,
      anchorPosition: transformOrigin.value,
      menuHeight: calculateTotalMenuHeight,
      menuWidth: calculateTotalMenuWidth,
      isGrid: isGrid,
      items,
      transformValue: transformValue.value,
      actionParams: actionParams || {},
      maxColumns: maxColumns,
    };
  };

  /**
   * 动画效果相关函数
   */
  const scaleBack = () => {
    'worklet';
    // 缩放回原始大小
    itemScale.value = withTiming(1, {
      duration: HOLD_ITEM_TRANSFORM_DURATION / 2,
    });
  };

  const onCompletion = (isFinised?: boolean) => {
    'worklet';
    const isListValid = items && items.length > 0;
    if (isFinised && isListValid) {
      state.value = CONTEXT_MENU_STATE.ACTIVE;
      isActive.value = true;
      scaleBack();
      if (hapticFeedback !== 'None') {
        runOnJS(hapticResponse)();
      }
    }
    isAnimationStarted.value = false;

    // TODO: Warn user if item list is empty or not given
  };

  const scaleHold = () => {
    'worklet';
    itemScale.value = withTiming(
      HOLD_ITEM_SCALE_DOWN_VALUE,
      {duration: HOLD_ITEM_SCALE_DOWN_DURATION},
      onCompletion
    );
  };

  const scaleTap = () => {
    'worklet';
    isAnimationStarted.value = true;

    itemScale.value = withSequence(
      withTiming(HOLD_ITEM_SCALE_DOWN_VALUE, {
        duration: HOLD_ITEM_SCALE_DOWN_DURATION,
      }),
      withTiming(
        1,
        {
          duration: HOLD_ITEM_TRANSFORM_DURATION / 2,
        },
        onCompletion
      )
    );
  };

  /**
   * When use tap activation ("tap") and trying to tap multiple times,
   * scale animation is called again despite it is started. This causes a bug.
   * To prevent this, it is better to check is animation already started.
   */
  const canCallActivateFunctions = () => {
    'worklet';
    const willActivateWithTap =
      activateOn === 'double-tap' || activateOn === 'tap';

    return (
      (willActivateWithTap && !isAnimationStarted.value) || !willActivateWithTap
    );
  };

  /**
   * 手势处理相关函数
   */
  const handleGesture = (context: Context) => {
    'worklet';
    if (canCallActivateFunctions()) {
      // 每次手势开始时，都重新测量并设置菜单属性
      activateAnimation(context);
      transformValue.value = calculateTransformValue();
      
      setMenuProps();
      // 确保当前实例的菜单属性被正确设置
      // if (!context.didMeasureLayout) {
       
      //   context.didMeasureLayout = true;
      // }

      if (!isActive.value) {
        if (isHold) {
          scaleHold();
        } else {
          scaleTap();
        }
      }
    }
  };

  const handleFinish = (context: Context) => {
    'worklet';
    // 只重置 context 标记，不重置测量值
    context.didMeasureLayout = false;
    
    if (isHold) {
      scaleBack();
    }
  };

  const gestures = useMemo(() => {
    const context: Context = {didMeasureLayout: false};

    switch (activateOn) {
      case 'double-tap':
        return Gesture.Tap()
          .numberOfTaps(2)
          .onStart(() => {
            handleGesture(context);
          })
          .onFinalize(() => {
            handleFinish(context);
          });
      case 'tap':
        return Gesture.Tap()
          .numberOfTaps(1)
          .onStart(() => {
            handleGesture(context);
          })
          .onFinalize(() => {
            handleFinish(context);
          });
      default:
        return Gesture.LongPress()
          .minDuration(longPressMinDurationMs)
          .onStart(() => {
            handleGesture(context);
          })
          .onFinalize(() => {
            handleFinish(context);
          });
    }
  }, [activateOn, longPressMinDurationMs]);

  const overlayGesture = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(1)
        .onStart(() => {
          if (closeOnTap) state.value = CONTEXT_MENU_STATE.END;
        }),
    [closeOnTap, state]
  );
  //#endregion

  //#region animated styles & props
  const animatedContainerStyle = useAnimatedStyle(() => {
    const animateOpacity = () =>
      withDelay(HOLD_ITEM_TRANSFORM_DURATION, withTiming(1, {duration: 0}));

    return {
      opacity: isActive.value ? 0 : animateOpacity(),
      transform: [
        {
          scale: isActive.value
            ? withTiming(1, {duration: HOLD_ITEM_TRANSFORM_DURATION})
            : itemScale.value,
        },
      ],
    };
  });
  const containerStyle = React.useMemo(
    () => [containerStyles, animatedContainerStyle],
    [containerStyles, animatedContainerStyle]
  );

  const animatedPortalStyle = useAnimatedStyle(() => {
    const animateOpacity = () =>
      withDelay(HOLD_ITEM_TRANSFORM_DURATION, withTiming(0, {duration: 0}));

    let tY = calculateTransformValue();
    const transformAnimation = () =>
      disableMove
        ? 0
        : isActive.value
        ? withSpring(tY, SPRING_CONFIGURATION)
        : withTiming(-0.1, {duration: HOLD_ITEM_TRANSFORM_DURATION});

    return {
      zIndex: 10,
      position: 'absolute',
      top: itemRectY.value,
      left: itemRectX.value,
      width: itemRectWidth.value,
      height: itemRectHeight.value,
      opacity: isActive.value ? 1 : animateOpacity(),
      transform: [
        {
          translateY: transformAnimation(),
        },
        {
          scale: isActive.value
            ? withTiming(1, {duration: HOLD_ITEM_TRANSFORM_DURATION})
            : itemScale.value,
        },
      ],
    };
  });
  const portalContainerStyle = useMemo(
    () => [styles.holdItem, animatedPortalStyle],
    [animatedPortalStyle]
  );

  const animatedPortalProps = useAnimatedProps<ViewProps>(() => ({
    pointerEvents: isActive.value ? 'auto' : 'none',
  }));
  //#endregion

  /**
   * 监听状态变化
   */
  useAnimatedReaction(
    () => state.value,
    _state => {
      if (_state === CONTEXT_MENU_STATE.END) {
        isActive.value = false;
      }
    }
  );

  //#region components
  const GestureHandler = useMemo(() => {
    // console.log("activateOn is ===", activateOn)
    switch (activateOn) {
      case `double-tap`:
        return ({children: handlerChildren}: GestureHandlerProps) => (
          <GestureDetector gesture={gestures}>
            {handlerChildren}
          </GestureDetector>
        );
      case `tap`:
        return ({children: handlerChildren}: GestureHandlerProps) => (
          <GestureDetector gesture={gestures}>
            {handlerChildren}
          </GestureDetector>
        );
      // default is hold
      default:
        return ({children: handlerChildren}: GestureHandlerProps) => (
          <GestureDetector gesture={gestures}>
            {handlerChildren}
          </GestureDetector>
        );
    }
  }, [activateOn, gestures]);

  const PortalOverlay = useMemo(() => {
    return () => (
      <GestureDetector gesture={overlayGesture}>
        <Animated.View style={[styles.portalOverlay]} />
      </GestureDetector>
    );
  }, [overlayGesture]);
  //#endregion

  //#region render
  return (
    <>
      <GestureHandler>
        <Animated.View ref={containerRef} style={containerStyle}>
          {children}
        </Animated.View>
      </GestureHandler>

      {/* <Portal key={menuId} name={menuId}> */}
      <Portal>
        <Animated.View
          key={menuId}
          style={portalContainerStyle}
          animatedProps={animatedPortalProps}>
          {/* <PortalOverlay /> */}
          {children}
        </Animated.View>
      </Portal>
    </>
  );
  //#endregion
};

const HoldItem = memo(HoldItemComponent);

export default HoldItem;
