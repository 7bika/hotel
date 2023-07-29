import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { Svg, Path, LinearGradient, Stop, Defs } from "react-native-svg"
import Logo from "./../../../assets/hote2-removebg-preview.png"
import CustomInput from "./../custom/CustomInput"
import CustomButton from "./../custom/CustomButton"
import Modal from "react-native-modal"
import axios from "axios"

const Signup = ({ navigation }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const [redirectToLogin, setRedirectToLogin] = useState(false)
  const [modalOpacity, setModalOpacity] = useState(new Animated.Value(0))

  // Animation
  const logoAnim = new Animated.Value(0)
  const formAnim = new Animated.Value(0)
  const buttonAnim = new Animated.Value(0)

  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])

  const logoTranslateY = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0],
  })

  const formTranslateY = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  })

  const buttonOpacity = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const buttonTranslateY = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  })

  const isValidName = (email) => {
    return email.length > 5
  }

  const isValidEmail = (email) => {
    return email.includes("@")
  }

  const isValidPassword = (password) => {
    return password.length > 5 && /\d/.test(password)
  }

  const handleSubmit = async () => {
    if (!name || !email || !password || !passwordConfirm) {
      setError("All fields are required")
      return
    }

    if (!isValidName(name)) {
      setError("Please enter a valid name that is more than 5 characters long")
      return
    }

    if (!isValidEmail(email)) {
      setError("Invalid email")
      return
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 5 characters long and contain at least one letter and one number"
      )
      return
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError(null)

    try {
      setLoading(true)
      const response = await axios.post(
        "http://192.168.1.12:3000/api/users/signup",
        {
          name,
          email,
          password,
          passwordConfirm,
        }
      )
      console.log("Response:", response.data)
      setLoading(false)
      // console.log("Registration successful", name, email, password)
      setModalVisible(true)

      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
      setTimeout(() => {
        setModalVisible(false)
        setRedirectToLogin(true)
      }, 2000) // Redirect after 2 seconds (adjust the duration as desired)
    } catch (error) {
      console.error("Error", error)
      setError("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (redirectToLogin) {
      navigation.navigate("Login")
    }
  }, [redirectToLogin])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Svg height="500" width="600" viewBox="0 0 1440 320" style={styles.svg}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <Stop offset="5%" stopColor="#C59361" />
            <Stop offset="5%" stopColor="#0A96E7" />
          </LinearGradient>
        </Defs>
        <Path
          fill="#0A96E7"
          d="M0,96L48,128C96,160,192,224,288,245.3C384,267,480,245,576,208C672,171,768,117,864,122.7C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </Svg>

      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ translateY: logoTranslateY }] },
        ]}
      >
        <Image style={styles.logo} source={Logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View
        style={[
          styles.formContainer,
          { transform: [{ translateY: formTranslateY }] },
        ]}
      >
        <Text style={styles.title}>Create An Account</Text>

        <CustomInput
          icon="person-circle-outline"
          placeholder="Name"
          value={name}
          setValue={setName}
          keyboardType="default"
        />

        <CustomInput
          icon="mail-outline"
          placeholder="Email"
          value={email}
          setValue={setEmail}
          keyboardType="email-address"
        />

        <CustomInput
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
          keyboardType="default"
        />

        <CustomInput
          icon="lock-closed-outline"
          placeholder="Confirm Password"
          value={passwordConfirm}
          setValue={setPasswordConfirm}
          secureTextEntry
          keyboardType="default"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            },
          ]}
        >
          <CustomButton
            title="Sign Up"
            loading={loading}
            onPress={handleSubmit}
          />
        </Animated.View>
      </Animated.View>

      <Modal isVisible={isModalVisible} backdropOpacity={0.5}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Animated.View
                  style={[styles.successModalCircle, { opacity: modalOpacity }]}
                >
                  <AntDesign
                    style={{ margin: 10, alignSelf: "center" }}
                    name="check"
                    size={40}
                    color="#68D391"
                  />
                </Animated.View>
                <Text style={styles.successModalText}>Sign Up Successful</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableHighlight
        underlayColor="transparent"
        style={styles.goBack}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={15} color="white" />
      </TouchableHighlight>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F6F8FA",
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  formContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 10,
    elevation: 5,
    marginTop: 200,
  },
  logo: {
    height: 270,
    width: 300,
    bottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  goBack: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#0A96E7",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity value as desired
  },
  modalContent: {
    backgroundColor: "#68D391",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
  },
  successModalCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  successModalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#fff",
  },
})

export default Signup
