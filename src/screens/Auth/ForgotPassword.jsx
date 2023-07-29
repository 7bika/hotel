import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import axios from "axios"
import { useNavigation } from "@react-navigation/native"
import { AntDesign } from "@expo/vector-icons"

const ForgotPassword = () => {
  const navigation = useNavigation()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter a valid email")
      return
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        "http://192.168.1.12:3000/api/users/forgotPassword",
        { email }
      )

      setLoading(false)
      console.log(response)
      navigation.navigate("ResetPasswordScreen", { email })
    } catch (error) {
      setLoading(false)
      setError("Failed to send reset password email. Please try again later.")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.goBack}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#0A96E7" />
        </TouchableOpacity>

        <Text style={styles.title}>Forgot Password</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#cc9900"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F6F8FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: "#0A96E7",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  goBack: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 30,
    backgroundColor: "white",
  },
  title: {
    top: -15,
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "#cc9900",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0A96E7",
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default ForgotPassword
