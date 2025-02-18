import { Div, } from "~/uiLib/responsiveMagnus";
import { IMenuItemProps } from "./types";
import { Pressable } from "react-native";
import React from "react";
import { useInternal } from "../../hooks";
import { CONTEXT_MENU_STATE } from "../../constants";

const MenuItem = (
    { children, isDisabled, onPress, style, ...props }: IMenuItemProps
) => {
    const { state } = useInternal();

    const onItemPress = (e: any) => {
        if (isDisabled) return;
        console.log('onItemPress [!!!!]');
        onPress?.(e);
        state.value = CONTEXT_MENU_STATE.END;
    }
    return (
        <Pressable
            onPress={onItemPress}
            disabled={isDisabled}
            {...props}
            style={[{
                width: '100%',
                height: '100%'
            }, style]}
        >
            {children}
        </Pressable>
    )
}

export default MenuItem;