import { doc, getDoc, updateDoc ,addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { View ,Text,StyleSheet} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons,FontAwesome } from '@expo/vector-icons';
import { useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ref,getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { auth, database, storage } from '../config/firebase';
import { Image } from 'react-native';
import { ImageBackground } from 'react-native';


function PrivateChatMain ({route}) {
    const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};
    const { friend } = route.params;
    const [isloading,setIsloading] = useState(true);
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState('')
    const [email,setEmail] = useState('')
    const [username, setUsername] = useState("")
    // const token = AsyncStorage.getItem('authUser');
    // const user = JSON.parse(token)
    
    console.log("Room :",friend)
    console.log("################",username)
    const scrollViewRef = useRef(null);
    const sendMessage = async() => {
        const timeStamp = serverTimestamp()
        const token = await AsyncStorage.getItem('authUser');
        const user = JSON.parse(token)
        const id = `${Date.now()}`
        const _doc = {
            _id: id,
            roomId: friend._id,
            timeStamp: timeStamp,
            message: message,
            user: user.providerData[0],
            userName: username
        }
        if (message !== ""){
            setMessage("")
            await addDoc(collection(doc(database, "friends",friend._id),"messages"),_doc)
            .then(()=>{})
            .catch((err)=> alert(err))
        }
        
    }

    const addImage = async() =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          console.log(result);
      
          if (!result.canceled) {
            // setImage(result.assets[0].uri);
            await uploadImage(result.assets[0].uri)
            
          }
        
    }

    async function uploadImage (uri) {
        // const userUid = auth.currentUser.uid;
        const response = await fetch(uri);
        const blob = await response.blob()
        const storageRef = ref(storage, "Media/"+ new Date().getTime())
        const uploadTask = uploadBytesResumable(storageRef,blob)
  
        uploadTask.on("state_changed",
          (snapshot) =>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100
            console.log("progress",progress)
          },
          (error) =>{
            console.log(error,":Error")
          },
          ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL)=>{
              console.log("File available at", downloadURL); 
              await uploadProfile(downloadURL)
            })
          }     
        )
  
      }
  
      async function uploadProfile(url) {
        // const userUid = auth.currentUser.uid;
        // const docRef = doc(database,'users',userUid)
        const timeStamp = serverTimestamp()
        const token = await AsyncStorage.getItem('authUser');
        const user = JSON.parse(token)
        const id = `${Date.now()}`
        const _doc = {
            _id: id,
            roomId: friend._id,
            timeStamp: timeStamp,
            photo: url,
            user: user.providerData[0],
            userName: username
        }
        await addDoc(collection(doc(database, "friends",friend._id),"messages"),_doc)
        .then(()=>{
            console.log("pics sended")
        })
        .catch((error)=>{
            console.log("Error::",error)
        })
      }
    
    const getauth = async() =>{
        const token = await AsyncStorage.getItem('authUser');
        const checkuser = JSON.parse(token)
        console.log("-------------------------")
        console.log(checkuser.email)
        setEmail(checkuser.email)
        console.log("5555555555555555555555555555")
    }

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      };

    useEffect(()=>{
        const userUid = auth.currentUser.uid;
        const userRef = doc(database, 'users',userUid)
        getDoc(userRef)
            .then((doc)=> {
                if(doc.exists){
                    const userdata = doc.data();
                    console.log(userdata)
                    setUsername(userdata.username)
                }
            })
            .catch((error)=>{
                console.error('Error creating user profile',error)
            })
    },[])
    

    useLayoutEffect(()=>{
        
        
          
        
        const msgQuery = query(
            collection(database,"friends",friend?._id,"messages"),
            orderBy("timeStamp","asc")
        )
        const unsubscribe = onSnapshot(msgQuery,(querySnap)=>{
            const upMessage = querySnap.docs.map(doc => doc.data())
            setMessages(upMessage)
            getauth();
            setIsloading(false)
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }

        })
        return unsubscribe;
    },[])

    useEffect(() =>{
        setTimeout(() => {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }
        }, 100)
        
        
    },[messages])
    return (
        <View style={{flex:1,paddingTop:"8%",height:"100%"}}>
            <ImageBackground
                source={image}
                style={{flex:1,justifyContent:'center'
            }}
            >
                <View style={{height:"10%"}}>
                    <TouchableOpacity style ={{backgroundColor: '#cec8db',flex:1,alignItems:'center'}}>
                        <Text style={{fontSize: 15,fontWeight:'bold'}}>
                            {friend.friendDetail.username.length > 16 ? `${friend.friendDetail.username.slice(0, 16)}..` :friend.friendDetail.username}
                        </Text>
                        <Text>
                            Online
                        </Text>
                    </TouchableOpacity>
                </View>
                
                <View style={{height:"92%"}}>
                    {/* <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios'? 'padding':'height'} keyboardVerticalOffset={160}> */}
                        <>
                            <ScrollView ref={scrollViewRef} onLayout={scrollToBottom}  contentContainerStyle={{flexGrow:1}} bounces={false}>
                                {isloading ? (<>
                                    <View>
                                        <ActivityIndicator/>
                                    </View>
                                </>) : (
                                    <>
                                        {messages?.map((msg,i)=> msg.user.email === email ? (<>
                                            <View key={i} style={{padding:5,opacity:.9}}>
                                                <View style={{alignSelf: 'flex-end',padding:20,backgroundColor:"#9e6a6a",borderRadius:16}}>
                                                    <Text style={{fontSize: 15,fontWeight:'bold'}}>
                                                        {msg.userName}
                                                    </Text>
                                                    {
                                                        msg.photo  && <Image source={{ uri: msg.photo }} style={{ width: 200, height: 200 }} />
                                                    }
                                                    <Text style={{fontSize: 13,alignSelf:'flex-end'}}>
                                                        {msg.message}
                                                    </Text>
                                                </View>
                                                <View style={{alignSelf:"flex-end"}}>
                                                    {msg?.timeStamp?.seconds &&(
                                                        <Text>
                                                            {new Date(
                                                                parseInt(msg?.timeStamp?.seconds)*1000
                                                            ).toLocaleTimeString("en-US",{
                                                                hour: "numeric",
                                                                minute: "numeric",
                                                                hour12: true
                                                            })}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </>) : 
                                            <View key={i} style={{padding:5,opacity:.9}}>
                                                <View style={{padding:20,backgroundColor:"#6a9e76",borderRadius:16,width:250}}>
                                                    <Text style={{fontSize: 15,fontWeight:'bold'}}>
                                                        {msg.userName}
                                                    </Text>
                                                    {
                                                        msg.photo  && <Image source={{ uri: msg.photo }} style={{ width: 200, height: 200 }} />
                                                    }
                                                    <Text style={{fontSize: 13}}>
                                                        {msg.message}
                                                    </Text>
                                                </View>
                                                <View style={{alignSelf:"flex-start"}}>
                                                    {msg?.timeStamp?.seconds &&(
                                                        <Text>
                                                            {new Date(
                                                                parseInt(msg?.timeStamp?.seconds)*1000
                                                            ).toLocaleTimeString("en-US",{
                                                                hour: "numeric",
                                                                minute: "numeric",
                                                                hour12: true
                                                            })}
                                                        </Text>
                                                    )}
                                                </View>
                                                
                                            </View>
                                        )}
                                    </>
                                ) }
                            </ScrollView>
                            <View style = {{flexDirection: 'row',padding:"3%",backgroundColor:"#cec8db"}}>
                                <View>
                                <TextInput
                                    placeholder="Type here .kk..."
                                    value={message}
                                    onChangeText={(text) => setMessage(text)}
                                    style = {styles.input}
                                />
                                </View>
                                <View style={{paddingLeft:"5%"}}>
                                    <TouchableOpacity onPress={addImage}>
                                        <FontAwesome name="camera" size={35} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <View style={{paddingLeft:"5%"}}>
                                    <TouchableOpacity onPress={sendMessage}>
                                        <FontAwesome name="send" size={35} color="black" />
                                    </TouchableOpacity>
                                    
                                </View>
                            </View>
                        </>
                    {/* </KeyboardAvoidingView> */}
                </View>

            </ImageBackground>
            
        </View>
    );
}

export default PrivateChatMain;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    input: {
      width: 230,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderRadius: 9,
      borderColor: 'black',
      marginBottom: 10,
      backgroundColor:"#cde3c8"
    },
  });