//import liraries
import React, { Component } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native"
import Onboarding from "react-native-onboarding-swiper"
import { useNavigation } from "@react-navigation/native"

// create a component
const OnBoardingScreen = () => {
  const navigation = useNavigation()

  const DotComponent = ({ selected }) => {
    return (
      <View
        className={`w-4 h-4 mx-1 items-center justify-center rounded-full ${
          selected ? "bg-yellow-600" : "border border-yellow-600"
        } p-2 `}
      >
        <View
          className={`w-2 h-2 ${
            selected ? "bg-yellow-600" : "bg-yellow-600"
          } rounded-full `}
        ></View>
      </View>
    )
  }

  const SkipButtonComponent = ({ ...props }) => {
    return (
      <View style={{ marginHorizontal: 20, paddingBottom: 20, padding: 10 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 70,
            width: 80,
            borderRadius: 10,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "black",
          }}
          {...props}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: 17,
              alignItems: "center",
            }}
          >
            SKIP
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const NextButtonComponent = ({ ...props }) => {
    return (
      <View style={{ marginHorizontal: 20, padding: 10, paddingBottom: 20 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 70,
            width: 80,
            borderRadius: 10,
            backgroundColor: "black",
            borderColor: "green",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "grey",
          }}
          {...props}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "#ffbf00",
              fontSize: 17,
              alignItems: "center",
            }}
          >
            NEXT
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const DoneButtonComponent = ({ ...props }) => {
    return (
      <View style={{ marginHorizontal: 20, padding: 10, paddingBottom: 20 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 70,
            width: 80,
            borderRadius: 10,
            backgroundColor: "black",
            borderColor: "green",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "grey",
          }}
          {...props}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "#ffbf00",
              fontSize: 17,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {"\u2713"}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Onboarding
      bottomBarHighlight={false}
      // * to remove the grey color of the bottom bar

      onSkip={() => navigation.navigate("WelcomeScreen")}
      // * replace the route permanently we can also use .navigate

      onDone={() => navigation.navigate("WelcomeScreen")}
      // * when we are done with it

      DotComponent={DotComponent}
      // * dots in the on Boarding pages

      SkipButtonComponent={SkipButtonComponent}
      // * customization for the skip button

      NextButtonComponent={NextButtonComponent}
      // * customization for the next button

      DoneButtonComponent={DoneButtonComponent}
      // * customization for the done button

      //  &  3 different screens 3 different time
      pages={[
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("./../../../assets/images/01.png")}
              className="w-72 h-72 object-contain"
            />
          ),
          title: "Plan Your Trip",
          titleStyles: { fontFamily: "serif", textAlign: "right" },
          subtitle: "Plan Your Trip",
          subtitleStyles: { fontFamily: "Monospace", textAlign: "right" },
        },

        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("./../../../assets/images/02.png")}
              className="w-72 h-72 object-contain"
            />
          ),
          title: "Select the Date",
          titleStyles: { fontFamily: "serif", textAlign: "right" },
          subtitle: "Select The Date You like",
          subtitleStyles: { fontFamily: "cursive", textAlign: "right" },
        },

        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("./../../../assets/images/03.png")}
              className="w-72 h-72 object-contain"
            />
          ),
          title: "Experience New Things",
          titleStyles: { fontFamily: "serif", textAlign: "right" },
          subtitle: "Ready To experience New things ?\n LETS GET STARTED !",
          subtitleStyles: { fontFamily: "fantasy", textAlign: "right" },
        },
      ]}
    />
  )
}

//make this component available to the app
export default OnBoardingScreen
