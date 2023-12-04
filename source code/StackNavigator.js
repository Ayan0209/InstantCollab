import React, {useEffect, useState} from 'react'
import HomeScreen from './screens/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import {onAuthStateChanged} from 'firebase/auth';
import {db, FIREBASE_AUTH} from './firebase.js';
import ModalScreen from './screens/ModalScreen';
import MatchedScreen from './screens/MatchedScreen';
import MessageScreen from './screens/MessageScreen';
import InterestsScreen from './screens/InterestsScreen';
import NewProfile from './screens/NewProfile';
import BusinessModalScreen from './screens/BusinessModalScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CardScreen from './screens/CardScreen';
import InfluencerProfile from './screens/InfluencerProfile';
import BrandProfile from './screens/BrandProfile';
import Socials from './screens/Socials';
import ProductsScreen from './screens/ProductsScreen';
import ProductList from './screens/ProductList';
import {doc, onSnapshot} from "firebase/firestore";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


const StackNavigator = () => {
    const [myUser, setUser] = useState(null);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            console.log('Ayan check here', user);
            setUser(user);
            onSnapshot(doc(db, "users", user.uid), (snapshot) => {
              //  console.log("Snapshot:", snapshot)
                setUserType(snapshot.data().type)
            })
        });

    }, []);

    //console.log('This is outside func', myUser);

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            {myUser ? (
                <>
                    {console.log('stack nav user type',userType)}
                    <Stack.Group>
                        <Stack.Screen name="Home" component={HomeScreen}/>
                        <Stack.Screen name="Chat" component={ChatScreen}/>
                        <Stack.Screen name="Message" component={MessageScreen}/>
                        <Stack.Screen name="Card" component={CardScreen}/>
                    </Stack.Group>
                    <Stack.Group screenOptions={{presentation: "modal"}}>
                        <Stack.Screen name="ProfileType" component={NewProfile}/>
                        <Stack.Screen name="Modal" component={ModalScreen}/>
                        <Stack.Screen name="BrandModal" component={BusinessModalScreen}/>
                        <Stack.Screen name="InfluencerProfile" component={InfluencerProfile}/>
                        <Stack.Screen name="BrandProfile" component={BrandProfile}/>
                        <Stack.Screen name="Interests" component={InterestsScreen}/>
                        <Stack.Screen name="Socials" component={Socials}/>
                        <Stack.Screen name="Products" component={ProductsScreen}/>
                        <Stack.Screen name="ProductList" component={ProductList}/>
                    </Stack.Group>
                    <Stack.Group screenOptions={{presentation: "transparentModal"}}>
                        <Stack.Screen name="Match" component={MatchedScreen}/>
                    </Stack.Group>
                </>
            ) : (
                <Stack.Screen name="Login" component={LoginScreen}/>
            )
            }
        </Stack.Navigator>
    );
};

export default StackNavigator
