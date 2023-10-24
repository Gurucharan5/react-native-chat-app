// LoginScreen.js
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet,Button, Alert } from 'react-native';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import SvgComponent from '../assets/SVG';
import { TouchableOpacity } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import profileImage from '../assets/profile.jpg'
import AsyncStorage from '@react-native-async-storage/async-storage';





const Signup  = () => { // Add navigation prop

    const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSignup = async () => {
    if (email !== '' && password !== '') {
        createUserWithEmailAndPassword(auth,email,password)
            .then((userCredential) =>{
                const user = userCredential.user;
                const userInfo = JSON.stringify(user)
                AsyncStorage.setItem('authUser', userInfo);
                const userUid = user.uid;
                const uname = user.email
                const usname = uname.split('@')[0];
                console.log(user)
                console.log(uname)
                console.log(usname)
                setUsername[usname]
                const userData = {
                  username: usname,
                  profilePicUrl: "https://firebasestorage.googleapis.com/v0/b/chatapp-guru.appspot.com/o/Profile%2FAxYrE8G30YVjWXKtH7X3UNageqE2?alt=media&token=1cd72df4-a074-4a45-a7c8-70626ea4b6fd",
                  bio: 'I am using Chatguru :)'
                }
                console.log(usname)
                createUserProfile(userUid,userData.username,userData.profilePicUrl,userData.bio)
                // // navigation.navigate('Login')
            })
            .catch((err) => Alert.alert("Login error",err.message))
    }
  };

  const createUserProfile = (userUid,username,profilePicUrl,bio) => {
    const userRef = doc(database, 'users',userUid)
    const userData = {
      username,
      profilePicUrl,
      bio,
      userUid,
    }
    
    setDoc(userRef,userData)
      .then(()=> {
        console.log('user profile created successfully.')
      })
      .catch((error)=>{
        console.error('Error creating user profile',error)
      })
  }

  return (
    <View style = {styles.container}>
      <SvgComponent />
      <Text>SignUp</Text>
      
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
      <Button title="Signup" onPress={handleSignup} />
      <Text>If you already have an account?. CLick Login</Text>
      <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
        <Text style={{color:"blue",fontWeight:'bold'}}>Login</Text>
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

export default Signup;