import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { View ,Text,Button, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons ,Ionicons} from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

function Home() {
    const navigation = useNavigation();
    const [check,getCheck] = useState(true);
    const GotoChat = () => {
        console.log("chat")
        navigation.navigate('Chat')
    }
    const handleSignout = async() =>{
        await AsyncStorage.removeItem('authUser')
        // getCheck(false)
        // navigation.navigate('Login')
        signOut(auth).catch(error => console.log(error));
    }

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerLeft: ()=> null
            
            
        })
    },[])

    useFocusEffect(() => {
        if (check) {
            navigation.addListener('beforeRemove', (e) => {
                // Prevent going back to the splash screen if the user is already on the home screen.
                e.preventDefault();
                });
        }
            
      });
    return (
        <SafeAreaView style={{flex:1,paddingTop:35}}>
            
                <View style = {{backgroundColor: '#60708f',padding:10,flexDirection: 'row',justifyContent:'space-between'}}>
                    <TouchableOpacity  onPress={()=> navigation.navigate('Profile')}>
                        <Ionicons name="person-circle-sharp" size={35} color="black" />
                    
                    </TouchableOpacity>
                    <Text style={{fontSize:28,fontWeight:'bold'}}>
                    Chatguru
                    </Text>
                    <TouchableOpacity   style={{paddingLeft:140}} onPress={GotoChat}>
                        <Ionicons name="chatbubbles-sharp" size={35} color="black" />
                    
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={handleSignout}>
                        <MaterialCommunityIcons name="logout" size={35} color="black" />
                    
                    </TouchableOpacity>
                </View>
                <Text>
                    This is home screen
                </Text>
                
            
        </SafeAreaView>
        
    );
}

export default Home;