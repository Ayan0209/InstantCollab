import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {colors, fontType} from "../utils/constants";
import axios from "axios";

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns;

const CardInfluencer = ({user}) => {

    const [instaData, setInstaData] = useState(null);
    const [postList, setPostList] = useState([]);
    console.log("user data=========================<>", user)
    const access_token= user?.instaUsertoken?.access_token;
    const instaUserId= user?.instaUsertoken?.user_id;


    useEffect(() => {
        getPosts();
        callApi();
    }, []);
    const getPosts=()=>{
        const apiUrl = `https://graph.instagram.com/${instaUserId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${access_token}`

            axios
                .get(apiUrl)
                .then(response => {
                    // Handle successful response
                    setPostList(response.data.data)
                    console.log('instagram api res**:', response.data);
                })
                .catch(error => {
                    // Handle error
                    console.error('Error1:', error);
                });
    }


    const callApi=()=>{
        const apiUrl = `https://graph.instagram.com/${instaUserId}?fields=id,username,media_count,account_type&access_token=${access_token}`; // Replace this with your API endpoint URL
        axios
            .get(apiUrl)
            .then(response => {
                // Handle successful response
                setInstaData(response.data)
                console.log('instagram api res:', response.data);
            })
            .catch(error => {
                // Handle error
                console.error('Error2:', error);
            });
    }

    const renderItemRow=({item})=>(
            <View style={{flex:1,padding:5,width: itemWidth }}>
                {console.log('*************************Item',item)}
                <Image source={{ uri: item?.media_url  }} style={{height:180,width: 140,borderRadius: 5}} />
            </View>
    )

    return (
        <View style={styles.container}>

            <View style={styles.card}>
                <Text style={styles.displayName}>{user?.displayName}</Text>
                <View style={[styles.row]}>
                    <Text style={styles.age}>{user?.city}</Text>
                    <Text style={styles.gender}>{user?.productName}</Text>
                </View>
            </View>
            <View style={{paddingHorizontal: 20}}>
                <Text style={styles.title}>Bio </Text>
                <Text style={styles.bio}>{user?.bio}</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={styles.title}>Interests</Text>
                        <View style={styles.categoriesContainer}>
                            {user.category.map((category, index) => (
                                <View key={index} style={styles.category}>
                                    <Text style={styles.categoryText}>{category}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{flex: 0.2, alignItems: "center"}}>
                        <Text style={styles.title}>Posts</Text>
                        <Text style={styles.bio}>{instaData&& instaData.media_count}</Text>
                    </View>
                </View>

                <View style={{}}>
                    <Text style={styles.title}>Socials</Text>
                    <FlatList
                              numColumns={3}
                              data={postList}
                              renderItem={renderItemRow}
                              keyExtractor={item => item.id}
                              showsHorizontalScrollIndicator={false}

                    />
                    <Text style={styles.email}>{user.email}</Text>
                    <TouchableOpacity onPress={() => getPosts()}>
                        <Ionicons name="logo-instagram" size={45} color="rgba(227, 151, 39, 0.7)"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CardInfluencer;


const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 120,
        backgroundColor: colors.cardBack,
        paddingHorizontal: 20,
        paddingTop: 16,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageContainer: {
        position: 'relative',
        height: '30%',
    },
    image: {
        flex: 1,
        width: '100%',
        resizeMode: 'cover',
    },

    displayName: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: fontType.regular,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'space-between'
    },
    age: {
        fontSize: 18,
        marginRight: 8,
        fontFamily: fontType.regular,
    },
    gender: {
        fontSize: 18,
        fontFamily: fontType.regular,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: fontType.regular,
        marginTop: 16,
        marginBottom: 8,
    },
    bio: {
        fontSize: 16,
        fontFamily: fontType.regular,
    },
    interestsContainer: {
        marginTop: 24,
    },
    interestsHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: fontType.regular,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    category: {
        backgroundColor: colors.primaryColor,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    categoryText: {
        color: 'white',
        fontFamily: fontType.regular,
    },
    location: {
        fontSize: 16,
    },
    email: {
        fontSize: 16,
        marginBottom: 16,
        fontFamily: fontType.regular,
    },
});
