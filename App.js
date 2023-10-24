import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import chat from './screens/Chat';
import Chat from './screens/Chat';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Splash from './screens/Splash';
import Home from './screens/Home';
import CreateChat from './screens/CreateChat';
import ChatMain from './screens/ChatMain';
import Profile from './screens/Profile';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddUser from './screens/AddUser';
import SearchProfile from './screens/SearchProfile';
import PrivateChat from './screens/PrivateChat';
import PrivateChatMain from './screens/PrivateChatMain';



const Stack = createStackNavigator();

const AuthenticatedUserContext = createContext({})

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//       <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
//       <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
//       <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
//       <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
//       <Stack.Screen name="Chat" component={Chat}  />
//       <Stack.Screen name="CreateChat" component={CreateChat} />
//       <Stack.Screen name='ChatMain' component={ChatMain} />
//       <Stack.Screen name='Profile' component={Profile} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

const AuthenticatedUserProvider = ({children}) => {
  const [user ,setUser] = useState(null);
  console.log(user,"%%%%%%%%%%%%%%%%%%%%%")
  const token = AsyncStorage.getItem('authUser');
  console.log("***************",token)
  return (
    <AuthenticatedUserContext.Provider value={{user, setUser}}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}

function ChatStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
      <Stack.Screen name="CreateChat" component={CreateChat} />
      <Stack.Screen name='ChatMain' component={ChatMain} options={{ headerShown: false }}/>
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='AddUser' component={AddUser} />
      <Stack.Screen name='SearchProfile' component={SearchProfile} />
      <Stack.Screen name='PrivateChat' component={PrivateChat}  options={{ headerShown: false }}/>
      <Stack.Screen name='PrivateChatMain' component={PrivateChatMain} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function AuthStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
}

function RootNavigator () {
  const { user, setUser} = useContext(AuthenticatedUserContext);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    const unsubcribe = onAuthStateChanged(auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setLoading(false);
      }
    );
    return unsubcribe;
  },[user])

  if (loading) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator />
      </View>
    )
  }
  return (
    <NavigationContainer>
      { user ? <ChatStack/>:<AuthStack />}
    </NavigationContainer>
  )
}

export default function App () {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  )
}
