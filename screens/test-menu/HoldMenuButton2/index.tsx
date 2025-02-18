import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HoldItem, MenuItem } from '~/component/holdMenu';
import { Div, Text } from 'react-native-magnus';

const HoldMenuButton = () => {
  return (
    <View>
      <HoldItem
        closeOnTap
        activateOn="tap"
        hapticFeedback="Selection"
        // menuAnchorPosition="bottom-left"
        // bottom
        isGrid={true}
        maxColumns={4}
        items={[
          () => <Div h={40} w={50} bg="yellow">
            <MenuItem key={1} onPress={() => console.log('onPress Outer')} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text>①</Text>
            </MenuItem>
          </Div>,
          () => <Div h={40} w={50} bg="pink" />,
          () => <Div style={{ height: 40, width: 50 }} bg="green" />,
          () => <Div h={40} w={50} bg="blue" />,
          () => <Div h={40} w={50} bg="purple" />,
        ]}
      >
        <View
          // activeOpacity={0.8}
          // onPress={onPress}
          style={styles.holdMenuButton}
        >
          {/* <Icon name="dots-horizontal" size={24} color="white" /> */}
          <Text>Tap This Button</Text>
        </View>
      </HoldItem>
    </View>
  );
};

export default HoldMenuButton;

const styles = StyleSheet.create({
  holdMenuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#DEDEDE',
    padding: 13,
    marginTop: 16,
  },
});
