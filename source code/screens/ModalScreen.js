import React, {useCallback, useEffect, useState} from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    PermissionsAndroid,
    Platform,
    ScrollView, StatusBar,
    StyleSheet, Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';
import {launchCamera} from 'react-native-image-picker';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {doc, getDoc, serverTimestamp, updateDoc} from 'firebase/firestore';
import {db} from '../firebase';
import {getAuth} from 'firebase/auth';
import storage from '@react-native-firebase/storage';
import {ImagePickerModal} from "./Component/ImagePickerModal";
import {colors} from "../utils/constants";
import CustomButton from "./Component/CustomButton";
import Loader from "./Loader";
import AuthHeader from "../components/AuthHeader";

const ModalScreen = () => {
    const navigation = useNavigation();
    const [photoURL, setImage] = useState('')
    const [displayName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const [pickerResponse, setPickerResponse] = useState(null);
    const [visible, setVisible] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;
    const route = useRoute();
   // const type = route?.params.type;
   // console.log('user type', type)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setImage(userData.photoURL)
                    setFullName(userData.displayName || '');
                    setAge(userData.age || '');
                    setGender(userData.gender || '');
                    setEmail(userData.email || '');
                    setCity(userData.city || '');
                    setBio(userData.bio || '');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChooseImage = () => {
        setVisible(!visible);
    };

    const handleUpdateProfile = (url) => {
        updateDoc(doc(db, 'users', user.uid), {
            photoURL: url,
            displayName,
            age,
            gender,
            email,
            city,
            bio,
            timestamp: serverTimestamp(),
        })
            .then(() => {
                setImage(null);
                navigation.navigate('Interests',{type:'modal'})
                console.log('Profile updated!');
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
            });
        setIsLoading(false);
    };

    const updateProfile = async () => {
        setIsLoading(true);
        let fullUrl = '';
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
                    console.log('Error getting image URL:', error);
                });
            }).catch((error) => {
                console.log('Error uploading image:', error);
            });
        } catch (e) {
            console.error(e);
        }
    };

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


    const uri = photoURL?.assets && photoURL.assets[0].uri;
    // console.log("my select pic uri is", uri)

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -150} // Adjust the offset as needed
        >
            <StatusBar barStyle="dark-content" backgroundColor={colors.white}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AuthHeader title="Profile Details"/>

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
                        placeholder="Full Name"
                        value={displayName}
                        onChangeText={setFullName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Age"
                        value={age}
                        onChangeText={setAge}
                    />
                    <Picker
                        style={styles.picker}
                        selectedValue={gender}
                        onValueChange={setGender}
                    >
                        <Picker.Item label="Gender" value=""/>
                        <Picker.Item label="Male" value="Male"/>
                        <Picker.Item label="Female" value="Female"/>
                        <Picker.Item label="Others" value="Others"/>
                    </Picker>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        value={city}
                        onChangeText={setCity}
                    />
                    <TextInput
                        style={styles.bioInput}
                        placeholder="Bio"
                        value={bio}
                        onChangeText={setBio}
                        multiline
                        maxLength={200}
                    />

                    <CustomButton onPress={updateProfile} title={'Update Profile'}/>

                </View>


                <ImagePickerModal
                    isVisible={visible}
                    onClose={() => setVisible(false)}
                    onImageLibraryPress={onImageLibraryPress}
                    onCameraPress={onCameraPress}
                />
                <Loader loadingText={'Loading...'} isLoading={isLoading}/>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    inputContainer: {
        marginBottom: 16,
        marginTop: 30,
        paddingHorizontal: 16,
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
    picker: {
        height: 50,
        backgroundColor: colors.inputColor,
        borderRadius: 4,
        marginBottom: 8,
        color: '#fff',
    },
    button: {
        borderRadius: 4,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 16,
        backgroundColor: colors.primaryColor,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    circularImageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    circularImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'white',
        resizeMode: 'cover',
        //tintColor: colors.primaryColor
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.inputColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        fontSize: 24,
        color: '#fff',
    },
    bioInput: {
        height: 150,
        borderWidth: 1,
        borderColor: colors.inputColor,
        borderRadius: 4,
        padding: 10,
        marginBottom: 20,
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
});

export default ModalScreen;
