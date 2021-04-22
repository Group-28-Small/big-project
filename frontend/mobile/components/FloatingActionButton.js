import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AppTheme } from 'big-project-common';

export default FloatingActionButton = props => (
  <TouchableOpacity onPress={props.onPress} style={props.style} >
    <View
      style={{
        backgroundColor: AppTheme.primaryColor,
        width: 56,
        height: 56,
        borderRadius: 56,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    ><Text style={{ fontSize: 24, color: '#ffffff' }}>+</Text></View>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  shadow: {
    elevation: 5,
  }
})