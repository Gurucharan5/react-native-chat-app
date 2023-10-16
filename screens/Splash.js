import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Splash() {
    const navigation = useNavigation();
    useEffect(() => {
        // Check for the presence of the token on app startup
        console.log("come inside useeffect")
        const checkAuthentication = async () => {
          const token = await AsyncStorage.getItem('authUser');
          if (token) {
            navigation.navigate('Home')
          } else {
            navigation.navigate('Login')
    
          }
        };
        
        checkAuthentication();
        
      }, []);
    return (
        <View>
            <ActivityIndicator />
        </View>
        
    );
}

export default Splash;