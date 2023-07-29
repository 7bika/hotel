import React, { useLayoutEffect, useState, useRef, useContext } from "react"
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Animated,
  Button,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import COLORS from "../constants/colors"
import { useNavigation } from "@react-navigation/native"
import Discount from "./Discount"
import ChatBot from "./chatBot/ChatBot"
import { Ionicons } from "@expo/vector-icons"
import { RoomContext } from "./RoomContext"
import { AntDesign } from "@expo/vector-icons"

const { width } = Dimensions.get("screen")
const cardWidth = width / 1.8
const cardHeight = 300

const HomeScreen = () => {
  const categories = ["All", "Popular", "Top Rated", "Featured", "Luxury"]
  const navigation = useNavigation()

  const [topRooms, setTopRooms] = useState([])

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [rooms, setRooms] = useState([])
  console.log(rooms)
  const [cheapRooms, setCheapRooms] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // * chatbot state
  const [minimized, setMinimized] = useState(false)

  const scrollX = useRef(new Animated.Value(0)).current

  // * getting the logged in user
  const { loggedInUser } = useContext(RoomContext)
  console.log("LoggedInUser", loggedInUser)

  // * Add this function to handle chatbot toggle
  const handleToggleMinimize = () => {
    setMinimized((state) => !state)
  }

  useLayoutEffect(() => {
    fetchRooms()
    fetchCheapRooms()
    fetchTopRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      let apiUrl = "http://192.168.1.12:3000/api/rooms"

      const response = await fetch(apiUrl)
      const data = await response.json()
      setRooms(data.data.rooms)
    } catch (error) {
      console.error("Could not fetch rooms", error)
    }
  }

  const fetchTopRooms = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/tours?price[gte]=50&ratingsAverage[gte]=4.8"
      )
      const data = await response.json()
      setTopRooms(data.data.tours)
    } catch (error) {
      console.error("Could not fetch top tours", error)
    }
  }

  const fetchCheapRooms = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/rooms/top-5-cheap"
      )
      const data = await response.json()
      setCheapRooms(data.data.rooms)
    } catch (error) {
      console.error("Could not fetch rooms", error)
    }
  }

  const fetchPopularRooms = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/rooms?price[lte]=100&ratingsAverage[gte]=4.6"
      )
      const data = await response.json()
      setRooms(data.data.rooms)
    } catch (error) {
      console.error("Could not fetch popular rooms", error)
    }
  }

  const fetchTopRatedRooms = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/rooms?ratingsAverage[gte]=4.7"
      )
      const data = await response.json()
      setRooms(data.data.rooms)
    } catch (error) {
      console.error("Could not fetch top rated rooms", error)
    }
  }

  const fetchFeaturedRooms = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/rooms?limit=6&sort=-ratingsAverage,price"
      )
      const data = await response.json()
      setRooms(data.data.rooms)
    } catch (error) {
      console.error("Could not fetch featured rooms", error)
    }
  }

  const fetchLuxuryRooms = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/rooms?price[lte]=100&ratingsAverage[gte]=4.7"
      )
      const data = await response.json()
      setRooms(data.data.rooms)
    } catch (error) {
      console.error("Could not fetch luxury rooms", error)
    }
  }

  const CategoryList = () => {
    const fetchRoomsByCategory = async (category) => {
      if (category === "All") {
        await fetchRooms()
      } else if (category === "Popular") {
        await fetchPopularRooms()
      } else if (category === "Top Rated") {
        await fetchTopRatedRooms()
      } else if (category === "Featured") {
        await fetchFeaturedRooms()
      } else if (category === "Luxury") {
        await fetchLuxuryRooms()
      }
    }

    return (
      <View style={styles.categoryListContainer}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedCategoryIndex(index)
              fetchRoomsByCategory(item)
            }}
          >
            <View>
              <Text
                style={{
                  ...styles.categoryListText,
                  color:
                    selectedCategoryIndex === index
                      ? COLORS.primary
                      : COLORS.grey,
                }}
              >
                {item}
              </Text>
              {selectedCategoryIndex === index && (
                <View
                  style={{
                    height: 3,
                    width: 30,
                    backgroundColor: COLORS.primary,
                    marginTop: 2,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  const renderRatingStars = (rating) => {
    const filledStars = Math.floor(rating)
    const hasHalfStar = rating - filledStars >= 0.5

    return (
      <View style={styles.cardRatingContainer}>
        {[...Array(filledStars)].map((_, index) => (
          <Icon key={index} name="star" size={15} color={COLORS.orange} />
        ))}
        {hasHalfStar && (
          <Icon name="star-half" size={15} color={COLORS.orange} />
        )}
        {[...Array(5 - filledStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
          <Icon key={index} name="star-border" size={15} color={COLORS.grey} />
        ))}
        <Text style={styles.cardRatingCount}>({rating})</Text>
      </View>
    )
  }

  const Card = ({ room, index }) => {
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ]
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 0, 0.7],
    })
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    })
    return (
      <TouchableOpacity
        disabled={activeCardIndex !== index}
        activeOpacity={1}
        onPress={() => navigation.navigate("RoomDetailsScreen", { room })}
      >
        <Animated.View style={{ ...styles.card, transform: [{ scale }] }}>
          <Animated.View style={{ ...styles.cardOverLay, opacity }} />
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>${room.price}</Text>
          </View>
          <Image source={{ uri: room.images[0] }} style={styles.cardImage} />
          <View style={styles.cardDetails}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={styles.roomName}>{room.name}</Text>
              </View>
              {/* <Icon name="bookmark-border" size={26} color={COLORS.primary} /> */}
            </View>
            <View style={styles.roomInfo}>
              <View style={styles.ratingContainer}>
                {renderRatingStars(room.ratingsAverage)}
              </View>
              <Text style={{ fontSize: 20, left: 170, bottom: 30 }}>
                {room.ratingsQuantity}
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const TopRoomCard = ({ room }) => {
    return (
      <View style={styles.topRoomCard}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={15} color={COLORS.orange} />
          <Text style={styles.ratingText}>{room.ratingsAverage}</Text>
        </View>
        <Image style={styles.topRoomImage} source={{ uri: room.image }} />
        <View style={styles.topRoomInfo}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.roomType}>{room.type}</Text>
          <Text style={styles.roomPrice}>${room.price}</Text>
        </View>
      </View>
    )
  }

  const CheapRoomCard = ({ room }) => {
    return (
      <View style={styles.cheapRoomCard}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={15} color={COLORS.orange} />
          <Text style={styles.ratingText}>{room.ratingsAverage}</Text>
        </View>
        <Image
          style={styles.cheapRoomImage}
          source={{
            uri: `${room.images}`,
          }}
        />
        <View style={styles.cheapRoomInfo}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.roomType}>{room.type}</Text>
          <Text style={styles.roomPrice}>${room.price}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <View style={{ paddingBottom: 15 }}>
          <Text style={styles.headerTitle}>Find Your Room</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headerSubtitle}>in </Text>
            <Text style={styles.headerSubtitleHighlight}>Tunisia</Text>
          </View>
        </View>
        <View style={styles.userInfoContainer}>
          {/*  // * Display the user's photo */}
          <Image
            source={{
              uri: `${loggedInUser.photo}`,
            }}
            style={styles.userPhoto}
          />
          {/* // *  Style the loggedInUser.name */}
          <Text style={styles.userName}>{loggedInUser.name}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={30} style={styles.searchIcon} />

          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        <CategoryList />

        <View>
          {/* // * Animated.FlatList */}
          <Animated.FlatList
            onMomentumScrollEnd={(e) => {
              setActiveCardIndex(
                Math.round(e.nativeEvent.contentOffset.x / cardWidth)
              )
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            horizontal
            data={rooms.filter((room) => {
              if (categories[selectedCategoryIndex] === "Popular") {
                return room.price <= 100 && room.ratingsAverage >= 4.6
              } else {
                return true
              }
            })}
            contentContainerStyle={styles.cardListContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => <Card room={item} index={index} />}
            snapToInterval={cardWidth}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Our Top Rooms</Text>
          <Text style={styles.showAllText}>Show all</Text>
        </View>
        <FlatList
          data={topRooms}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topRoomsContainer}
          renderItem={({ item }) => <TopRoomCard room={item} />}
        />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Our 5 Cheapest Rooms</Text>
        </View>
        <FlatList
          data={cheapRooms}
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.cheapRoomsContainer}
          renderItem={({ item }) => <CheapRoomCard room={item} />}
        />

        {/* // * discount  */}
        <Discount />

        {/* // * chat bot */}
        <TouchableOpacity
          style={styles.chatIcon}
          onPress={() => {
            navigation.navigate("ChatBot")
          }}
        >
          <AntDesign
            name="message1"
            size={35}
            color={COLORS.primary}
            style={{ alignSelf: "flex-end", right: 7, bottom: -1 }}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 26,
    fontWeight: "bold",
  },
  headerSubtitleHighlight: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  userInfoContainer: {
    alignItems: "center",
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    marginTop: 15,
    marginLeft: 20,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginLeft: 20,
  },
  searchInput: {
    fontSize: 20,
    paddingLeft: 10,
  },
  categoryListContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 30,
  },
  categoryListText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  card: {
    height: cardHeight,
    width: cardWidth,
    elevation: 15,
    marginRight: 20,
    borderRadius: 15,
    backgroundColor: COLORS.white,
  },
  cardImage: {
    height: cardHeight - 80,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  priceTag: {
    height: 60,
    width: 80,
    backgroundColor: COLORS.primary,
    position: "absolute",
    zIndex: 1,
    right: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  cardDetails: {
    height: 100,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    position: "absolute",
    bottom: 0,
    padding: 20,
    width: "100%",
  },
  cardOverLay: {
    height: cardHeight,
    backgroundColor: COLORS.white,
    position: "absolute",
    zIndex: 100,
    width: cardWidth,
    borderRadius: 15,
  },
  cardRatingContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  cardRatingCount: {
    fontSize: 15,
    color: COLORS.grey,
    marginLeft: 5,
  },
  topRoomCard: {
    height: cardHeight,
    width: cardWidth,
    backgroundColor: COLORS.white,
    elevation: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    padding: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  topRoomImage: {
    height: cardHeight - 120,
    width: "100%",
    borderRadius: 10,
    marginBottom: 5,
  },
  topRoomInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
    left: 5,
  },
  roomType: {
    fontSize: 12,
    color: COLORS.grey,
  },
  roomPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.grey,
  },
  cheapRoomCard: {
    height: cardHeight,
    width: cardWidth,
    backgroundColor: COLORS.white,
    elevation: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    padding: 10,
  },
  cheapRoomImage: {
    height: cardHeight - 120,
    width: "100%",
    borderRadius: 10,
    marginBottom: 5,
  },
  cheapRoomInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontWeight: "bold",
    color: COLORS.grey,
  },
  showAllText: {
    color: COLORS.grey,
  },
  cardListContainer: {
    paddingVertical: 30,
    paddingLeft: 20,
    paddingRight: cardWidth / 2 - 40,
  },
  topRoomsContainer: {
    paddingLeft: 20,
    marginTop: 20,
    paddingBottom: 30,
  },
  cheapRoomsContainer: {
    paddingLeft: 20,
    marginTop: 20,
    paddingBottom: 30,
  },

  chatIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
})

export default HomeScreen
