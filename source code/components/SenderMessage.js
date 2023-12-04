
import React, { useEffect } from 'react'
import {View, Text, TouchableOpacity, SafeAreaView, StyleSheet} from 'react-native'
import {colors} from "../utils/constants";

const SenderMessage = ({message}) => {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>{message.message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.inputColor,
        borderRadius: 20,
        borderTopRightRadius: 0,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 12,
        alignSelf: 'flex-start',
        marginLeft: 'auto',
    },
    text: {
        color: 'white',
    },
});

export default SenderMessage;



