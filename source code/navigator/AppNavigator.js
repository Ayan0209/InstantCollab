import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {onAuthStateChanged} from "firebase/auth";
import {db, FIREBASE_AUTH} from "../firebase";
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import renderScreens from "./renderScreens";


const AppNavigator = () => {
    return (
        <NavigationContainer>
            {renderScreens()}
        </NavigationContainer>
    );
};


export default AppNavigator;

