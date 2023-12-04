import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import {colors} from "../utils/constants";
import InstagramLogin from "react-native-instagram-login";
import axios from 'axios';

const Socials = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const [username, setUsername] = useState('');
  const insRef = useRef();
  const [token, setToken] = useState(null);


    const callApi=()=>{
        const apiUrl = `https://graph.instagram.com/${token?.user_id}?fields=id,username,account_type&access_token=${token?.access_token}`; // Replace this with your API endpoint URL
        axios
            .get(apiUrl)
            .then(response => {
                // Handle successful response
                console.log('instagram api res:', response.data);
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
            
    }

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handleSubmit = (token) => {
    updateDoc(doc(db, 'users', user.uid), {
      instaUsertoken: token,
    })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.log('Error updating username:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Socials" />
      <View style={styles.contentContainer}>
        <View style={styles.headingContainer}>
          <Ionicons name="logo-instagram" size={32} color="black" style={styles.icon} />
          <Text style={styles.heading}>Instagram</Text>
        </View>
        {/*<TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor={'grey'}
          value={username}
          onChangeText={handleUsernameChange}
  />*/}
        <TouchableOpacity style={styles.button} onPress={() => insRef.current.show()}>
          <Text style={styles.buttonText}>Login now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={callApi}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <InstagramLogin
                    ref={insRef}
                    appId='236373202081307'
                    appSecret='ad1f7494965c3988eacb878d73b7ec12'
                    redirectUrl='https://www.google.com/'
                    scopes={['user_profile', 'user_media']}
                    onLoginSuccess={(token) => {
                        console.log("token",token)
                        setToken(token)
                        handleSubmit(token);
                    }}
                    onLoginFailure={(data) => console.log("data error",data)}
        />
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
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    marginRight: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.inputColor,
    borderRadius: 10,
    paddingVertical: 12,
    fontSize:18,
    paddingHorizontal: 16,
    marginBottom: 24,
    color: 'black',
  },
  button: {
    backgroundColor: colors.primaryColor,
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default Socials;
