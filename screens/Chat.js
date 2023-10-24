import { collection, query,orderBy,addDoc,onSnapshot, doc } from 'firebase/firestore';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View ,Text, TouchableOpacity, SafeAreaView, ActivityIndicator} from 'react-native';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';

function Chat() {
  const navigation = useNavigation();
  const [ messages,setMessages] = useState();
  const [isloading,setIsloading] = useState(true);
  const [chats, setChats] = useState([])
  useLayoutEffect(() => {
    const q = query(collection(database,"chats"),orderBy("_id",'desc'));
    const unsubscribe = onSnapshot(q,(snapshot) => {
      console.log('snapshot')
      const chatRooms  = snapshot.docs.map(doc => doc.data())
      console.log(chatRooms)
      setChats(chatRooms)
      setIsloading(false)
      
    });
    return unsubscribe;
  },[])

  
  return (
    <SafeAreaView style={{flex:1,paddingTop:"8%"}}>
      <View style = {{backgroundColor: '#cec8db',padding:10,flexDirection: 'row',justifyContent:'space-between'}}>
        <Text style={{fontSize:30,fontWeight:'bold'}}>
          Messages
        </Text>
        <TouchableOpacity  onPress={()=> navigation.navigate('CreateChat')}>
          <MaterialCommunityIcons name="android-messages" size={35} color="black" />
          
        </TouchableOpacity>
      </View>

      {isloading ? (
        <>
          <View >
            <ActivityIndicator size={'large'} color={"#43C651"}/>
          </View>
        </>
        
      ):(
        <>
          {chats ? (
          <>
            {chats?.map((room) => (
              <MessageCard key={room._id} room= {room}/>
            ))}
          </>
          ): (<></>)}
        </>
      )}
    </SafeAreaView>
  )

  
  
  
}

const MessageCard = ({room}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={{paddingTop:2,backgroundColor:"#0a0a0a",width:"100%"}}  onPress={()=> navigation.navigate('ChatMain',{room: room})}>
     <View style = {{backgroundColor: '#c9c6cf',padding: 10}}>
       <Text style={{fontSize: 15,fontWeight:'bold'}}>{room.chatName}</Text>
       <Text>hai message from someone</Text>
 
       <Text>
 
       </Text>
     </View>
    </TouchableOpacity>
   );

}

export default Chat;

// import React from 'react';
// import { View ,Text, Button} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';

// function Chat() {
//   const navigation = useNavigation();
//   const handleSignout = async () =>{
//     await AsyncStorage.removeItem('authUser')
//     navigation.navigate("Login")
//   }
//   return (
//     <View>
//       <Text>
//         Welcome to chat
//       </Text>
//       <Button title="Signout" onPress={handleSignout} />
//     </View>
//   );
// }

// export default Chat;