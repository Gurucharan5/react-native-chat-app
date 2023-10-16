// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet,Button, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgComponent from '../assets/SVG';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


const Login = () => { // Add navigation prop
    const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email  !== "" && password !== "") {
        await signInWithEmailAndPassword(auth,email,password)
            .then((userCredential) => {
                console.log("Login Success")
                console.log(userCredential.user)
                const userInfo = JSON.stringify(userCredential.user)
                AsyncStorage.setItem('authUser', userInfo);
                // navigation.navigate('Home')

            })
            .catch((err) => Alert.alert("Login error",err.message));
    }
  };

  useFocusEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      // Prevent going back to the splash screen if the user is already on the home screen.
      e.preventDefault();
    });
  });

  return (
    <View style = {styles.container}>
      <SvgComponent  />
      <Text>Login</Text>
      <TextInput
        style = {styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style = {styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text>If you don't have an account?. CLick Signup</Text>
      <TouchableOpacity onPress={()=>navigation.navigate('Signup')}>
        <Text style={{color:"blue",fontWeight:'bold'}}>SignUp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderRadius: 9,
    borderColor: 'black',
    marginBottom: 10,
  },
});

export default Login;