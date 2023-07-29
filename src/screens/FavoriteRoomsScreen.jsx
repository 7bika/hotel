import React, { useContext } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import COLORS from "./../constants/colors"
import { RoomContext } from "./RoomContext.js"

const FavoriteRoomsScreen = () => {
  const { favoriteRooms, removeRoomFromFavorites } = useContext(RoomContext)

  const removeFavorite = (roomId) => {
    removeRoomFromFavorites(roomId)
  }

  const renderFavoriteRoom = (room) => (
    <View style={styles.roomContainer}>
      <Text style={styles.roomName}>{room.name}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeRoomFromFavorites(room.id)}
      >
        <Icon name="bookmark" size={24} color={COLORS.primary} />
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      {favoriteRooms.length > 0 ? (
        favoriteRooms.map((room) => (
          <View key={room.id}>{renderFavoriteRoom(room)}</View>
        ))
      ) : (
        <Text style={styles.Text}>No favorites ! Maybe add Some ?</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    top: 5,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  roomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderBottomColor: COLORS.grey,
  },
  roomName: {
    fontSize: 20,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButtonText: {
    marginLeft: 5,
    color: COLORS.primary,
    fontSize: 18,
  },
  Text: {
    fontSize: 20,
    alignSelf: "center",
    top: 4,
  },
})

export default FavoriteRoomsScreen
