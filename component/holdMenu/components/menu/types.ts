import { JSX } from 'react';
import type {TransformOriginAnchorPosition} from '../../utils/calculations';
import type {PressableProps, StyleProp, TextStyle, ViewStyle} from 'react-native';
export type MenuItemProps = {
  text: string;
  component: () => JSX.Element;
};

export type MenuListProps = {
  items: (()=>JSX.Element)[];
};

export type MenuInternalProps = {
  items: (()=>JSX.Element)[];
  itemHeight: number;
  itemWidth: number;
  itemY: number;
  itemX: number;
  anchorPosition: TransformOriginAnchorPosition;
  menuHeight: number;
  menuWidth: number;
  isGrid?: boolean;
  maxColumns?: number;
  transformValue: number;
  actionParams: {
    [name: string]: (string | number)[];
  };
};

export interface IMenuItemProps extends PressableProps {
  /**
   * Children of Menu Item.
   */
  children: JSX.Element | Array<JSX.Element>;
  /**
   * Whether menu item is disabled.
   */
  isDisabled?: boolean;

  style?: StyleProp<ViewStyle>;
}
