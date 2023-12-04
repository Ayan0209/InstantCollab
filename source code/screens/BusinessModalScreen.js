import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert,
  StatusBar,
  PermissionsAndroid
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'react-native-image-picker';
import {colors} from "../utils/constants";
import AuthHeader from "../components/AuthHeader";
import storage from "@react-native-firebase/storage";
import {launchCamera} from "react-native-image-picker";
import {ImagePickerModal} from "./Component/ImagePickerModal";
import Loader from "./Loader";

const BusinessModalScreen = () => {
  const navigation = useNavigation();
  const [photoURL, setImage] = useState('');
  const [displayName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [transferred, setTransferred] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const businessData = docSnap.data();
          setImage(businessData.photoURL || '');
          setBrandName(businessData.displayName || '');
          setCategory(businessData.category || '');
          setCity(businessData.city || '');
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
      }
    };

    fetchBusinessData();
  }, []);

  const onCameraPress = React.useCallback(() => {
    requestCameraPermission();
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchCamera(options, setImage).then(r => console.log("r", r));
    setVisible(false)
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "App Camera Permission",
            message: "App needs access to your camera ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onImageLibraryPress = useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchImageLibrary(options, setImage);
    setVisible(false)
  }, []);

  const updateProfile = async () => {
    setIsLoading(true);
    const uri = photoURL?.assets[0]?.uri;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    setTransferred(0);
    const task = storage()
        .ref(filename)
        .putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task.then(() => {
        storage().ref(filename).getDownloadURL().then((url) => {
          console.log('Image URL:', url);
          handleUpdateProfile(url);
        }).catch((error) => {
          setIsLoading(false)
          console.log('Error getting image URL:', error);
        });
      }).catch((error) => {
        setIsLoading(false)
        console.log('Error uploading image:', error);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleChooseImage = () => {
    setVisible(!visible);
  };

  const handleUpdateProfile = (url) => {

    updateDoc(doc(db, 'users', user.uid), {
      photoURL:url,
      displayName,
      category,
      city,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        setIsLoading(false)
        navigation.navigate('Interests',{type:'business'})
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error updating business profile:', error);
      });
  };

  const uri = photoURL?.assets && photoURL.assets[0].uri;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white}/>
      <AuthHeader title="Profile Details" />
      <View style={styles.inputContainer}>
        <View style={styles.logoContainer}>
          {photoURL ? (
            <Image source={{ uri: uri }} style={styles.logoImage} />
          ) : (
            <Image source={require('../images/profileIcon.png')} style={styles.logoImage} />
          )}
          <TouchableOpacity style={styles.logoButton} onPress={handleChooseImage}>
            <Text style={styles.logoButtonText}>Choose Logo</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Brand Name"
          value={displayName}
          onChangeText={setBrandName}
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={()=>updateProfile()}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>


      <ImagePickerModal
          isVisible={visible}
          onClose={() => setVisible(false)}
          onImageLibraryPress={onImageLibraryPress}
          onCameraPress={onCameraPress}
      />
      <Loader loadingText={'Loading...'} isLoading={isLoading}/>
    </View>
  );
};

export default BusinessModalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.inputColor,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    color: '#000',
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  logoButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: colors.inputColor,
  },
  logoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    backgroundColor: colors.inputColor,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
