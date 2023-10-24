import React, { useState } from 'react';
import { Text, View ,Image,StyleSheet, Button, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { setDoc,doc, getDoc, query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebase';
import { useEffect } from 'react';

function SearchProfile({route}) {
    const {user} = route.params;
    const [userdetail,setUserdetail] = useState('')
    async  function handleAdd (){
      
      const userUid = auth.currentUser.uid;
      let id = `${Date.now()}`
      
      const q = query(collection(database,"friends"),orderBy("_id",'desc'))
      console.log(q,"================================")
      // const unsub =  (q,(snapshot) => {
      //   console.log('snapshot')
      //   const chatRooms  = snapshot.docs.map(datas => {
      //     console.log(datas.data().userid,"############################^^^^^^^^^^^^^^^#######")
      //     console.log("$$$$$$$$$$",user.userUid)
      //     if ((userUid !== datas.data().userid && user.userUid !== datas.data().friendDetail.userUid )|| (userUid !== datas.data().friendDetail.userUid && user.userUid !== datas.data().userid)){
      //       console.log("already friends")
      //       const _doc = {
      //         _id:id,
      //         userid :userUid,
      //         friendDetail: user
      
      //       }
      //       setDoc(doc(database,"friends",id), _doc).then(()=>{
      //         console.log("created successfully")
      //       }).catch((err)=>{
      //           Alert.alert("Error :",err)
      //       })
      //     }
      //     else{
      //       console.log("coming inside else")
            
      //     }
      //   })
        
        
        
        
      // })
      // const data =  doc(database,"friends","_id")
      // const getData = await getDoc(data)
      // if (getData.exists()){
      //   console.log("document: ",getData.data())
      // }
      // else {
      //   console.log("no document===============================")
      // }
      
    }

    useEffect(()=>{
      const userUid = auth.currentUser.uid;
      const userRef = doc(database, 'users',userUid)
      getDoc(userRef)
          .then((doc)=> {
              if(doc.exists){
                  const userdata = doc.data();
                  // console.log(userdata)
                  setUserdetail(userdata)
              }
          })
          .catch((error)=>{
              console.error('Error creating user profile',error)
          })
  },[])
    
    return (
        <View style={imageUploaderStyles.test}>
        <View style={imageUploaderStyles.container}>
            
                <Image source={{ uri: user.profilePicUrl }} style={{ width: 200, height: 200 }} />
            
                
          
                
        </View>
        <View style ={imageUploaderStyles.username}>
          <TouchableOpacity>
            <Text style={imageUploaderStyles.text}>
              {user.username}
            </Text>
            <Text>
              {user.bio}
            </Text>
            <Text>
              {user.userUid}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingTop:"10%"}}>
            <Button title='Connect' onPress={handleAdd}/>
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

export default SearchProfile;