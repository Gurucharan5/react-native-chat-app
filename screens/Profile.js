import React, { useEffect } from 'react';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { View,Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { auth, database, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { ref,getDownloadURL, uploadBytesResumable } from 'firebase/storage';

function Profile() {
    const navigation = useNavigation();
    const [image, setImage] = useState('');
    const [pimage, setPimage] = useState('');
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('');
    const [userData,setuserData] = useState('')
    const addImage = async() =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          console.log(result);
      
          if (!result.canceled) {
            setImage(result.assets[0].uri);
            await uploadImage(result.assets[0].uri)
            
          }
        
    }

    async function uploadImage (uri) {
      const userUid = auth.currentUser.uid;
      const response = await fetch(uri);
      const blob = await response.blob()
      const storageRef = ref(storage, "Profile/"+userUid)
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
      const userUid = auth.currentUser.uid;
      const docRef = doc(database,'users',userUid)
      updateDoc(docRef,{
          profilePicUrl: url
      })
      .then(()=>{
          console.log("profile pic updated")
      })
      .catch((error)=>{
          console.log("Error::",error)
      })
    }
    useEffect(()=>{
        const userUid = auth.currentUser.uid;
        const userRef = doc(database, 'users',userUid)
        getDoc(userRef)
            .then((doc)=> {
                if(doc.exists){
                    const userdata = doc.data();
                    console.log(userdata)
                    setuserData(userdata)
                    setPimage(userdata.profilePicUrl)
                }
            })
            .catch((error)=>{
                console.error('Error creating user profile',error)
            })
        console.log(userUid)
    },[])

    return (

        <View style={imageUploaderStyles.test}>
          <View style={imageUploaderStyles.container}>
              {
                  pimage  && <Image source={{ uri: pimage }} style={{ width: 200, height: 200 }} />
              }
                  <View style={imageUploaderStyles.uploadBtnContainer}>
                      <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                          <AntDesign name="camera" size={20} color="black" />
                      </TouchableOpacity>
                      
                  </View>
            
                  
          </View>
          <View style ={imageUploaderStyles.username}>
            <TouchableOpacity>
              <Text style={imageUploaderStyles.text}>
                {userData.username}
              </Text>
              <Text>
                {userData.bio}
              </Text>
            </TouchableOpacity>
          </View>

          
          
        </View>
    );
}


const imageUploaderStyles=StyleSheet.create({
container:{
    elevation:2,
    height:200,
    width:200,
    backgroundColor:'#efefef',
    position:'relative',
    borderRadius:999,
    overflow:'hidden',
},
uploadBtnContainer:{
    opacity:0.7,
    position:'absolute',
    right:0,
    bottom:0,
    backgroundColor:'lightgrey',
    width:'100%',
    height:'25%',
},
uploadBtn:{
    display:'flex',
    alignItems:"center",
    justifyContent:'center'
},
test:{
  
  alignItems: 'center',
  height:'100%'

},
username: {
  paddingTop: "10%",
  fontWeight: "bold",
  fontSize: 25
},
text:{
  fontWeight: "bold",
  fontSize: 25
}
})

export default Profile;