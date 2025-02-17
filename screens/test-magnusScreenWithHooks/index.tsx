import { useNavigation } from "@react-navigation/native";

import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Div, ScrollDiv, Text } from "react-native-magnus";
import { StyleSheet, UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import { useState } from "react";
import { View } from "react-native";


export default function TestUnistyles3Screen() {

    const { theme } = useUnistyles();
    return <Div bg={theme.colors.mainColor} style={styles.container}>

        <Text style={styles.text}>Unistyles3 Test Screen</Text>
        <Button alignSelf="center" onPress={() => {
            UnistylesRuntime.setTheme(
                UnistylesRuntime.themeName === "blueTheme"
                  ? "pinkTheme"
                  : "blueTheme"
              )
        }}>
            <Text style={styles.text}>changeTheme</Text>
        </Button>

    </Div>;
}


const styles = StyleSheet.create((theme, rt) => ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: theme.colors.textColor,
    }
}))