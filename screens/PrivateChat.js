import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { auth,database } from '../config/firebase';
import { getDoc,doc ,collection,query,orderBy,onSnapshot} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome ,MaterialCommunityIcons} from '@expo/vector-icons';

function PrivateChat() {
    const [frienddata, setFrienddata] = useState([]);
    const [friend,setFriend] = useState([]);
    const navigation = useNavigation();
    const GotoChat = () => {
      console.log("chat")
      navigation.navigate('Chat')
    }
    useLayoutEffect(()=>{
        const userUid = auth.currentUser.uid;
        const q = query(collection(database,"friends"),orderBy("_id",'desc'));
        const unsubscribe = onSnapshot(q,(snapshot) => {
        console.log('snapshot')
        const chatRooms  = snapshot.docs.map(doc => doc.data())
        const fun1 = chatRooms.filter(room => room.userid == userUid)
        const fun2 = chatRooms.filter(room => room.friendDetail.userUid == userUid)
        console.log(fun1)
        const fun  = snapshot.docs.map(doc => {
            console.log(doc.data(),"---------------")
        })
        console.log(chatRooms)
        setFrienddata(fun1)
        setFriend(fun2)
        
        
        });
        return unsubscribe;
    },[])
    return (
      <SafeAreaView style={{flex:1,paddingTop:"8%"}}>
        <View style = {{backgroundColor: '#cec8db',padding:10,flexDirection: 'row',justifyContent:'space-between',height:"10%"}}>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity   onPress={GotoChat}>
                <FontAwesome name="group" size={30} color="black" />
            
            </TouchableOpacity>
            <TouchableOpacity style={{paddingLeft:"80%"}} onPress={()=>navigation.navigate('AddUser')}>
              <MaterialCommunityIcons name="chat-plus" size={30} color="black" />
            </TouchableOpacity>
          </View>
          
        </View>
        <View style={{height:"80%"}}>
          {frienddata ? (
          <>
            {frienddata?.map((friend) => (
              <MessageCard key={friend._id} friend= {friend}/>
            ))}
          </>
          ): (<></>)}

          {friend ? (
          <>
            {friend?.map((friend) => (
              <MessageCardTwo key={friend._id} friend= {friend}/>
            ))}
          </>
          ): (<></>)}
        </View>
      </SafeAreaView>
        
    );
}

const MessageCard = ({friend}) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity style={{paddingTop:2,backgroundColor:"#0a0a0a",width:"100%"}}  onPress={()=> navigation.navigate('PrivateChatMain',{friend: friend})}>
        <View >
          
        </View>
        <View style = {{backgroundColor: '#c9c6cf',padding: 10}}>
          <Text style={{fontSize: 15,fontWeight:'bold'}}>{friend.friendDetail.username}</Text>
          <Text>hai message from someone</Text>
    
          <Text>
    
          </Text>
        </View>
      </TouchableOpacity>
     );
  
  }

  const MessageCardTwo = ({friend}) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity style={{paddingTop:2,backgroundColor:"#0a0a0a",width:"100%"}}  onPress={()=> navigation.navigate('PrivateChatMain',{friend: friend})}>
       <View style = {{backgroundColor: '#c9c6cf',padding: 10}}>
         <Text style={{fontSize: 15,fontWeight:'bold'}}>{friend.userid}</Text>
         <Text>hai message from someone</Text>
   
         <Text>
   
         </Text>
       </View>
      </TouchableOpacity>
     );
  
  }

export default PrivateChat;