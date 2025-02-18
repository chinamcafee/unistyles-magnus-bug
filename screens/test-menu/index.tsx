import { Div, Text } from "react-native-magnus";
import HoldMenuButton from "./HoldMenuButton";
import HoldMenuButton2 from "./HoldMenuButton2";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";

export default function TestHoldMenuScreen() {
    const navigation = useNavigation();
    return <Div flex={1} justifyContent="flex-start" alignItems="center" mt={50}>

        <HoldMenuButton2 />
        {/* <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Go to Playground" onPress={() => navigation.navigate('Playground')} />
        <Button title="Go to Whatsapp" onPress={() => navigation.navigate('Whatsapp')} />
        <Button title="Go to Telegram" onPress={() => navigation.navigate('Telegram')} />
        <Button title="Go to Clubhouse" onPress={() => navigation.navigate('Clubhouse')} /> */}

        <Div position="absolute" bottom={10} w={400} h={100}>
            <HoldMenuButton />
        </Div>
    </Div>;
}