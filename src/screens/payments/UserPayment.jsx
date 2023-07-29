import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Button } from "react-native"
import { WebView } from "react-native-webview"
// import { API_URL } from "../config" // Replace with your API URL

const UserPayment = ({ roomId, tourId, userId, price }) => {
  const [checkoutUrl, setCheckoutUrl] = useState(null)

  useEffect(() => {
    const fetchCheckoutTourUrl = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.12:3000/api/bookings/checkout-session/tour/:tourId`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tourId,
              userId,
              price,
            }),
          }
        )

        const data = await response.json()

        if (response.ok) {
          setCheckoutUrl(data.session.url)
        } else {
          console.log("Error:", data.message)
        }
      } catch (error) {
        console.log("Error:", error)
      }
    }

    fetchCheckoutTourUrl()
  }, [tourId, userId, price])

  // room
  useEffect(() => {
    const fetchCheckoutRoomUrl = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.12:3000/api/bookings/checkout-session/room/:roomId`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId,
              userId,
              price,
            }),
          }
        )

        const data = await response.json()

        if (response.ok) {
          setCheckoutUrl(data.session.url)
        } else {
          console.log("Error:", data.message)
        }
      } catch (error) {
        console.log("Error:", error)
      }
    }

    fetchCheckoutRoomUrl()
  }, [roomId, userId, price])

  const handlePaymentSuccess = () => {
    // Logic to handle successful payment
    console.log("Payment successful")
  }

  return (
    <View style={styles.container}>
      {checkoutUrl ? (
        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={(event) => {
            if (event.url.includes("success")) {
              handlePaymentSuccess()
            }
          }}
        />
      ) : (
        <Text>Loading payment page...</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default UserPayment
