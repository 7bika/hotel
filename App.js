import React, { useState, useEffect, useRef } from "react"
// import {
//   Login,
//   Signup,
//   OnBoardingScreen,
//   ForgotPassword,
//   ResetPassword,
// } from "./src/screens"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { RoomProvider } from "./src/screens/RoomContext.js"
import TabNavigation from "./src/navigators/TabNavigation"
import ChatBot from "./src/screens/chatBot/ChatBot"
import WelcomeScreen from "./src/screens/welcome/WelcomeScreen"
import ResetPassword from "./src/screens/Auth/ResetPassword"
import Login from "./src/screens/Auth/Login"
import Signup from "./src/screens/Auth/Signup"
import ForgotPassword from "./src/screens/Auth/ForgotPassword"
import CalendarPick from "./src/screens/calendarPick/CalendarPick"
import EditUser from "./src/screens/user/EditUser"
import OnBoardingScreen from "./src/screens/onBoardingScreens/OnBoardingScreen"
import HomeScreen from "./src/screens/HomeScreen.jsx"

import ToursScreen from "./src/screens/ToursScreen.jsx"
import RoomDetailsScreen from "./src/screens/RoomDetailsScreen"
import TourDetailsScreen from "./src/screens/TourDetailsScreen"
import ProductDetails from "./src/screens/shop/ProductDetails"
import Picture from "./src/components/Picture.jsx"
import Camera from "./src/components/Camera.jsx"

const Stack = createNativeStackNavigator()

export default function App() {
  // * for the onBoardingScreen
  const [firstLaunched, setFirstLaunched] = useState(false)
  // * for the calendar pick
  const [isFirstLogin, setIsFirstLogin] = useState(false)

  useEffect(() => {
    // Check if the user is logging in for the first time
    AsyncStorage.getItem("firstLogin").then((value) => {
      if (!value) {
        setIsFirstLogin(true)
        AsyncStorage.setItem("firstLogin", "true")
      } else {
        setIsFirstLogin(false)
      }
    })
  }, [])

  // * onBoarding
  useEffect(() => {
    AsyncStorage.getItem("firstLaunched").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("firstLaunched", "true")
        setFirstLaunched(true)
      } else {
        setFirstLaunched(false)
      }
    })
  }, [])

  const navigationRef = React.useRef()

  return (
    <RoomProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar hidden />
        <Stack.Navigator>
          {/*  //* onboarding screens */}
          {firstLaunched ? (
            <>
              <Stack.Screen
                options={{ headerShown: false }}
                name="onBoardingScreen"
                component={OnBoardingScreen}
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="WelcomeScreen"
                component={WelcomeScreen}
              />
            </>
          ) : (
            <>
              {/* Render other screens if not the first launch */}
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                options={({ navigation }) => ({
                  headerShown: true,
                  headerBackVisible: false,
                  title: "Reset Password",
                  headerTitleAlign: "center",
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Login")}
                    >
                      <AntDesign name="leftcircleo" size={24} color="grey" />
                    </TouchableOpacity>
                  ),
                })}
                name="ResetPassword"
                component={ResetPassword}
              />

              <Stack.Screen
                options={{ headerShown: false }}
                name="CalendarPick"
                component={CalendarPick}
                // initialParams={{ onDone: handleCalendarPickDone }}
              />

              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
              />
              {/* Render other screens if not the first launch */}

              <Stack.Screen
                name="TabNavigation"
                component={TabNavigation}
                options={{ headerShown: false }}
              />
            </>
          )}
          {/* Other screens */}

          <Stack.Screen
            name="ToursScreen"
            component={ToursScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="TourDetailsScreen"
            component={TourDetailsScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="RoomDetailsScreen"
            component={RoomDetailsScreen}
            options={{ headerShown: false }}
          />

          {/* Other screens */}
          <Stack.Screen
            options={{ headerShown: false }}
            name="EditUser"
            component={EditUser}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="Picture"
            component={Picture}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="Camera"
            component={Camera}
          />

          <Stack.Screen
            name="ProductDetails"
            component={ProductDetails}
            options={{
              headerShown: false,
              useNativeDriver: true,
              cardStyleInterpolator: ({ current: { progress } }) => ({
                cardStyle: {
                  opacity: progress,
                },
              }),
            }}
          />

          <Stack.Screen
            name="ChatBot"
            component={ChatBot}
            options={{
              headerShown: false,
              useNativeDriver: true,
              cardStyleInterpolator: ({ current: { progress } }) => ({
                cardStyle: {
                  opacity: progress,
                },
              }),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RoomProvider>
  )
}
