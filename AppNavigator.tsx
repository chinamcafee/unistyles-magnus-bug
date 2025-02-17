import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "react-native-magnus";
import TestEntryScreen from "~/screens/test-entryScreen";
import TestMagnusScreen from "~/screens/test-magnusScreen";
import TestViewScreen from "~/screens/test-viewScreen";


const Stack = createNativeStackNavigator();

export const AppNavigator = () => {


    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName="TestEntryScreen"
                >
                    <Stack.Group>
                        <Stack.Screen name="TestEntryScreen" component={TestEntryScreen} />
                        <Stack.Screen name="TestMagnusScreen" component={TestMagnusScreen} />
                        <Stack.Screen name="TestViewScreen" component={TestViewScreen} />
                    </Stack.Group>
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
};