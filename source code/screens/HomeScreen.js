import {useNavigation} from '@react-navigation/native'
import React, {useEffect, useRef, useState} from 'react'
import {Dimensions, Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {db} from '../firebase'
import {getAuth} from 'firebase/auth'
import {AntDesign, Entypo} from "@expo/vector-icons";
import Swiper from 'react-native-deck-swiper';
import {collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where} from 'firebase/firestore'
import generateId from '../lib/generateId'
import {colors, fontType} from "../utils/constants";
import LinearGradient from "react-native-linear-gradient";
import {DrawerActions} from '@react-navigation/native'

const screenHeight = Dimensions.get('window').height;
const cardHeight = screenHeight * 0.6;

const HomeScreen = () => {
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;
    const staticImage = require("../images/Logo.png");
    const chatIcon = require("../images/chat.png");
    const swipeRef = useRef(null);
    const [profiles, setProfiles] = useState([]);
    const [userType, setUserType] = useState('');

    useEffect(() =>
            onSnapshot(doc(db, "users", user.uid), (snapshot) => {
                console.log("Snapshot:", snapshot)
                if (!snapshot.exists()) {
                    //navigation.navigate("ProfileType");
                } else {
                  //  console.log("home screen user data type",snapshot.data().type)
                    setUserType(snapshot.data().type);
                }
            }),[]);
    useEffect(() => {
        let unsub;

        const fetchCards = async () => {

            const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then(
                (snapshot) => snapshot.docs.map((doc) => doc.id)
            );

            const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes')).then(
                (snapshot) => snapshot.docs.map((doc) => doc.id)
            );

            const passedUserIds = (await passes).length > 0 ? passes : ['test'];
            const swipesUserIds = (await swipes).length > 0 ? swipes : ['test'];

            unsub = onSnapshot(query(collection(db, 'users'), where("id", "not-in", [...passedUserIds, ...swipesUserIds])), snapshot => {
                const filteredProfiles = snapshot.docs
                    .filter(doc => doc.id !== user.uid) // Exclude the signed-in user
                    .flatMap(doc => {
                        const userData = doc.data();
                        const products = userData.products || [];
                        //console.log("These are the products: ", products);

                        if (userType === 'influencer' && userData.type === 'brand') {
                            // Create a card for each product in the "products" array
                            return products.map(product => ({
                                id: userData.id,
                                displayName: userData.displayName,
                                photoURL: userData.photoURL,
                                productName: product.productName,
                                productCategory: product.productCategory,
                                productDescription: product.productDescription,
                                city: userData.city,
                                promotionTypes: product.promotionTypes,
                                type: userData.type,
                                // Include other product properties in the card if needed
                            }));
                        } else if (userType === 'brand' && userData.type === 'influencer') {
                            // Create a card for the influencer profile
                            return [{
                                id: userData.id,
                                displayName: userData.displayName,
                                photoURL: userData.photoURL,
                                productName: userData.gender,
                                category: userData.category,
                                age: userData.age,
                                bio: userData.bio,
                                email: userData.email,
                                city: userData.city,
                                instaUserName: userData.instaUserName,
                                type: userData.type,
                                // Set an empty string for productName in influencer cards
                                // Include other influencer properties in the card if needed
                            }];
                        } else {
                            return [];
                        }
                    });

                setProfiles(filteredProfiles);
            });
            /*unsub = onSnapshot(query(collection(db, 'users'), where("id", "not-in", [...passedUserIds, ...swipesUserIds])), snapshot => {
                const filteredProfiles = snapshot.docs
                .filter(doc => doc.id !== user.uid) // Exclude the signed-in user
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(profile => {

                if (userType === 'influencer') {
                // Filter for brand profiles
                    return profile.type === 'brand';
                }
                else if(userType === 'brand'){
                    // Filter for influencer profiles with the signed-in user's ID in swipes collection
                    return profile.type === 'influencer';
                }
                else{
                    return false;
                }
            });

            setProfiles(filteredProfiles);
            });*/
        };
        fetchCards();
        return unsub;
    }, [db,userType])
    //console.log("User: ", userType);
    console.log("These are the profiles: ", profiles);
    const swipeLeft = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log('You have swiped Pass on ${userSwiped.displayName}');

        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
    }

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];

        const loggedInProfile = await (await getDoc(doc(db, 'users', user.uid))).data();

        getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(
            (documentSnapshot) => {

                if (documentSnapshot.exists()) {
                    //user matched
                    console.log('You matched', userSwiped.displayName);
                    setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
                    //CREATE MATCH
                    setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
                        users: {
                            [user.uid]: loggedInProfile,
                            [userSwiped.id]: userSwiped
                        },
                        usersMatched: [user.uid, userSwiped.id],
                        timestamp: serverTimestamp()
                    })
                    navigation.navigate("Match", {
                        loggedInProfile, userSwiped
                    })
                } else {
                    console.log('YOU SWIPED ON ', userSwiped.displayName,user.uid);
                    setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
                }

            }
        )

        setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
    }

    return (
        <>
            <StatusBar backgroundColor={colors.statusBarColor} barStyle="dark-content"/>
            <View style={styles.fullScreen}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                        navigation.dispatch(DrawerActions.openDrawer())
                    }}>
                        <Image style={styles.logoImage} source={require('../images/roundLogo.png')} />
                    </TouchableOpacity>
                    <Text style={{fontSize:25,marginRight:30,fontFamily:fontType.bold}}>Discover</Text>

                    <TouchableOpacity onPress={() => console.log("")}>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer}>
                    <Swiper
                        ref={swipeRef}
                        containerStyle={styles.swiperContainer}
                        cards={profiles}
                        stackSize={2}
                        cardIndex={0}
                        stackAnimationFriction={255}
                        animateCardOpacity
                        verticalSwipe={false}
                        onSwipedLeft={(cardIndex) => {
                            console.log('Swipe Pass')
                            swipeLeft(cardIndex)
                        }}
                        onSwipedRight={(cardIndex) => {
                            console.log('Swipe match')
                            swipeRight(cardIndex)
                        }}
                        onTapCard={(cardIndex) => {
                            console.log('passed user is', profiles[cardIndex])
                            navigation.navigate('Card', {user: profiles[cardIndex]})
                        }}
                        overlayLabels={{
                            left: {
                                title: "NOPE",
                                style: {
                                    label: {
                                        textAlign: "right",
                                        color: "red",
                                    },
                                },
                            },
                            right: {
                                title: "Match",
                                style: {
                                    label: {
                                        textAlign: "left",
                                        color: "green",
                                    },
                                },
                            }
                        }}

                        renderCard={(card) =>
                            card ? (
                                <View key={card.id} style={[styles.card, styles.cardShadow]}>
                                    <ImageBackground style={styles.cardImg} source={{uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540ayangautam%252Finfluguru/ImagePicker/8b970953-9729-43e2-aead-5fdc67ce3833.jpeg' ? card?.photoURL:'https://picsum.photos/200/300'}}>
                                        <LinearGradient
                                            colors={['#FFFFFF', 'rgba(0, 0, 0, 0.4)']}
                                            style={styles.cardTxt}>
                                            <View style={{flex: 1, padding: 16}}>
                                                <View>
                                                    <Text style={styles.brandName}>{card.displayName}</Text>
                                                    <Text style={styles.productName}>{card.productName}</Text>
                                                </View>
                                                {card.category && (
                                                    <View style={styles.categoryContainer}>
                                                        {card.category.map((categoryItem, index) => (
                                                            <View key={index} style={styles.categoryItemContainer}>
                                                                <Text
                                                                    style={styles.categoryItemText}>{categoryItem}</Text>
                                                            </View>
                                                        ))}
                                                    </View>

                                                )}
                                            </View>
                                        </LinearGradient>
                                    </ImageBackground>
                                </View>
                            ) : (
                                <View style={[styles.card, styles.cardShadow]}>
                                    <Text style={[styles.text]}>No more profiles</Text>
                                    <Image
                                        style={[styles.cardImg]}
                                        source={{uri: "https://cdn-icons-png.flaticon.com/512/6009/6009746.png"}}
                                    />
                                </View>
                            )}
                    />
                </View>
                <View style={styles.swipeButtons}>
                    <TouchableOpacity style={styles.crossButton} onPress={() => swipeRef.current.swipeLeft()}>
                        <Entypo name="cross" size={24} color="red"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.heartButton} onPress={() => swipeRef.current.swipeRight()}>
                        <AntDesign name="heart" size={24} color="green"/>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: 'white',
    },
    deck: {
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 15,
        height: 50,
    },
    imageLeft: {
        marginLeft: 10,
    },
    imageCenter: {
        width: 50,
        height: 50,
    },
    imageRight: {
        width: 65,
        height: 50,
        marginRight: 10,
    },
    text: {
        fontSize: 50,
        margin: 50,
        justifyContent: 'center',
    },
    cardContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },

    swiperContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    card: {
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 10,
        height: cardHeight,
        elevation: 4,
        shadowColor: "blue"
    },

    cardImg: {
        alignItems: 'center',
        position: 'absolute',
        borderRadius: 10,
        height: '100%',
        width: '100%',
        resizeMode: "contain",
    },
    cardTxt: {
        position: 'absolute',
        zIndex: 2,
        borderRadius: 10,
        bottom: 0,
        left: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandName: {
        fontWeight: 'bold',
        fontSize: 18,
        color:'white'
    },
    productName: {
        fontSize: 16,
        color:'white'
    },
    category: {
        fontStyle: 'italic',
    },
    cardShadow: {
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 8,
        shadowColor: "blue"
    },
    swipeButtons: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    crossButton: {
        backgroundColor: 'rgba(196, 69, 47, 0.5)',
        borderRadius: 20,
        padding: 8,
    },
    heartButton: {
        backgroundColor: 'rgba(47, 196, 50, 0.5)',
        borderRadius: 20,
        padding: 8,
    },
    categoryContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    categoryItemContainer: {
        backgroundColor: colors.primaryColor,
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 4,
    },
    categoryItemText: {
        color: 'white',
        fontSize: 14,
    },
    logoImage:{
        height:50,
        width:50,
    }
});
