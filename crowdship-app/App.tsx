import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Account from './components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'

import AcceptDelivery from './AcceptDelivery'; // Adjust the import path
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AcceptDelivery">
        <Stack.Screen name="AcceptDelivery" component={AcceptDelivery} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // return (
  //   <View>
  //     {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
  //   </View>
  // )
}