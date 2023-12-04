import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const InfluencerProfile = () => {
  const navigation = useNavigation();

  const handleGeneralPress = () => {
    navigation.navigate('Modal');
  };

  const handleInterestsPress = () => {
    navigation.navigate('Interests');
  };

  const handleSocialsPress = () => {
    navigation.navigate('Socials');
  };

  return (
    <View style={styles.container}>
      <Header title="Influencer Profile" />
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleGeneralPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>General</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleInterestsPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Interests</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSocialsPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Socials</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  buttonContainer: {
    marginBottom: 8,
  },
  button: {
    borderWidth: 2,
    borderColor: 'rgba(227, 151, 39, 0.7)',
    borderRadius: 10,
    padding: 12,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'rgba(227, 151, 39, 0.7)',
  },
});

export default InfluencerProfile;
