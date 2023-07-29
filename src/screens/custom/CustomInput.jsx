import React from "react"
import { View, Text, StyleSheet, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const CustomInput = (props) => {
  const {
    value,
    setValue,
    placeholder,
    title,
    secureTextEntry,
    keyboardType,
    icon,
  } = props

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={24} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  title: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cc9900",
    borderRadius: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 43,
    fontFamily: "serif",
    fontSize: 15,
  },
})

export default CustomInput
