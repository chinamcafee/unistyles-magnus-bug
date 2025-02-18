import { JSX } from 'react';
import type {MenuItemProps} from '../components/menu/types';

function fieldAreSame(obj1: MenuItemProps, obj2: MenuItemProps) {
  'worklet';

  const keys = Object.keys(obj1);

  return keys.every(key => {
    // @ts-ignore
    const val1 = obj1[key];
    // @ts-ignore
    const val2 = obj2[key];

    if (val1 !== val2) {
      if (typeof val1 === 'function' && typeof val2 === 'function')
        return val1.toString() === val2.toString();
      return false;
    }

    return true;
  });
}

function deepEqual(array1: (()=>JSX.Element)[], array2: (()=>JSX.Element)[]) {
  'worklet';

  // 检查是否都是数组
  const areArrays = Array.isArray(array1) && Array.isArray(array2);
  if (!areArrays) return false;

  // 检查长度是否相同
  if (!array2 || array1.length !== array2.length) return false;

  // 遍历比较每个元素
  for (let i = 0; i < array1.length; i++) {
    const obj1 = array1[i];
    const obj2 = array2[i];

    // 比较每个对象的字段
    if (obj1 !== obj2) {
      return false;
    }
  }

  return true;
}

export {deepEqual};
