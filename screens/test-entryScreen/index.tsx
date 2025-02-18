import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Div, ScrollDiv, Text } from "react-native-magnus";

type RootStackParamList = {
    TestMagnusScreen: undefined;
    TestViewScreen: undefined;
    TestMagnusScreenWithHooks: undefined;
    TestMagnusScreenWithUnistyles: undefined;
    TestHoldMenuScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TestEntryScreen() {
    const navigation = useNavigation<NavigationProp>();

    const insets = useSafeAreaInsets();
    return <Div flex={1} justifyContent="center" alignItems="center" pt={insets.top}>

        <Div flex={1} justifyContent="flex-start" alignItems="center" mt={10}>
            <Text fontSize={20} fontWeight="bold">【Menu Broken Test】</Text>
            <ScrollDiv flex={1} w={"100%"}>

                <Button
                    onPress={() => {
                        navigation.navigate("TestHoldMenuScreen");
                    }}
                    mt={5}
                >
                    Menu Test
                </Button>
                {/* <Button
                    onPress={() => {
                        navigation.navigate("TestMagnusScreen");
                    }}
                >
                    Magnus Div Test
                </Button>

                <Button
                    onPress={() => {
                        navigation.navigate("TestMagnusScreenWithHooks");
                    }}
                    mt={5}
                >
                    Magnus Div Test with Hooks
                </Button>

                <Button
                    onPress={() => {
                        navigation.navigate("TestMagnusScreenWithUnistyles");
                    }}
                    mt={5}
                >
                    TestMagnusScreenWithUnistyles Test
                </Button>

                <Button
                    onPress={() => {
                        navigation.navigate("TestViewScreen");
                    }}
                    mt={5}
                >
                    View Component Test
                </Button> */}

            </ScrollDiv>
        </Div>

    </Div>;
}
