import { useNavigation } from "@react-navigation/native";

import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Div, ScrollDiv, Text } from "react-native-magnus";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { useState } from "react";
import { View } from "react-native";
import ScreenComponet from "./Screen";
import { withUnistyles } from 'react-native-unistyles'

const ScreenComponetWithUnistyles = withUnistyles(ScreenComponet, (theme,rt)=> ({
    theme: theme
}));

export default function TestUnistyles3Screen() {

    return <ScreenComponetWithUnistyles />
}


const styles = StyleSheet.create((theme, rt) => ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.mainColor,
    },
    text: {
        color: theme.colors.textColor,
    }
}))