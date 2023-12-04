import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';


const LoadingScreen = ({isLoading}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
};
export default LoadingScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
    },
});
