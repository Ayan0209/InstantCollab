import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {db, FIREBASE_AUTH} from '../firebase';
import {colors, fontType} from "../utils/constants";
import CustomButton from "./Component/CustomButton";
import {doc, onSnapshot} from "firebase/firestore";

const staticImage = require('../images/bannerLogo.png');

const LoginScreen = ({ route }) => {

    const navigation = useNavigation();
    const { load } = route.params;
    //const [email, setEmail] = useState('neilmjoshi@gmail.com');

    //const [email, setEmail] = useState('influ@gmail.com');
    const [email, setEmail] = useState('brand1@gmail.com');
    const [password, setPassword] = useState('123456789');
    const [loading, setLoading] = useState(false);
    const [logoVisible, setLogoVisible] = useState(true);
    const auth = FIREBASE_AUTH;


    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setLogoVisible(false);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setLogoVisible(true);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const uid = response.user.uid;
            console.log("s rspon", uid);
            onSnapshot(doc(db, "users", uid), (snapshot) => {
                if (!snapshot.exists()) {
                    navigation.navigate("ProfileType");
                } else {
                    if (!snapshot.data().profileComplete) {
                        //navigation.navigate("ProfileType")
                    }
                    // console.log("snapshot.data",snapshot.data())
                }
            })
            // navigation.navigate('ProfileType')
        } catch (error) {
            setLoading(false);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password).then(() => {
                console.log('User account created & signed in!');
                navigation.navigate("ProfileType")
            })
                .catch(error => {
                    setLoading(false);
                    if (error.code === 'auth/email-already-in-use') {
                        navigation.navigate('ProfileType')
                        console.log('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                    }

                    console.error(error);
                });
            console.log(response);

        } catch (error) {
            setLoading(false);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{backgroundColor: 'red', flex: 1}}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.primaryColor}/>
            <SafeAreaView style={styles.container}>

                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
                    <View style={styles.imageWrapper}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../images/BannerLogoUpdated.png')} style={styles.logoImg}/>
                        </View>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.infoText}>Login/Sign up to continue</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={email}
                                style={styles.input}
                                placeholder="Email"
                                autoCapitalize="none"
                                onChangeText={(text) => setEmail(text)}
                                placeholderTextColor="#E39727"
                            />
                            <TextInput
                                value={password}
                                secureTextEntry={true}
                                style={styles.input}
                                placeholder="Password"
                                autoCapitalize="none"
                                onChangeText={(text) => setPassword(text)}
                                placeholderTextColor="#E39727"
                            />
                        </View>


                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff"/>
                        ) : (
                            <>
                                <CustomButton onPress={signIn} title='Login'/>
                                <View style={styles.buttonGap}/>

                                <View style={{width: '100%', justifyContent: 'center', alignItems: "center"}}>
                                    <Text style={styles.textNewUser}>Are you a new User ?
                                        <Pressable onPress={signUp}>
                                            <Text style={styles.textNewProfile}>Create New Profile</Text>
                                        </Pressable>
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                    {/*<View style={styles.iconsContainer}>*/}
                    {/*    <TouchableOpacity style={styles.icon}>*/}
                    {/*        <AntDesign name="google" size={24} color={colors.primaryColor}/>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*    <TouchableOpacity style={styles.icon}>*/}
                    {/*        <AntDesign name="twitter" size={24} color={colors.primaryColor}/>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*    <TouchableOpacity style={styles.icon}>*/}
                    {/*        <AntDesign name="facebook-square" size={24} color={colors.primaryColor}/>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

export default LoginScreen;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    imageWrapper: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        padding: 10,
        paddingBottom: 60
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'red',
        opacity: 0.8
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoImg: {
        height: 200,
        width: 330,
        resizeMode: 'contain',
        marginTop: 10,
        borderRadius: 0, // Adjust the value as needed for the desired roundness
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
    },
    bottomContainer: {
        flex: 2,
        paddingHorizontal: 32,
        paddingBottom: windowHeight * 0.05,
        justifyContent: 'center',
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        backgroundColor: 'white',
        position: "absolute",
        top: 260,
        right: 0,
        left: 0,
        bottom: 0,
    },
    shadow: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 15,
        shadowOffset: {width: 1, height: 13},
    },
    infoText: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 24,
        fontFamily: 'Rubik',
    },
    inputContainer: {
        marginBottom: 24,
    },
    input: {
        marginVertical: 8,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
    },
    buttonGap: {
        marginBottom: 12,
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        marginBottom: 30,
    },
    icon: {
        marginHorizontal: 8,
    },
    textNewUser: {
        fontSize: 16,
        marginTop: 10,
        color: colors.black,
        fontFamily: fontType.regular
    },
    textNewProfile: {
        paddingLeft: 10,
        color: colors.primaryColor,
        fontFamily: fontType.regular
    }
});
