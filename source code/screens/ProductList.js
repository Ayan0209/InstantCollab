import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import {colors} from "../utils/constants";

const ProductList = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Assuming you have the user's UID available
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.products && Array.isArray(userData.products)) {

            setProducts(userData.products);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [products]);

  const handleProductPress = (product) => {
    navigation.navigate('Add products', { product:product});
  };

  const handleAddProduct = () => {
    navigation.navigate('Add products', { product:'' });
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleProductPress(item)}>
      <Text style={styles.itemText}>{item.productName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      { console.log("products======================>",products)}
      <Header title="Products" />
      <SafeAreaView>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductList;
