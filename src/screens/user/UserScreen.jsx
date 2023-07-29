import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native"
import { Avatar, Card, Title } from "react-native-paper"
import * as ImagePicker from "expo-image-picker"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import { CommonActions } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { logout } from "../../helpers/user"

const User = () => {
  const navigation = useNavigation()

  const [profileImage, setProfileImage] = useState(null)
  const [totalSpendings, setTotalSpendings] = useState(9999)
  const [user, setUser] = useState(null)
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://192.168.1.12:3000/api/users/me")
      const userData = response.data?.data?.documents
      setUser(userData)

      if (userData?.photo === "default.jpg") {
        setProfileImage(require("./../../../assets/user-profile-4255.png"))
      } else {
        setProfileImage({
          uri: `${userData.photo}`,
        })
      }
    } catch (error) {
      console.log("Error fetching user info:", error)
    }
  }

  const handleLogout = async () => {
    setLogoutModalVisible(true)
  }

  const confirmLogout = async () => {
    try {
      await logout()
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      )
    } catch (error) {
      console.log("Logout failed:", error)
    }
  }

  const cancelLogout = () => {
    setLogoutModalVisible(false)
  }

  const goToEditUser = () => {
    navigation.navigate("EditUser")
  }

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      })

      if (!result.canceled) {
        const formData = new FormData()
        formData.append("photo", {
          uri: result.uri,
          type: "image/jpeg",
          name: "profile.jpg",
        })

        updateProfileImage(formData)
      } else {
        alert("You did not select any image.")
      }
    } catch (error) {
      console.log("Error selecting image:", error)
    }
  }

  const updateProfileImage = async (formData) => {
    try {
      await axios.patch(
        "http://192.168.1.12:3000/api/users/updateMe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      fetchUserInfo() // Fetch updated user information after successful update
    } catch (error) {
      console.log("Error updating profile image:", error)
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <TouchableOpacity style={styles.settingsIcon} onPress={goToEditUser}>
            <AntDesign name="setting" size={24} color="black" />
          </TouchableOpacity>

          <Avatar.Image size={100} source={profileImage} />

          <TouchableOpacity
            style={styles.selectImageButton}
            onPress={handleSelectImage}
          >
            <Text style={styles.selectImageButtonText}>Select Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sharePicturesButton}
            onPress={() => navigation.navigate("Picture")}
          >
            <Text style={styles.sharePicturesText}>
              maybe take a picture and share it with your friends ?
            </Text>
            <FontAwesome
              style={{ alignSelf: "center" }}
              name="camera"
              size={30}
              color="#0066FF"
            />
          </TouchableOpacity>

          <Title style={styles.totalSpendings}>
            Total spending 🤑 {totalSpendings}$
          </Title>

          <TouchableOpacity
            style={styles.selectImageButton}
            onPress={() => {
              navigation.navigate("CalendarPick")
            }}
          >
            <Text style={styles.selectImageButtonText}>Modify Your Date</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Modal visible={logoutModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={cancelLogout}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  card: {
    width: "80%",
  },
  content: {
    alignItems: "center",
  },
  settingsIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  selectImageButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  selectImageButtonText: {
    color: "#0066FF",
    textDecorationLine: "underline",
  },
  sharePicturesButton: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  sharePicturesText: {
    margin: 5,
    color: "#999999",
    textAlign: "center",
  },
  totalSpendings: {
    marginTop: 20,
    alignSelf: "center",
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "red",
    textDecorationLine: "underline",
    fontSize: 19,
    top: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  noButton: {
    backgroundColor: "#CCCCCC",
  },
  yesButton: {
    backgroundColor: "red",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default User
