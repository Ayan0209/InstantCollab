import CustomDrawer from "../screens/Component/CustomDrawer";
import {colors, fontType} from "../utils/constants";
import BottomNavigator from "./BottomNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import ModalScreen from "../screens/ModalScreen";
import AntDesign from "react-native-vector-icons/AntDesign";
import InterestsScreen from "../screens/InterestsScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Socials from "../screens/Socials";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import BusinessModalScreen from "../screens/BusinessModalScreen";
import ProductList from "../screens/ProductList";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LoginScreen from "../screens/LoginScreen";
import React, {useContext, useEffect, useState} from "react";
import {db, FIREBASE_AUTH} from "../firebase";
import {doc, onSnapshot} from "firebase/firestore";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import NewProfile from "../screens/NewProfile";
import InterestsHomeScreen from "../screens/InterestsHomeScreen";
import ProductsScreen from "../screens/ProductsScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


function ProductStack() {
    return (
        <Stack.Navigator
            initialRouteName="All products"
            screenOptions={{headerShown: false}}>
            <Stack.Screen
                name="All products"
                component={ProductList}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Add products"
                component={ProductsScreen}
                options={{headerShown: false}}
            />

        </Stack.Navigator>
    );
}


const renderScreens = () => {
    const [myUser, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [profileComplete, setProfileComplete] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if the user is logged in
        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
            if (user) {
                // If the user is logged in, check the profile completion status
                checkProfileCompletion(user.uid);
            }else{
                setUser(null);
            }
        });

        // Clean up the subscription when the component is unmounted
        return () => unsubscribe();
    }, []);

    const checkProfileCompletion = (userId) => {
        console.log("user-----&&&&&&&-------id", userId);
        setLoading(true)
        // Query the Firestore to get the user's profile document
        onSnapshot(doc(db, "users", userId), (snapshot) => {
            // console.log("Snapshot:", snapshot)
            setLoading(false)
            if (!snapshot.exists()) {
                console.log("render screen Snapshot")
                setProfileComplete(false);
            } else {

                if (snapshot.data().profileComplete) {
                    console.log("render screen profile complete", snapshot.data())
                    setUser(snapshot.data());
                    setProfileComplete(true);
                    setUserType(snapshot.data().type)
                }
            }
        })
    };

    if (myUser) {
        if (profileComplete) {
            console.log("profile complete hai")
            if (userType === "influencer") {
                return (
                    <Drawer.Navigator
                        drawerContent={props => <CustomDrawer {...props} />}
                        initialRouteName="Home"
                        screenOptions={{
                            headerShown: false,
                            drawerActiveBackgroundColor: colors.primaryColor,
                            drawerActiveTintColor: '#fff',
                            drawerInactiveTintColor: '#333',
                            drawerLabelStyle: {
                                marginLeft: -15,
                                fontFamily: fontType.medium,
                                fontSize: 15,
                            },
                        }}>
                        <Drawer.Screen
                            name="Home"
                            component={BottomNavigator}
                            options={{
                                drawerIcon: ({color}) => (
                                    <Ionicons name="home-outline" size={22} color={color}/>
                                ),
                            }}
                        />
                        <Drawer.Screen
                            name="General"
                            component={ModalScreen}
                            options={{
                                drawerIcon: ({color}) => (
                                    <AntDesign name="setting" size={22} color={color}/>
                                ),
                            }}
                        />
                        <Drawer.Screen
                            name="Interests"
                            component={InterestsScreen}
                            options={{
                                drawerIcon: ({color}) => (
                                    <MaterialIcons name="category" size={22} color={color}/>
                                ),
                            }}
                        />

                        <Drawer.Screen
                            name="Socials"
                            component={Socials}
                            options={{
                                drawerIcon: ({color}) => (

                                    <FontAwesome5 name="instagram" size={22} color={color}/>
                                ),
                            }}
                        />

                    </Drawer.Navigator>)
            } else {
                return (<Drawer.Navigator
                    drawerContent={props => <CustomDrawer {...props} />}
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false,
                        drawerActiveBackgroundColor: colors.primaryColor,
                        drawerActiveTintColor: '#fff',
                        drawerInactiveTintColor: '#333',
                        drawerLabelStyle: {
                            marginLeft: -25,
                            fontFamily: fontType.medium,
                            fontSize: 15,
                        },
                    }}>
                    <Drawer.Screen
                        name="Home"
                        component={BottomNavigator}
                        options={{
                            drawerIcon: ({color}) => (
                                <Ionicons name="home-outline" size={22} color={color}/>
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="General"
                        component={BusinessModalScreen}
                        options={{
                            drawerIcon: ({color}) => (
                                <Ionicons name="home-outline" size={22} color={color}/>
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Categories"
                        component={InterestsHomeScreen}
                        options={{
                            drawerIcon: ({color}) => (
                                <MaterialIcons name="category" size={22} color={color}/>
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="All products"
                        component={ProductStack}
                        options={{
                            drawerIcon: ({color}) => (
                                <FontAwesome name="list-ul" size={22} color={color}/>
                            ),
                        }}
                    />
                </Drawer.Navigator>)
            }
        } else {
            return (<Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Socials" component={Socials}/>
                <Stack.Screen name="Modal" component={ModalScreen}/>
                <Stack.Screen name="BrandModal" component={BusinessModalScreen}/>
                <Stack.Screen name="Interests" component={InterestsScreen}/>
            </Stack.Navigator>)
        }

    } else {
        return (<Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen}  initialParams={{load:loading}} />
            <Stack.Screen name="ProfileType" component={NewProfile}/>
            <Stack.Screen name="Modal" component={ModalScreen}/>
            <Stack.Screen name="BrandModal" component={BusinessModalScreen}/>
            <Stack.Screen name="Interests" component={InterestsScreen}/>
            <Stack.Screen name="Socials" component={Socials}/>
        </Stack.Navigator>)
    }
}
export default renderScreens;
