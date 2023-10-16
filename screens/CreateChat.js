import React from 'react';
import { View,Text, TextInput, TouchableOpacity, Alert,StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Firestore, doc, setDoc } from 'firebase/firestore';
import { database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


function CreateChat() {
    const [roomname,setRoomname] =  useState('');
    const navigation = useNavigation();

    const handleCreateChat = async () => {
        const token = await AsyncStorage.getItem('authUser');
        
        const user = JSON.parse(token)
        console.log(user)
        console.log(typeof(user))
        console.log(user.providerData)
        let id = `${Date.now()}`
        const _doc = {
            _id : id,
            user: user.providerData[0],
            chatName: roomname

            
        }

        if (roomname !== ""){
            setDoc(doc(database,"chats",id), _doc).then(()=>{
                setRoomname("")
                navigation.replace("Chat")
            }).catch((err)=>{
                Alert.alert("Error :",err)
            })
        }
    }
    return (
            <View style= {{flex:1,alignItems:'center'}}>
                <Text style={{fontSize:20,fontWeight:'bold'}}>Create Chat Room</Text>
                <View style={{flexDirection:'row',padding:10}}>
                    <View>
                        <TextInput
                            placeholder="Room Name"
                            value={roomname}
                            onChangeText={(text) => setRoomname(text)}
                            style = {styles.input}
                        />
                    </View>
                    <View style={{paddingLeft:20}}>
                        <TouchableOpacity onPress={handleCreateChat}>
                            <Ionicons name="ios-create" size={35} color="black" />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </View>
    );
}

export default CreateChat;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    input: {
      width: 300,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderRadius: 9,
      borderColor: 'black',
      marginBottom: 10,
    },
  });