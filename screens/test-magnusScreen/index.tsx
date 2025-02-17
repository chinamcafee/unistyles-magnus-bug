import { useNavigation } from "@react-navigation/native";

import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Div, ScrollDiv, Text } from "react-native-magnus";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { useState } from "react";
import { View } from "react-native";


export default function TestUnistyles3Screen() {


    const insets = useSafeAreaInsets();

    const theme = UnistylesRuntime.getTheme("blueTheme");

    return <Div style={styles.container}>

        <Text style={{color: theme.colors.textColor}}>Unistyles3 Test Screen</Text>
        <Button alignSelf="center" onPress={() => {
            UnistylesRuntime.setTheme(
                UnistylesRuntime.themeName === "blueTheme"
                  ? "pinkTheme"
                  : "blueTheme"
              )
        }}>
            <Text style={{color: theme.colors.textColor}}>changeTheme</Text>
        </Button>

    </Div>;
}


const styles = StyleSheet.create((theme, rt) => ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.mainColor,
    }
}))