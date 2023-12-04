import React from 'react';
import {View,Text,Pressable} from "react-native";
import {colors} from "../../utils/constants";

const CustomButton = ({title,onPress}) => {
    return (
        <Pressable onPress={onPress} >
            <View style={{height:40,
                backgroundColor:colors.primaryColor,
                alignItems:'center',
                justifyContent:'center',
                borderRadius:10,
                shadowOpacity: 1,
                elevation: 8,
                shadowRadius: 15 ,
                shadowOffset : { width: 2, height: 13},
                shadowColor:colors.primaryColor,
            }}>
                <Text style={{color:'white'}}>{title}</Text>
            </View>
        </Pressable>
    );
};

export default CustomButton;
