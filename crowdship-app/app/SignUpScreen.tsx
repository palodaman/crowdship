import React, { useState } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Input } from '@rneui/themed';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState('');
  const router = useRouter();

  async function signUpWithEmail() {
    setLoading(true);
    try {
      // Request OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            username,
            first_name: firstname,
            last_name: lastname,
          },
        },
      });

      if (error) throw error;

      setShowOTPInput(true);
      Alert.alert('Success', 'Check your email for the OTP code');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    setLoading(true);
    try {
      // Verify OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      if (data?.user) {
        // Set password after successful OTP verification
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });

        if (updateError) throw updateError;

        Alert.alert('Success', 'Sign up successful! You can now login with your email and password.', [
          {
            text: 'OK',
            onPress: () => {
              router.push('/'); 
            },
          },
        ]);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="First Name"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={(text) => setFirstname(text)}
          value={firstname}
          placeholder="First name"
          autoCapitalize={'none'}
          disabled={showOTPInput}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Last Name"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={(text) => setLastname(text)}
          value={lastname}
          placeholder="Last name"
          autoCapitalize={'none'}
          disabled={showOTPInput}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Username"
          autoCapitalize={'none'}
          disabled={showOTPInput}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          disabled={showOTPInput}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          disabled={showOTPInput}
        />
      </View>

      {showOTPInput ? (
        <>
          <View style={styles.verticallySpaced}>
            <Input
              label="OTP Code"
              leftIcon={{ type: 'font-awesome', name: 'key' }}
              onChangeText={(text) => setOtp(text)}
              value={otp}
              placeholder="Enter OTP code"
              autoCapitalize={'none'}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <TouchableOpacity
              style={styles.button}
              onPress={verifyOTP}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.verticallySpaced}>
          <TouchableOpacity
            style={styles.button}
            onPress={signUpWithEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : 'Sign up'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});