import {ImageBackground, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from "react-native-linear-gradient";


const GradientWrapper = ({children}) => (
    <LinearGradient colors={['#8E4CD2', '#3b5998', '#8E4CD2']} style={styles.linearGradient}>
      {children}
    </LinearGradient>
);
export default GradientWrapper;
const styles = StyleSheet.create({
  linearGradient: {
      flex: 1,
  },
});
