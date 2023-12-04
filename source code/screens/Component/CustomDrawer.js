import React, {useEffect, useState} from 'react';
import {Alert, Image, ImageBackground, Share, Text, TouchableOpacity, View} from 'react-native';
import {DrawerContentScrollView, DrawerItemList,} from '@react-navigation/drawer';
import {db, FIREBASE_AUTH} from '../../firebase';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, fontType} from "../../utils/constants";

import {doc, onSnapshot} from "firebase/firestore";
import {useNavigation} from "@react-navigation/native";
import {getAuth} from "firebase/auth";

const CustomDrawer = props => {

    const auth = getAuth();
    const user = auth.currentUser;
    const [userData, setUserType] = useState(null);
    const navigation = useNavigation();
    useEffect(() =>
        onSnapshot(doc(db, "users", user.uid), (snapshot) => {
            //console.log("Snapshot:", snapshot)
            if (!snapshot.exists()) {

            } else {
                setUserType(snapshot.data());
            }
        }), []);
    console.log('========================>', userData)
    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'React Native | A framework for building native apps using React',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };
    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{backgroundColor: '#8200d6'}}>
                <ImageBackground
                    source={require('../../images/menu-bg.jpeg')}
                    style={{padding: 20}}>
                    <Image
                        source={require('../../images/user-profile.jpg')}
                        style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
                    />
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 22,
                            fontFamily: fontType.bold,
                            marginBottom: 5,
                        }}>
                            WELCOME
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text
                            style={{
                                color: '#fff',
                                fontFamily: fontType.medium,
                                marginRight: 5,
                                fontSize: 16,
                            }}>
                            {userData && userData?.displayName}
                        </Text>
                    </View>
                </ImageBackground>
                <View style={{flex: 1, paddingLeft: 5, backgroundColor: '#fff', paddingTop: 10}}>
                    <Text style={{
                        color: colors.black,
                        fontFamily: fontType.medium,
                        marginLeft: 10,
                        marginVertical:10,
                        fontSize: 22,
                    }}>Settings</Text>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
                <TouchableOpacity onPress={() => onShare()} style={{paddingVertical: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="share-social-outline" size={22}/>
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: fontType.medium,
                                marginLeft: 5,
                            }}>
                            Tell a Friend
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>auth.signOut()} style={{paddingVertical: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="exit-outline" size={22}/>
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: fontType.medium,
                                marginLeft: 5,
                            }}>
                            Sign Out
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CustomDrawer;
