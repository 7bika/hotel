import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {
  getUserInfo,
  updateUserInfo,
  deleteAccount,
  updatePassword,
} from "./../../helpers/user"
import COLORS from "../../constants/colors"

export default function EditUser({ navigation }) {
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [initialName, setInitialName] = useState("")
  const [initialEmail, setInitialEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showValidationModal, setShowValidationModal] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo()
      const userData = response?.data?.documents
      setUser(userData)
      setName(userData?.name || "")
      setEmail(userData?.email || "")
      setInitialName(userData?.name || "")
      setInitialEmail(userData?.email || "")
    } catch (error) {
      console.log("Error fetching user info:", error)
    }
  }

  const handleUpdateUserInfo = async () => {
    if (!name || !email) {
      setShowValidationModal(true)
      return
    }

    try {
      await updateUserInfo({ name, email })
      Alert.alert("Success", "User information updated successfully.")
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  const handleDeleteAccount = async () => {
    setShowDeleteModal(true)
  }

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccount()
      Alert.alert("Success", "Account deleted successfully.")
    } catch (error) {
      Alert.alert("Error", error.message)
    }
    setShowDeleteModal(false)
  }

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false)
  }

  const handleUpdatePassword = async () => {
    try {
      await updatePassword(currentPassword, newPassword)
      Alert.alert("Success", "Password updated successfully.")
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.arrowBack}
      >
        <Ionicons name="arrow-back" size={22} color="white" />
      </TouchableOpacity>
      <Text style={styles.heading}>User Settings</Text>
      {user && (
        <React.Fragment>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{name || initialName}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{email || initialEmail}</Text>
          <Text style={styles.label}>Created At:</Text>
          <Text style={styles.info}>{user.createdAt}</Text>
        </React.Fragment>
      )}

      <Text style={styles.sectionHeading}>Update User Information:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Button
        title="Update User Info"
        onPress={handleUpdateUserInfo}
        style={styles.button}
      />

      <Text style={styles.sectionHeading}>Change Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Button
        title="Update Password"
        onPress={handleUpdatePassword}
        style={styles.button}
      />

      <View style={styles.bottomSection}>
        <Text style={styles.sectionHeading}>Delete Account:</Text>
        <Button
          title="Delete Account"
          onPress={handleDeleteAccount}
          style={[styles.button, styles.deleteButton]}
          color="red"
        />
      </View>

      {/* Delete Account Confirmation Modal */}
      <Modal visible={showDeleteModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelDeleteAccount}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Validation Modal */}
      <Modal
        visible={showValidationModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Please enter a valid name and email.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowValidationModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  arrowBack: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#0066FF",
    borderRadius: 5,
    padding: 10,
    borderRadius: 30,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    left: 120,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    top: 5,
    alignSelf: "center",
    color: "#0066FF",
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: "center",
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    top: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    color: COLORS.primary,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  bottomSection: {
    marginTop: 20,
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
    borderRadius: 5,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#ccc",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
})
