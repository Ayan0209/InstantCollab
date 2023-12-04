import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {colors} from "../utils/constants";

const MatchedScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const { params } = useRoute();

  const { loggedInProfile, userSwiped } = params;
  const userType = loggedInProfile.type;

  const handleStartChatting = () => {
    // Logic for navigating to the ChatScreen
    navigation.goBack();
    navigation.navigate("Chat");
  };

  const getTitleText = () => {
    if (userType === 'influencer') {
      return 'Congratulations! You matched with a brand';
    } else if (userType === 'brand') {
      return 'Congratulations! You matched with an Influencer';
    }
    return '';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 16,
      textAlign: 'center', // Center the text
      marginLeft: 16, // Add left margin
      marginRight: 16, // Add right margin
    },
    profilePicture: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 16,
    },
    fullName: {
      fontSize: 18,
      color: '#fff',
    },
    button: {
      backgroundColor: '#fff',
      borderRadius: 4,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginTop: 32,
    },
    buttonText: {
      color: colors.primaryColor,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getTitleText()}</Text>
      <Image source={{ uri: userSwiped.photoURL }} style={styles.profilePicture} />
      <Text style={styles.fullName}>{userSwiped.fullName}</Text>
      <TouchableOpacity style={styles.button} onPress={handleStartChatting}>
        <Text style={styles.buttonText}>Start Chatting</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchedScreen;
