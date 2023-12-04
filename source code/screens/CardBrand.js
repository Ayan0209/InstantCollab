import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {colors, fontType} from "../utils/constants";

const CardBrand = ({user}) => {
    return (
        <View style={{flex: 1}}>
            <View style={styles.card}>
                <Text style={styles.displayName}>{user?.displayName}</Text>
                <View style={[styles.row]}>
                    <Text style={styles.gender}>{user?.productName}</Text>
                    <Text style={styles.age}>{user?.city}</Text>
                </View>
            </View>
            {console.log("product user: ",user)}
            <View style={{flex: 1, paddingHorizontal: 20, marginTop: 10}}>
                <Text style={styles.title}>Product Description</Text>
                <Text style={styles.productText}>{user?.productDescription}</Text>
                <Text style={styles.title}>Product Category</Text>
                <View style={styles.categoriesContainer}>
                    {user?.productCategory.map((cat, index) => (
                        <View key={index} style={styles.category}>
                            <Text style={styles.categoryText}>{cat}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.title}>Product Images</Text>

                <Text style={styles.title}>Promotion Type</Text>
                <View style={styles.categoriesContainer}>
                    {user?.promotionTypes.map((category, index) => (
                        <View key={index} style={styles.category}>
                            <Text style={styles.categoryText}>{category}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default CardBrand;
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
        height: '30%',
    },
    image: {
        flex: 1,
        width: '100%',
        resizeMode: 'cover',
    },
    panel: {
        flex: 1,
        backgroundColor: 'white',
        zIndex: 1,
    },
    displayName: {
        fontSize: 24,
        fontWeight: 'bold',
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
    },
    gender: {
        fontSize: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    bio: {
        fontSize: 16,
    },
    interestsContainer: {
        marginTop: 24,
    },
    interestsHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
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
        color: colors.white,
        fontFamily: fontType.light
    },
    productText: {
        color: colors.black,
        fontFamily: fontType.light
    },
    location: {
        fontSize: 16,
    },
    email: {
        fontSize: 16,
        marginBottom: 16,
    },
});
