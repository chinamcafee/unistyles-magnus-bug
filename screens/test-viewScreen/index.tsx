import { Button } from "react-native-magnus";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { View,Text } from "react-native";


export default function TestUnistyles3Screen() {

    return <View style={styles.container}>

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

    </View>;
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