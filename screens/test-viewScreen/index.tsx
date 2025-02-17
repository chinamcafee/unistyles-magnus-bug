import { Button,Text } from "react-native-magnus";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { View } from "react-native";


export default function TestUnistyles3Screen() {


    const theme = UnistylesRuntime.getTheme("blueTheme");

    return <View style={styles.container}>

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

    </View>;
}


const styles = StyleSheet.create((theme, rt) => ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.mainColor,
    }
}))