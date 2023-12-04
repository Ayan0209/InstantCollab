import React, { useState } from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import Header from '../components/Header';
import { getFirestore, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import {colors} from "../utils/constants";

const InterestsHomeScreen = () => {
    const navigation = useNavigation();
    const [selectedInterests, setSelectedInterests] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    const handleToggleInterest = (interest) => {
        setSelectedInterests((prevInterests) => {
            if (prevInterests.includes(interest)) {
                return prevInterests.filter((item) => item !== interest);
            } else {
                return [...prevInterests, interest];
            }
        });
    };

    const handleConfirm = () => {
        const category = selectedInterests;

        if (user) {
            updateDoc(doc(db, 'users', user.uid), {
                category: category,
                profileComplete:true,
                timestamp: serverTimestamp(),
            })
                .then(() => {
                    navigation.navigate('Home');
                })
                .catch((error) => {
                    alert(error.message);
                });
        }
    };


    const interests = [
        { id: 1, label: 'Clothing' },
        { id: 2, label: 'Fitness' },
        { id: 3, label: 'Nutrition' },
        { id: 4, label: 'Technology' },
        { id: 5, label: 'Gaming' },
        { id: 6, label: 'Food' },
        { id: 7, label: 'Adventure' },
        { id: 8, label: 'Music' },
        { id: 9, label: 'Dance' },
        { id: 10, label: 'Yoga' },
        { id: 11, label: 'Business' },
        { id: 12, label: 'Others' },
    ];

    const renderInterestButton = (interest) => {
        const isSelected = selectedInterests.includes(interest.label);
        const buttonStyles = [styles.interestButton, isSelected && styles.selectedInterestButton];
        const textStyles = [styles.interestButtonText, isSelected && styles.selectedInterestButtonText];

        return (
            <TouchableOpacity
                key={interest.id}
                style={buttonStyles}
                onPress={() => handleToggleInterest(interest.label)}
            >
                <Text style={textStyles}>{interest.label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white}/>
            <Header title="Your Interests" />
            <View style={styles.textContainer}>
                <Text style={styles.descriptionText}>
                    Select a few of your interests for brand collaborations. Please keep in mind your social
                    media content while picking your interests.
                </Text>
            </View>
            <View style={styles.buttonsContainer}>
                {interests.map((interest) => renderInterestButton(interest))}
            </View>
            <View style={styles.confirmButtonContainer}>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textContainer: {
        marginVertical: 16,
    },
    descriptionText: {
        fontSize: 20,
        color: 'grey',
        fontFamily: 'Rubik',
        textAlign: 'center',
    },
    interestButton: {
        width: '40%', // Adjust the width to occupy 40% of the container (2 columns)
        height: 60,
        margin: 8,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#895ff0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedInterestButton: {
        backgroundColor: '#895ff0',
    },
    interestButtonText: {
        color: '#895ff0',
    },
    selectedInterestButtonText: {
        color: '#fff',
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16, // Adjust the margin bottom to create space
    },
    confirmButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16, // Add margin top to create space between the buttons and confirm button
    },
    confirmButton: {
        width: '40%', // Adjust the width to your preference
        height: 60,
        marginVertical: 16, // Add vertical margin to the confirm button
        borderRadius: 30,
        backgroundColor: '#76b7ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default InterestsHomeScreen;
