import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Foundation } from '@expo/vector-icons';
import {color} from "nativewind/dist/tailwind/native/color";
import {colors} from "../utils/constants";

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.navigate('Home');
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingVertical: 12,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 8,
    },
    backButtonIcon: {
      fontSize: 34,
      color: colors.primaryColor,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    callButton: {
      marginLeft: 8,
    },
    callButtonIcon: {
      fontSize: 20,
      color: '#eba134',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back-outline" size={34} color={colors.primaryColor} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity style={styles.callButton}>
          <Foundation name="telephone" size={20} color="#eba134" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
