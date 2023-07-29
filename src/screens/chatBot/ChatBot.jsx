import React, { useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const ChatBot = () => {
  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState([])

  const navigation = useNavigation()

  const handleUserInput = () => {
    if (inputText.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, sender: "user" },
      ])
      setInputText("")
      setTimeout(handleBotResponse, 1000) // Simulating bot response delay
    }
  }

  const handleBotResponse = (suggestion) => {
    let botResponse = ""
    if (suggestion === "I want to book a tour") {
      botResponse =
        "First choose what tour you'd like to book. Then you can book it inside your cart. And remember, you can't book a tour unless you have booked a room."
    } else if (suggestion === "Can I talk to a person?") {
      botResponse =
        "Sure! Here's our number: +21626842050. Feel free to call us."
    } else if (suggestion === "what is this app all about ?") {
      botResponse =
        "Sure! In this app, you can book rooms, tours, and buy various things. Enjoy your time with us! We take care of your needs!"
    } else if (suggestion === "I want to book a room") {
      botResponse =
        'Of course! You can simply choose the room you like and click on "Book Now" to proceed with the payment. It is simple and easy!'
    } else if (suggestion === "I want to manage my account") {
      botResponse =
        "Of course! You can simply click on the user button right down and choose to change what you like!"
    } else if (suggestion === "I want to buy") {
      botResponse =
        "Of course! You can simply click on the shop button right down and choose what you like to buy!"
    } else if (inputText.toLowerCase() === "hi") {
      botResponse = "Hi, how can I help you?"
    } else if (inputText.toLowerCase() === "how are you ?") {
      botResponse = "I'm fine, what about you?"
    } else {
      botResponse =
        "I'm sorry, I didn't understand. Can you please rephrase or choose any of these suggestions ?"
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: botResponse, sender: "bot" },
    ])
  }

  const renderMessages = () => {
    return messages.map((message, index) => (
      <View
        key={index}
        style={[
          styles.messageContainer,
          message.sender === "user"
            ? styles.userMessageContainer
            : styles.botMessageContainer,
        ]}
      >
        <Text style={styles.messageText}>{parseMessageText(message.text)}</Text>
      </View>
    ))
  }

  const renderQuickReplies = () => {
    const suggestions = [
      "I want to book a tour",
      "Can I talk to a person?",
      "I want help",
      "I want to book a room",
      "I want to buy",
      "I want to manage my account",
    ]

    return (
      <ScrollView contentContainerStyle={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => handleBotResponse(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  // * making phone calls
  // const handlePhoneNumberPress = (phoneNumber) => {
  //   const phoneUrl = `tel:${phoneNumber}`
  //   Linking.canOpenURL(phoneUrl)
  //     .then((supported) => {
  //       if (!supported) {
  //         console.log("Phone call not supported")
  //       } else {
  //         Linking.openURL(phoneUrl)
  //       }
  //     })
  //     .catch((err) => console.error("An error occurred", err))
  // }

  const handlePhoneNumberPress = (phoneNumber) => {
    const phoneUrl = `tel:${phoneNumber}`
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          console.log("Phone call not supported")
          // Open the phone dialer with the phone number
          Linking.openURL(phoneUrl)
        } else {
          // Open the phone dialer with the phone number
          Linking.openURL(phoneUrl)
        }
      })
      .catch((err) => console.error("An error occurred", err))
  }

  const parseMessageText = (text) => {
    const phoneRegex = /\+\d{9,}/g
    const matches = text.match(phoneRegex)

    if (matches && matches.length > 0) {
      return text.split(phoneRegex).map((item, index) => {
        if (index % 2 === 0) {
          return <Text key={index}>{item}</Text>
        } else {
          const phoneNumber = matches[(index - 1) / 2]
          return (
            <Text
              key={index}
              style={styles.phoneNumber}
              onPress={() => handlePhoneNumberPress(phoneNumber)}
            >
              {phoneNumber}
            </Text>
          )
        }
      })
    }
    return <Text>{text}</Text>
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.arrowContainer}>
        <TouchableOpacity
          style={styles.arrow}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={25} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.chatContainer}
        ref={(ref) => {
          this.scrollView = ref
        }}
        onContentSizeChange={() =>
          this.scrollView.scrollToEnd({ animated: true })
        }
      >
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Hello, how can I help you?</Text>
        </View>
        {renderMessages()}
        {renderQuickReplies()}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleUserInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleUserInput}>
          <AntDesign name="arrowright" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E2E2",
  },
  chatContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  messageContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    maxWidth: "75%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#5EACF3",
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#EDEDED",
  },
  messageText: {
    fontSize: 16,
    color: "#333333",
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  suggestionButton: {
    backgroundColor: "#5EACF3",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EDEDED",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#5EACF3",
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowContainer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: -8,
    right: 170,
    height: 55,
  },
  arrow: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 8,
  },
  phoneNumber: {
    textDecorationLine: "underline",
    color: "#0000EE", // Blue link color
  },
})

export default ChatBot
