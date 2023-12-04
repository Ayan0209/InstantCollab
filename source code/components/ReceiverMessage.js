
import React, { useEffect } from 'react'
import {View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image} from 'react-native'
import {colors} from "../utils/constants";


const ReceiverMessage = ({message}) => {
    return(
        <View style={styles.container}>
            <Image style={styles.img} source={{uri: message.photoURL,}}/>
            <Text style={styles.text}>{message.message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.chatBadgeColor ,
      borderRadius: 20,
      borderTopRightRadius: 0,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginVertical: 6,
      marginHorizontal: 12,
      alignSelf: 'flex-start',
      alignItems: 'center',
    },
    text: {
      color: 'white',
      marginLeft: 8,
    },
    img: {
      height: 30,
      width: 30,
      borderRadius: 9999,
    },
  });



export default ReceiverMessage

