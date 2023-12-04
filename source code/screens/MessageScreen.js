import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { getAuth } from 'firebase/auth';
import { useRoute } from '@react-navigation/native';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import {colors} from "../utils/constants";

const MessageScreen = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const { params } =  useRoute();
    const { matchDetails } = params;
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() =>
        onSnapshot(query(
            collection(db, 'matches', matchDetails.id, 'messages'),
            orderBy('timestamp', 'desc')),
            snapshot => setMessages(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })))
            )
    , [matchDetails, db])

    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input,
        });

        setInput("");
    };

    return (
        <View style={styles.container}>
            <Header title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}  />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardContainer}
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        data={messages}
                        inverted={-1}
                        style={styles.flatList}
                        keyExtractor={item => item.id}
                        renderItem={({ item: message }) => (
                            message.userId === user.uid ? (
                                <SenderMessage key={message.id} message={message} />
                            ) : (
                                <ReceiverMessage key={message.id} message={message} />
                            )
                        )}
                    />
                </TouchableWithoutFeedback>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Send Message..."
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                    />
                    <Button onPress={sendMessage} title="Send" color={colors.primaryColor} />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.white,
    },
    keyboardContainer: {
        flex: 1,
    },
    flatList: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingBottom: 12,
        backgroundColor: 'white',
    },
    textInput: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 8,
        paddingHorizontal: 8,
    },
});

export default MessageScreen;
