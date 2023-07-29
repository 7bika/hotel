import {
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native"
import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { FontAwesome5 } from "@expo/vector-icons"
import COLORS from "../constants/colors"

const Discount = () => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Pressable
          style={{
            width: 200,
            height: 150,
            marginTop: 10,
            backgroundColor: COLORS.primary,
            borderRadius: 10,
            padding: 20,
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "bold",
              marginVertical: 7,
            }}
          >
            Genius
          </Text>
          <Text style={{ color: "white", fontSize: 15, fontWeight: "500" }}>
            You are ate genius level one in our loyalty program
          </Text>
        </Pressable>

        <Pressable
          style={{
            width: 200,
            height: 150,
            marginTop: 10,
            borderColor: "#E0E0E0",
            borderWidth: 2,
            borderRadius: 10,
            padding: 20,
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              marginVertical: 7,
            }}
          >
            15% Discounts
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            Complete 5 stays to unlock level 2
          </Text>
        </Pressable>

        <Pressable
          style={{
            width: 200,
            height: 150,
            marginTop: 10,
            borderColor: "#E0E0E0",
            borderWidth: 2,
            borderRadius: 10,
            padding: 20,
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              marginVertical: 7,
            }}
          >
            10% Discounts
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            Enjoy Discounts at participating at properties worldwide
          </Text>
        </Pressable>
      </ScrollView>

      <Pressable
        style={{
          marginTop: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 200, height: 50, resizeMode: "cover" }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/5a32a821cb9a85480a628f8f.png",
          }}
        />
      </Pressable>
    </View>
  )
}

export default Discount
