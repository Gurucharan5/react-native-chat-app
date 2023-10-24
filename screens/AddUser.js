import React, { useState } from 'react';
import { View ,Text,TextInput,StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../config/firebase';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

function AddUser() {
    const [userid,setUserid] = useState('');
    const [searchuser, setSearchuser] = useState([])
    const navigation = useNavigation();
    async function searchUser () {
        
        console.log("searching user")
        const q = query(collection(database,'users'));
        const unsubscribe = onSnapshot(q,(snapshot)=>{
            console.log('snapshot')
            snapshot.docs.map(doc => {
                
                console.log(doc.data().username)
                if (doc.data().userUid == userid){
                    console.log(doc.data())
                    setSearchuser(doc.data())
                    setUserid('')
                    console.log(searchuser,"-------------")
                }
                
            })
            
        })

        
        
        return unsubscribe;
    }

    
    return (
        <View>
            <Text style ={{alignItems:'center'}}>
                This is add user page
            </Text>
            <View style ={{flexDirection:'row',padding:10}}>
                <View>
                    <TextInput
                        style = {styles.input}
                        placeholder="Search User"
                        value={userid}
                        onChangeText={(text) => setUserid(text)}
                    />
                </View>
                
                <TouchableOpacity onPress={searchUser}>
                    <Ionicons name="ios-search-circle-sharp" size={35} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{padding:20}}>
                <TouchableOpacity onPress={()=> navigation.navigate('SearchProfile',{user: searchuser})}>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>
                        {searchuser.username}
                    </Text>
                </TouchableOpacity>
                
            </View>
            
        </View>
    );
}
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
export default AddUser;