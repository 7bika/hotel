import React, { useState } from "react"
import { View, Text, TextInput, StyleSheet, Button } from "react-native"
import axios from "axios"

const ResetPassword = ({ navigation, route }) => {
  const { token } = route.params
  console.log("token ", token)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.patch(
        `http://192.168.1.12:3000/api/users/resetPassword/${token}`,
        {
          password,
          passwordConfirm: confirmPassword,
        }
      )

      setLoading(false)
      navigation.navigate("Login") // Redirect to the login screen after successful password reset
    } catch (error) {
      setLoading(false)
      setError("Failed to reset password. Please try again later.")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title="Reset Password"
        onPress={handleResetPassword}
        disabled={loading}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#cc9900",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
})

export default ResetPassword
