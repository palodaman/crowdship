import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '../components/Account'
import DeliveryRequest from './deliveryrequest'
import { View, Button, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Session } from '@supabase/supabase-js'
import React from 'react'
import Header from '../components/header'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentPage, setCurrentPage] = useState<string>('account') // Track the current page

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // Render the selected page based on currentPage state
  const renderPage = () => {
    if (!session || !session.user) return <Auth />
    if (currentPage === 'account') return <Account key={session.user.id} session={session} />
    if (currentPage === 'delivery') return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <DeliveryRequest />
      </ScrollView>
    )
    return <Account key={session.user.id} session={session} />
  }

  return (
    <View style={styles.container}>
      <Header>
        {/* Render the selected page */}
        {renderPage()}
      </Header>
      {session && session.user && (
        <View style={styles.navBar}>
          {/* Navigation Buttons */}
          <TouchableOpacity
            style={[styles.navButton, currentPage === 'delivery' && styles.activeButton]}
            onPress={() => setCurrentPage('delivery')}
          >
            <Text style={[styles.navButtonText, currentPage === 'delivery' && styles.activeButtonText]}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, currentPage === 'account' && styles.activeButton]}
            onPress={() => setCurrentPage('account')}
          >
            <Text style={[styles.navButtonText, currentPage === 'account' && styles.activeButtonText]}>Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

// Add some basic styles to position navbar at the bottom and indicate active state
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60, // Add space at the bottom to avoid overlap with the navbar
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 16,
    color: '#888',
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  activeButtonText: {
    color: '#007bff',
  },
})
