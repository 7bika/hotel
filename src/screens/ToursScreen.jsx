import React, { useEffect, useState, useRef, useContext } from "react"
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
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import COLORS from "../constants/colors"
import { useNavigation } from "@react-navigation/native"
import Discount from "./Discount"
import ChatBot from "./chatBot/ChatBot"
import { RoomContext } from "./RoomContext"
import { AntDesign } from "@expo/vector-icons"

const { width } = Dimensions.get("screen")
const cardWidth = width / 1.8
const cardHeight = 300

const ToursScreen = () => {
  const categories = ["All", "Popular", "Top Rated", "Featured", "Luxury"]
  const navigation = useNavigation()

  const [topTours, setTopTours] = useState([])
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [tours, setTours] = useState([])
  console.log(tours)
  const [cheapTours, setCheapTours] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const scrollX = useRef(new Animated.Value(0)).current

  // * getting the logged in user
  const { loggedInUser } = useContext(RoomContext)
  console.log("LoggedInUser", loggedInUser)

  useEffect(() => {
    fetchTours()
    fetchCheapTours()
    fetchTopTours()
  }, [])

  const fetchTours = async () => {
    try {
      const apiUrl = "http://192.168.1.12:3000/api/tours"
      const response = await fetch(apiUrl)
      const data = await response.json()

      const updatedTours = data.data.tours.map((tour) => {
        const updatedImages = tour.images.map((image) => {
          return "http://192.168.1.12:3000/public/img/tours/" + image
        })
        return { ...tour, images: updatedImages }
      })

      setTours(updatedTours)
    } catch (error) {
      console.error("Could not fetch tours", error)
    }
  }

  const fetchCheapTours = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/tours/top-5-cheap"
      )
      const data = await response.json()
      setCheapTours(data.data.tours)
    } catch (error) {
      console.error("Could not fetch tours", error)
    }
  }

  const fetchTopTours = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/tours?price[gte]=50&ratingsAverage[gte]=4.8"
      )
      const data = await response.json()
      setTopTours(data.data.tours)
    } catch (error) {
      console.error("Could not fetch top tours", error)
    }
  }

  const fetchPopularTours = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/tours?price[gte]=100&ratingsAverage[gte]=4.8"
      )
      const data = await response.json()
      setTours(data.data.tours)
    } catch (error) {
      console.error("Could not fetch popular tours", error)
    }
  }

  const fetchTopRatedTours = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/tours?ratingsAverage[gte]=4.7"
      )
      const data = await response.json()
      setTours(data.data.tours)
    } catch (error) {
      console.error("Could not fetch top rated tours", error)
    }
  }

  const fetchFeaturedTours = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/tours?limit=6&sort=-ratingsAverage,price"
      )
      const data = await response.json()
      setTours(data.data.tours)
    } catch (error) {
      console.error("Could not fetch featured tours", error)
    }
  }

  const fetchLuxuryTours = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.12:3000/api/tours?price[gte]=1200"
      )
      const data = await response.json()
      setTours(data.data.tours)
    } catch (error) {
      console.error("Could not fetch luxury tours", error)
    }
  }

  const CategoryList = () => {
    const fetchToursByCategory = async (category) => {
      if (category === "All") {
        await fetchTours()
      } else if (category === "Popular") {
        await fetchPopularTours()
      } else if (category === "Top Rated") {
        await fetchTopRatedTours()
      } else if (category === "Featured") {
        await fetchFeaturedTours()
      } else if (category === "Luxury") {
        await fetchLuxuryTours()
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
              fetchToursByCategory(item)
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

  const Card = ({ tour, index }) => {
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
        onPress={() => navigation.navigate("TourDetailsScreen", { tour })}
      >
        <Animated.View style={{ ...styles.card, transform: [{ scale }] }}>
          <Animated.View style={{ ...styles.cardOverLay, opacity }} />
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>${tour.price}</Text>
          </View>
          <Image source={{ uri: tour.imageCover }} style={styles.cardImage} />
          <View style={styles.cardDetails}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={styles.roomName}>{tour.name}</Text>
              </View>
              {/* <Icon name="bookmark-border" size={26} color={COLORS.primary} /> */}
            </View>
            <View style={styles.roomInfo}>
              <View style={styles.ratingContainer}>
                {renderRatingStars(tour.ratingsAverage)}
              </View>
              <Text style={{ fontSize: 20, left: 170, bottom: 30 }}>
                {tour.ratingsQuantity}
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  const TopTourCard = ({ tour }) => {
    return (
      <View style={styles.topRoomCard}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={15} color={COLORS.orange} />
          <Text style={styles.ratingText}>{tour.ratingsAverage}</Text>
        </View>
        <Image style={styles.topRoomImage} source={{ uri: tour.imageCover }} />
        <View style={styles.topRoomInfo}>
          <Text style={styles.roomName}>{tour.name}</Text>
          <Text style={styles.roomType}>{tour.difficulty}</Text>
          <Text style={styles.roomPrice}>${tour.price}</Text>
        </View>
      </View>
    )
  }

  const CheapTourCard = ({ tour }) => {
    return (
      <View style={styles.cheapRoomCard}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={15} color={COLORS.orange} />
          <Text style={styles.ratingText}>{tour.ratingsAverage}</Text>
        </View>
        <Image
          style={styles.cheapRoomImage}
          source={{
            uri: `${tour.imageCover}`,
          }}
        />
        <View style={styles.cheapRoomInfo}>
          <Text style={styles.roomName}>{tour.name}</Text>
          <Text style={styles.roomType}>{tour.type}</Text>
          <Text style={styles.roomPrice}>${tour.price}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <View style={{ paddingBottom: 15 }}>
          <Text style={styles.headerTitle}>Find Your Tour</Text>
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

      {/* // * search handler  */}
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
          {/* Animated.FlatList */}
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
            data={tours.filter((tour) => {
              if (categories[selectedCategoryIndex] === "Popular") {
                return tour.price <= 500 && tour.ratingsAverage >= 4.5
              } else {
                return true
              }
            })}
            contentContainerStyle={styles.cardListContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => <Card tour={item} index={index} />}
            snapToInterval={cardWidth}
          />
        </View>

        {/* // * top tours  */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Our Top tours</Text>
          <Text style={styles.showAllText}>Show all</Text>
        </View>
        <FlatList
          data={topTours}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topRoomsContainer}
          renderItem={({ item }) => <TopTourCard tour={item} />}
        />

        {/* // * cheap tours  */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Our 5 Cheapest Tours</Text>
        </View>
        <FlatList
          data={cheapTours}
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.cheapRoomsContainer}
          renderItem={({ item }) => <CheapTourCard tour={item} />}
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
            style={{ alignSelf: "flex-end", right: 30, bottom: 50 }}
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
})

export default ToursScreen
