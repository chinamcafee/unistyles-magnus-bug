import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HoldItem, MenuItem } from '~/component/holdMenu';
import { Div, Text } from 'react-native-magnus';

const HoldMenuButton = () => {
  return (
    <View>
      <HoldItem
        closeOnTap
        activateOn="hold"
        hapticFeedback="Selection"
        // bottom
        items={[

          () => {
            return (

              <Div h={80} w={120} bg="yellow">
                <MenuItem key={1} onPress={() => console.log('onPress Outer')} style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text>MenuItem</Text>
                </MenuItem>
              </Div>


            )
          },
          () => <Div h={150} w={120} bg="pink" />,
          () => <Div style={{ height: 40, width: 120 }} bg="green" />


        ]}
      >
        <View
          // activeOpacity={0.8}
          // onPress={onPress}
          style={styles.holdMenuButton}
        >
          {/* <Icon name="dots-horizontal" size={24} color="white" /> */}
          <Text>Long Press This Button</Text>
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
