import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import BrandProfile from "../screens/BrandProfile";
import {AntDesign, Entypo, FontAwesome} from "@expo/vector-icons";
import {colors} from "../utils/constants";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import CardScreen from "../screens/CardScreen";
import InstaProfile from "../screens/InstaProfile";
import ProductsScreen from "../screens/ProductsScreen";
import MatchedScreen from "../screens/MatchedScreen";
import MessageScreen from "../screens/MessageScreen";
import ProfilePage from '../screens/ProfilePage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Card"
                component={CardScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Match"
                component={MatchedScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Message"
                component={MessageScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

function ProfileStack() {
    return (
        <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="Profile"
                component={ProfilePage}
                options={{headerShown: false}}
            />

        </Stack.Navigator>
    );
}

const BottomNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {backgroundColor: colors.white, paddingVertical: 10},
            }}
            tabBarOptions={{
                activeTintColor: colors.primaryColor,
            }}>
            <Tab.Screen name="Home" component={HomeStack}
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({color, size}) => (
                                <AntDesign name="home" color={color} size={size}/>
                            ),
                        }}
            />
            <Tab.Screen name="Chat"
                        component={ChatScreen}
                        options={{
                            tabBarLabel: 'Chat',
                            tabBarIcon: ({color, size}) => (
                                <Entypo name="chat" size={size} color={color}/>
                            ),
                        }}
            />
            {/*<Tab.Screen*/}
            {/*    name="Profile" component={ProfileStack}*/}
            {/*    options={{*/}
            {/*        tabBarLabel: 'Profile',*/}
            {/*        tabBarIcon: ({color, size}) => (*/}
            {/*            <FontAwesome name="user-circle-o" size={size} color={color}/>*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
        </Tab.Navigator>
    );
};


export default BottomNavigator;
