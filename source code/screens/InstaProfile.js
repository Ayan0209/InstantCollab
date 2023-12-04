import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ImageBackground, StyleSheet, TouchableOpacity, Alert} from "react-native";
import {colors} from "../utils/constants";
import InstagramLogin from "react-native-instagram-login";
import axios from "axios";


const InstaProfile = () => {
    const insRef = useRef();
    const [token, setToken] = useState(null);


    const callApi=()=>{
        const apiUrl = `https://graph.instagram.com/${token?.user_id}?fields=id,username,account_type&access_token=${token?.access_token}`; // Replace this with your API endpoint URL
        axios
            .get(apiUrl)
            .then(response => {
                // Handle successful response
                console.log('instagram api res:', response.data);
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
    }
    return (
        <View style={{flex:1}}>
            <ImageBackground style={styles.cardImg} source={require('../images/instaUser.png')}/>
            <View>
                <Text style={styles.userName}>John Due, 23</Text>
            </View>
            <View style={{marginTop:20,
                flexDirection:'row',
                justifyContent:'space-between',
                paddingHorizontal:10,
                marginHorizontal:15,
            }}>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.userD}>Followers</Text>
                    <Text style={styles.userValue}>2 M</Text>
                </View>
                <View style={{justifyContent:'center',alignItems: 'center'}}>
                    <Text style={styles.userD}>Posts</Text>
                    <Text style={styles.userValue}>29</Text>
                </View>
                <View style={{justifyContent:'center',alignItems: 'center'}}>
                    <Text style={styles.userD}>Platforms</Text>
                    <Text style={styles.userValue}>fb google</Text>

                </View>

            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity

                    onPress={() => insRef.current.show()}>
                    <Text style={{ color: 'red', textAlign: 'center' }}>Login now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[ { marginTop: 10, backgroundColor: 'green' }]}
                    onPress={callApi}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Logout</Text>
                </TouchableOpacity>
                <Text style={{ margin: 10 }}>Token: {token?.access_token}</Text>
                <InstagramLogin
                    ref={insRef}
                    appId='236373202081307'
                    appSecret='ad1f7494965c3988eacb878d73b7ec12'
                    redirectUrl='https://www.google.com/'
                    scopes={['user_profile', 'user_media']}
                    onLoginSuccess={(token) => {
                        console.log("token",token)
                        setToken(token)
                    }}
                    onLoginFailure={(data) => console.log("data error",data)}
                />
            </View>

        </View>
    );
};


export default InstaProfile;
const styles = StyleSheet.create({
    cardImg:{
        alignItems: 'center',
        borderRadius: 10,
        height: 300,
        width: '100%',
        resizeMode: "contain",
        marginBottom:20,
    },
    userName:{
        marginLeft:20,
        fontSize:20,
        color:colors.black,
        fontWeight:'bold'
    } ,
    userD:{
        fontSize:16,
        color:colors.black,
        fontWeight:'bold',
        marginBottom:10,
    },
    userValue:{
        fontSize:16,
        color:colors.black,
        fontWeight:"400",
    }


})
