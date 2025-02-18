import "~/theme/unistyles";
import { AppNavigator } from "~/AppNavigator";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HoldMenuProvider } from "./component/holdMenu";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HoldMenuProvider
          safeAreaInsets={{ top: 50, right: 50, left: 50, bottom: 100 }}
          theme="light"
          backdropBlur={false}>
          <AppNavigator />
        </HoldMenuProvider>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
