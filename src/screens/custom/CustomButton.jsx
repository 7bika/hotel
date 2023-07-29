import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

const CustomButton = ({ title, onPress, loading }) => {
  return (
    <TouchableOpacity style={styles.customButton} onPress={onPress}>
      <Text style={styles.buttonText}>{loading ? "Loading..." : title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  customButton: {
    marginTop: 20,
    backgroundColor: "#CDB773",
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    height: 55,
    width: 250,
    alignSelf: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
})

export default CustomButton
