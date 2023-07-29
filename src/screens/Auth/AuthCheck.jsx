import React, { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

const AuthCheck = () => {
  const navigation = useNavigation()

  useEffect(() => {
    checkLoggedIn()
  }, [])

  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      navigation.navigate("TabNavigation")
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  )
}

export default AuthCheck
