import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { View ,Text,Button, SafeAreaView,TextInput, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons ,Ionicons} from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc ,addDoc, collection, onSnapshot, orderBy, query, serverTimestamp ,setDoc} from 'firebase/firestore';
import { ref,getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { database, storage } from '../config/firebase';
import { Image } from 'react-native';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

function Home() {
    const navigation = useNavigation();
    const [check,getCheck] = useState(true);
    const [content,setContent] = useState('')
    const [postimage,setPostimage] = useState('')
    const [username,setUsername] = useState('')
    const [posts,setPosts] = useState([])
    const [isloading,setIsloading] = useState(true)
    const [userdetail,setUserdetail] = useState('')
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

    async function addImage (){
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          console.log(result);
      
          if (!result.canceled) {
            setPostimage(result.assets[0].uri);
            // await uploadImage(result.assets[0].uri)
            
          }

    } 

    async function uploadImage (uri) {
        // const userUid = auth.currentUser.uid;
        const response = await fetch(uri);
        const blob = await response.blob()
        const storageRef = ref(storage, "Posts/"+ new Date().getTime())
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
              await sendpostMessage(downloadURL)
              
            })
          }     
        )
  
      }

    async function sendPost (){
        const timeStamp = serverTimestamp()
        const token = await AsyncStorage.getItem('authUser');
        const user = JSON.parse(token)
        const id = `${Date.now()}`
        const userUid = auth.currentUser.uid;
        console.log(user)
        console.log(timeStamp)
        console.log(id)
        if (content !== "" && postimage == ""){
            const _doc = {
                _id: id,
                timeStamp: timeStamp,
                post:content,
                postPic:"",
                user: user.providerData[0],
                userName: username,
                senderId: userUid,
                userDetail: userdetail,
            }
        
            await setDoc(doc(database,"posts",id), _doc).then(()=>{
                setContent("")
                setPostimage("")
            }).catch((err)=>{
                Alert.alert("Error :",err)
            })
        }

        if (content !== "" && postimage !== ""){
            await uploadImage(postimage)
        }
        
            
    }

    async function sendpostMessage (url){
        const timeStamp = serverTimestamp()
        const token = await AsyncStorage.getItem('authUser');
        const user = JSON.parse(token)
        const id = `${Date.now()}`
        const userUid = auth.currentUser.uid;
        console.log(user)
        console.log(timeStamp)
        console.log(id)
        const _doc = {
            _id: id,
            timeStamp: timeStamp,
            post:content,
            postPic:url,
            user: user.providerData[0],
            userName: username,
            senderId: userUid,
            userDetail: userdetail,
        }
        
        
        if (content !== ""){
            await setDoc(doc(database,"posts",id), _doc).then(()=>{
                setContent("")
                setPostimage("")
            }).catch((err)=>{
                Alert.alert("Error :",err)
            })
        }
    }

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerLeft: ()=> null
            
            
        })
    },[])

    useEffect(()=>{
        const userUid = auth.currentUser.uid;
        const userRef = doc(database, 'users',userUid)
        getDoc(userRef)
            .then((doc)=> {
                if(doc.exists){
                    const userdata = doc.data();
                    console.log(userdata)
                    setUsername(userdata.username)
                    setUserdetail(userdata)

                }
            })
            .catch((error)=>{
                console.error('Error creating user profile',error)
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

    useLayoutEffect(() => {
        const q = query(collection(database,"posts"),orderBy("_id",'desc'));
        const unsubscribe = onSnapshot(q,(snapshot) => {
            console.log('snapshot')
            const publicPosts  = snapshot.docs.map(doc => doc.data())
            console.log(publicPosts)
            setPosts(publicPosts)
            setIsloading(false)
            
        });
        return unsubscribe;
    },[])
    return (
        <SafeAreaView style={{flex:1,paddingTop:"8%"}}>
            
                <View style = {{backgroundColor: '#cec8db',padding:10,flexDirection: 'row',justifyContent:'space-between'}}>
                    <TouchableOpacity  onPress={()=> navigation.navigate('Profile')}>
                        <Ionicons name="person-circle-sharp" size={35} color="black" />
                    
                    </TouchableOpacity>
                    <Text style={{fontSize:28,fontWeight:'bold'}}>
                    Chatguru
                    </Text>
                    <View  style={{flexDirection:"row"}}>
                        
                        <TouchableOpacity    onPress={()=> navigation.navigate('PrivateChat')}>
                            <FontAwesome name="wechat" size={35} color="black" />
                        
                        </TouchableOpacity>
                        
                        <TouchableOpacity  onPress={handleSignout}>
                            <MaterialCommunityIcons name="logout" size={35} color="black" />
                        
                        </TouchableOpacity>
                    </View>
                    
                </View>
                <View style={styles.comment}>
                    <TouchableOpacity onPress={addImage}>
                        <FontAwesome name="camera-retro" size={35} color="black" />
                    </TouchableOpacity>
                    <View style ={{paddingLeft:"3%"}}>
                        <TextInput
                            multiline
                            style = {styles.input}         
                            numberOfLines={4}
                            
                            placeholder="Enter whatever you thing"
                            value={content}
                            onChangeText={(text) => setContent(text)}
                        />
                    </View>
                    <TouchableOpacity style ={{paddingLeft:"3%"}} onPress={sendPost}>
                        <FontAwesome name="send" size={35} color="blue" />
                    </TouchableOpacity>
                </View>
                {isloading ? (
                    <>
                    <View >
                        <ActivityIndicator size={'large'} color={"#43C651"}/>
                    </View>
                    </>
                    
                ):(
                    <ScrollView style={{backgroundColor:'#ddd5eb'}}>
                        <>
                        {posts ? (
                        <>
                            {posts?.map((post) => (
                            <PostCard key={post._id} post= {post}/>
                            ))}
                        </>
                        ): (<></>)}
                        </>
                    </ScrollView>
                    
                )}
                
            
        </SafeAreaView>
        
    );
}

const PostCard = ({post}) => {
    return (
       
            <View style={{paddingTop:"3%",backgroundColor:"#dad3e6",width:"100%"}}  >
        
                    <View style = {{backgroundColor: '#cec8db',padding: 10}}>
                        <View style={{flexDirection:'row'}}>
                            <Image source={{ uri: post.userDetail.profilePicUrl }} style={{ width: 30, height: 30,borderRadius:99 }}/>
                            <TouchableOpacity style={{paddingLeft:"2%"}}>
                                <Text style={{fontSize: 20,fontWeight:'bold'}}>{post.userDetail.username}</Text>
                            </TouchableOpacity>
                        </View>
                        
                        
                        <Text style={{fontSize: 15,padding:"3%",paddingLeft:"10%"}}>{post.post}</Text>
                        {
                            post.postPic  && <Image source={{ uri: post.postPic }} style={{ width: 200, height: 200 }} />
                        }
                
                        
                    </View>
            
                
            </View>
        
      
     );
  
  }

const styles = StyleSheet.create({
    comment: {
        
        color: "#73756f",
        marginBottom: 10,
        backgroundColor: "#fff", 
        padding: 10,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: '#ddd5eb'


        
        
    },
    input: {
        width: 250,
        height: 70,
        padding: 10,
        borderWidth: 1,
        borderRadius: 9,
        borderColor: 'black',
        marginBottom: 10,
      },
})

export default Home;