import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import Header from '../components/Header';
import ChatList from '../components/ChatList';
import {colors} from "../utils/constants";

const ChatScreen = () => {


  return (
    <View style={styles.container}>
      <Header title="Chat" />
      <ChatList />
    </View>
  );
};

export default ChatScreen;

const styles = {
  container: {
    flex: 1,
    backgroundColor:colors.white
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
};
