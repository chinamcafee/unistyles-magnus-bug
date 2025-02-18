import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "react-native-magnus";
import TestEntryScreen from "~/screens/test-entryScreen";
import TestMagnusScreen from "~/screens/test-magnusScreen";
import { createContext, useMemo } from "react";
import { useCallback } from "react";
import { useState } from "react";
import TestViewScreen from "~/screens/test-viewScreen";
import TestMagnusScreenWithHooks from "~/screens/test-magnusScreenWithHooks";
import TestMagnusScreenWithUnistyles from "~/screens/test-magnusScreenWithUni";
import TestHoldMenuScreen from "./screens/test-menu";
const Stack = createNativeStackNavigator();

export interface IAppContext {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}
  
export const AppContext = createContext<IAppContext | null>(null);

export const AppNavigator = () => {
    const [state, setState] = useState<IAppContext>({
        theme: "light",
        toggleTheme: () => { },
    });

    const toggleTheme = useCallback(() => {
        setState({ ...state, theme: state.theme === "light" ? "dark" : "light" });
    }, [state]);

    const appContextVariables = useMemo(
        () => ({
            ...state,
            toggleTheme,
        }),
        [state, toggleTheme]
    );

    return (
        <AppContext.Provider value={appContextVariables}>
            <ThemeProvider>
                <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName="TestEntryScreen"
                >
                    <Stack.Group>
                        <Stack.Screen name="TestEntryScreen" component={TestEntryScreen} />
                        <Stack.Screen name="TestHoldMenuScreen" component={TestHoldMenuScreen} />
                    </Stack.Group>
                    </Stack.Navigator>
                </NavigationContainer>
            </ThemeProvider>
        </AppContext.Provider>
    );
};