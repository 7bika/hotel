import { StatusBar } from "expo-status-bar"
import React, { useEffect, useRef, useState } from "react"
import { Camera } from "expo-camera"
import { shareAsync } from "expo-sharing"
import * as MediaLibrary from "expo-media-library"
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons"
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native"

export default function Picture() {
  let cameraRef = useRef()
  const [hasCameraPermission, setHasCameraPermission] = useState()
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
  const [photo, setPhoto] = useState()

  useEffect(() => {
    ;(async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync()
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync()
      setHasCameraPermission(cameraPermission.status === "granted")
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")
    })()
  }, [])

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    )
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    }

    let newPhoto = await cameraRef.current.takePictureAsync(options)
    setPhoto(newPhoto)
  }

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined)
      })
    }

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined)
      })
    }

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <TouchableOpacity style={styles.actionButton} onPress={sharePic}>
          <FontAwesome name="share-alt" size={24} color="white" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        {hasMediaLibraryPermission ? (
          <TouchableOpacity style={styles.actionButton} onPress={savePhoto}>
            <FontAwesome name="save" size={24} color="white" />
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setPhoto(undefined)}
        >
          <Ionicons name="close" size={24} color="white" />
          <Text style={styles.buttonText}>Discard</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <TouchableOpacity style={styles.captureButton} onPress={takePic}>
        <AntDesign
          name="camera"
          size={30}
          color="white"
          style={styles.cameraLogo}
        />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </Camera>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "grey",
    top: 290,
  },
  cameraLogo: {
    padding: 22,
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
})
