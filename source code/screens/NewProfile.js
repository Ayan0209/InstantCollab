import React, {useState} from 'react';
import {StyleSheet,ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getAuth} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import AuthHeader from "../components/AuthHeader";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {db} from "../firebase";
import {colors} from "../utils/constants";
import Loader from "./Loader";

const NewProfile = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    const navigation = useNavigation();

    const handleTypeSelection = (type) => {
        setSelectedType(type);
    };

    const handleContinue = () => {
        setIsLoading(true);
        // Update the user's "type" attribute in Firestore with the selectedType
        // Perform any necessary actions upon pressing continue
        // if( selectedType == null){
        //   return
        // }
        // if (user) {
        //     if (selectedType === "brand") {
        //         navigation.navigate('BrandModal', {type: 'brand'});
        //     } else {
        //         navigation.navigate('Modal', {type: 'influencer'});
        //     }
        // }
        const type =selectedType;
        if (user) {
          setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            type: type,
            profileComplete:false,
            createdAt: serverTimestamp(),
          })
            .then(() => {
                setIsLoading(false)
                if(type==="brand"){
                    navigation.navigate('BrandModal',{ type:'brand' });
                }
                else{
                    navigation.navigate('Modal',{ type:'influencer' });
                }
            })
            .catch((error) => {
                setIsLoading(false)
              alert(error.message);
            });
        }
    };

    return (
        <View style={styles.container}>
            <AuthHeader title={'Select your Profile'}/>
           <Loader  isLoading={isLoading} loadingText={'Loading...'} />
            <View style={styles.contentContainer}>

                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        style={[
                            styles.icon,
                            selectedType === 'brand' && styles.selectedIcon,
                        ]}
                        onPress={() => handleTypeSelection('brand')}
                    >
                        <Ionicons
                            name="business-outline"
                            size={48}
                            color={selectedType === 'brand' ? '#fff' : colors.primaryColor}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.icon,
                            selectedType === 'influencer' && styles.selectedIcon,
                        ]}
                        onPress={() => handleTypeSelection('influencer')}
                    >
                        <Ionicons
                            name="person-outline"
                            size={48}
                            color={selectedType === 'influencer' ? '#fff' : colors.primaryColor}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    disabled={!selectedType}
                >
                    <Text style={styles.buttonText}>Continue</Text>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
    },
    icon: {
        borderWidth: 1,
        borderColor: colors.primaryColor,
        borderRadius: 50,
        padding: 16,
        margin: 10,
    },
    selectedIcon: {
        backgroundColor: colors.primaryColor,
    },
    continueButton: {
        backgroundColor: colors.primaryColor,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
        marginTop: 'auto',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default NewProfile;
