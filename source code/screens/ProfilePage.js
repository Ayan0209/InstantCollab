import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import InstagramLogin from 'react-native-instagram-login';
import {colors} from "../utils/constants";
import CardInfluencer from "./CardInfluencer";
import CardBrand from "./CardBrand";
import { getAuth } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, db } from '../firebase'

const ProfilePage = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;
  const [myUser, setUser] = useState(null);
  //console.log("This is profile user: ", user);
  const userName = user?.instaUserName && user?.instaUserName ;
  const [profileData, setProfileData] = useState(null);
  
  const insRef = useRef();
  const [token, setToken] = useState(null);

  useEffect(() => {
      checkProfileCompletion(userId);
  }, [])

  const checkProfileCompletion = (userId) => {
    console.log("user-----&&&&&&&-------id", userId);
    // Query the Firestore to get the user's profile document
    onSnapshot(doc(db, "users", userId), (snapshot) => {
        // console.log("Snapshot:", snapshot)
        if (snapshot.data().profileComplete) {
            console.log("render screen profile complete", snapshot.data())
            setUser(snapshot.data());
        }
    })
    
    console.log("Myuser, ", myUser);
};

  const onClear = () => {

  };

  const openInstagramProfile = async () => {
    const profileUrl = `https://www.instagram.com/${userName}/`;

    const isInstagramInstalled = await Linking.canOpenURL('instagram://');

    if (isInstagramInstalled) {
      await Linking.openURL(`instagram://user?username=${userName}`);
    } else {
      await Linking.openURL(profileUrl);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Profiles Page" />
      <View style={styles.imageContainer}>
        <Image source={{ uri: myUser?.photoURL }} style={styles.image} />
      </View>
      <ScrollView style={styles.panel}>
        {myUser?.type === 'influencer' ? (
         <CardInfluencer user={myUser}/>
        ) : (
         <CardBrand user={myUser}/>
        )}

        </ScrollView>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: '30%',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    zIndex: 1,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  age: {
    fontSize: 18,
    marginRight: 8,
  },
  gender: {
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
  },
  interestsContainer: {
    marginTop: 24,
  },
  interestsHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  category: {
    backgroundColor: colors.primaryColor,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: 'white',
  },
  location: {
    fontSize: 16,
  },
  email: {
    fontSize: 16,
    marginBottom: 16,
  },
});
