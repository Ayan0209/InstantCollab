import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import Header from '../components/Header';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import ChatRow from './ChatRow';

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'matches'), where('usersMatched', 'array-contains', user.uid)),
      (snapshot) => {
        const matchesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMatches(matchesData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatRow matchDetails={item}/>}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No Matches at the moment!</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ChatList;
