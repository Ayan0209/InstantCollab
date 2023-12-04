import React, {useEffect, useState} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import Loader from "./Loader";

const BrandProfile = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneralPress = () => {
    navigation.navigate('BrandModal');
  };
  const handleProductPress = () => {
    navigation.navigate('ProductList');
  };

  return (
    <View style={styles.container}>
      <Header title="Brand Profile" />
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleGeneralPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>General</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleProductPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Product</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Loader  isLoading={isLoading} loadingText={'Loading...'} />
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

export default BrandProfile;
