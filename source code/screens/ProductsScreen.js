import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '../firebase';
import {getAuth} from 'firebase/auth';
import Header from '../components/Header';
import CustomButton from "./Component/CustomButton";
import {colors, fontType} from "../utils/constants";
import {ToastSuccess} from "../utils/common";
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import AuthHeader from "../components/AuthHeader";


const data = [
    { key: 1, value: 'Clothing' },
    { key: 2, value: 'Fitness' },
    { key: 3, value: 'Nutrition' },
    { key: 4, value: 'Technology' },
    { key: 5, value: 'Gaming' },
    { key: 6, value: 'Food' },
    { key: 7, value: 'Adventure' },
    { key: 8, value: 'Music' },
    { key: 9, value: 'Dance' },
    { key: 10, value: 'Yoga' },
    { key: 11, value: 'Business' },
    { key: 12, value: 'Others' },
];

const ProductsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState([]);
    const [promotionTypes, setPromotionTypes] = useState([]);
    const [productDescription, setProductDescription] = useState('');

    const auth = getAuth();
    const user = auth.currentUser;

    console.log("This is the product: ", route?.params);

    const product = route?.params?.product;
    useEffect(() => {
        console.log("---product", product)
        if (product === "") {
            setProductName('');
            setProductCategory('');
            setPromotionTypes([]);
            setProductDescription('');
        } else {
            setProductName(product.productName || '');
            setProductCategory(product.productCategory || '');
            setPromotionTypes(product.promotionTypes || []);
            setProductDescription(product.productDescription || '');
        }
    }, []);


    const handlePromotionTypeToggle = (type) => {
        if (promotionTypes.includes(type)) {
            setPromotionTypes(promotionTypes.filter((item) => item !== type));
        } else {
            setPromotionTypes([...promotionTypes, type]);
        }
    };

    const handleUpdateProduct = () => {

        const updatedProduct = {
            id: product ? product.id : generateRandomId(), // Use existing product id or generate a new one
            productName,
            productCategory,
            promotionTypes,
            productDescription,
        };

        // Update the user's document in the database
        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    const userProducts = userData.products || [];

                    if (product) {
                        // Update an existing product in the array
                        const updatedProducts = userProducts.map((p) =>
                            p.id === product.id ? updatedProduct : p
                        );

                        updateDoc(userDocRef, {products: updatedProducts})
                            .then(() => {
                                console.log('Product updated!');
                            })
                            .catch((error) => {
                                console.error('Error updating product:', error);
                            });
                    } else {
                        // Add a new product to the array
                        const newProducts = [...userProducts, updatedProduct];

                        updateDoc(userDocRef, {products: newProducts})
                            .then(() => {
                                ToastSuccess('New product added!')
                                navigation.goBack()
                                console.log('New product added!');
                            })
                            .catch((error) => {
                                console.error('Error adding new product:', error);
                            });
                    }
                }
            })
            .catch((error) => {
                console.error('Error retrieving user data:', error);
            });
    };

    // Helper function to generate a random id
    const generateRandomId = () => {
        return Math.random().toString(36).substring(7);
    };

    return (
        <View style={styles.container}>
            <AuthHeader title="Product Profile"/>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Product Name"
                    value={productName}
                    onChangeText={setProductName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Product Description"
                    value={productDescription}
                    onChangeText={setProductDescription}
                />
                <MultipleSelectList
                    setSelected={(val) => setProductCategory(val)}
                    data={data}
                    save="value"
                    boxStyles={{borderColor:colors.primaryColor}}
                    inputStyles={{color:colors.black,fontFamily:fontType.regular}}
                    badgeStyles={{borderWidth:1,borderColor:colors.primaryColor,backgroundColor:'white'}}
                    badgeTextStyles={{color:colors.primaryColor}}
                    onSelect={() => console.log(productCategory)}
                    label="Product Category"
                />
                {/*<TextInput*/}
                {/*    style={styles.input}*/}
                {/*    placeholder="Product Category"*/}
                {/*    //value={productCategory.join(', ')} // Join the array elements with a comma and space*/}
                {/*   // onChangeText={(text) => setProductCategory(text.split(',').map((category) => category.trim()))} // Split the text by comma and trim whitespace from each category*/}
                {/*/>*/}
            </View>
            <View style={{paddingHorizontal: 16}}>
                <Text style={styles.iconText}>Types of Promotions</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        style={[
                            styles.icon,
                            promotionTypes.includes('post') && styles.selectedIcon,
                        ]}
                        onPress={() => handlePromotionTypeToggle('post')}
                    >
                        <Ionicons name="paper-plane-outline"
                                  size={40}
                                  color={promotionTypes.includes('post') ? colors.white : colors.inputColor}
                        />
                        <Text
                            style={[styles.iconTextWithin, {color: promotionTypes.includes('post') ? "#FFF" : "#000"}]}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.icon,
                            promotionTypes.includes('story') && styles.selectedIcon,
                        ]}
                        onPress={() => handlePromotionTypeToggle('story')}
                    >
                        <Ionicons name="play-outline" size={40}
                                  color={promotionTypes.includes('story') ? colors.white : colors.inputColor}
                        />
                        <Text
                            style={[styles.iconTextWithin, {color: promotionTypes.includes('story') ? "#FFF" : "#000"}]}>Story</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.icon,
                            promotionTypes.includes('reels') && styles.selectedIcon,
                        ]}
                        onPress={() => handlePromotionTypeToggle('reels')}
                    >
                        <Ionicons name="film-outline" size={40}
                                  color={promotionTypes.includes('reels') ? colors.white : colors.inputColor}
                        />
                        <Text
                            style={[styles.iconTextWithin, {color: promotionTypes.includes('reels') ? "#FFF" : "#000"}]}>Reels</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{marginVertical: 10, paddingHorizontal: 16}}>
                <CustomButton onPress={() => handleUpdateProduct()} title={'Update Product'}/>
            </View>

        </View>
    );
};

export default ProductsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputContainer: {
        marginBottom: 16,
        marginTop: 20,
        paddingHorizontal: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.inputColor,
        borderRadius: 4,
        padding: 10,
        marginBottom: 8,
        color: '#000',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    icon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: colors.inputColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIcon: {
        backgroundColor: colors.inputColor,
        borderColor: '#fff',
    },
    iconText: {
        marginTop: 10,
        marginLeft: 4,
        marginBottom: 15,
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    iconTextWithin: {
        color: '#000',
        fontSize: 12,
    },
    button: {
        borderRadius: 4,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 16,
        backgroundColor: colors.inputColor,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

