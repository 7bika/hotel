import React, { useEffect, useState, useContext } from "react"
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native"
import MapView, { Marker } from "react-native-maps"
import Icon from "react-native-vector-icons/MaterialIcons"
import COLORS from "./../constants/colors"
import { RoomContext } from "./RoomContext"
import UserPayment from "./payments/UserPayment"
import { useStripe } from "@stripe/stripe-react-native"

const TourDetailsScreen = ({ navigation, route }) => {
  const { tour } = route.params
  console.log("tour ID", tour.id)
  console.log("tour dates", tour.startDates)

  // * getting the logged in user
  const { loggedInUser } = useContext(RoomContext)
  console.log("LoggedInUser", loggedInUser)

  const [reviews, setReviews] = useState([])
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [review, setReview] = useState("")
  const [userReviewId, setUserReviewId] = useState(null)
  console.log(userReviewId)
  const [rating, setRating] = useState(0)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isAddedModalVisible, setIsAddedModalVisible] = useState(false)
  const [isDeletedModalVisible, setIsDeletedModalVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const [guides, setGuides] = useState([])
  const [firstLocation, setFirstLocation] = useState(null)

  const [initialRegion, setInitialRegion] = useState(null)
  const [showMap, setShowMap] = useState(false)

  // State variables for booking modal
  const [bookingModalVisible, setBookingModalVisible] = useState(false)

  // State variables for payment modal
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)

  // Create a state variable to keep track of booking details
  const [bookingDetails, setBookingDetails] = useState({
    tourId: tour._id,
    userId: loggedInUser._id,
    price: tour.price,
  })

  const {
    favoriteRooms,
    addRoomToFavorites,
    removeRoomFromFavorites,
    numAdults,
    numChildren,
    daysDifference,
    selectedStartDate,
    selectedEndDate,
  } = useContext(RoomContext)

  console.log("selected dates tour", selectedStartDate, selectedEndDate)

  const isBookmarked = favoriteRooms.some((favRoom) => favRoom.id === tour.id)

  useEffect(() => {
    fetchGuides()
    fetchReviews()
  }, [])

  // * Function to submit a review
  const submitReview = async () => {
    if (review && rating > 0) {
      try {
        const response = await fetch(
          `http://192.168.1.12:3000/api/tours/${tour._id}/reviews`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ review, rating }),
          }
        )
        const data = await response.json()

        if (response.ok) {
          // Review submitted successfully
          setSuccessModalVisible(true)
          // Fetch reviews again to update the list
          fetchReviews()
          // Reset the review and rating
          setReview("")
          setRating(0)
        } else {
          // Error occurred while submitting review
          console.log("Error submitting review:", data)
          setErrorModalVisible(true)
          setErrorMessage(
            data.message || "An error occurred while submitting your review."
          )
        }
      } catch (error) {
        console.log("Error submitting review:", error)
        setErrorModalVisible(true)
        setErrorMessage("An error occurred while submitting your review.")
      }
    } else {
      setErrorModalVisible(true)
      setErrorMessage("Please provide both a rating and a review.")
    }
  }

  // * fetching the reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.12:3000/api/tours/${tour._id}/reviews`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch reviews.")
      }

      const data = await response.json()
      console.log("Response data of the fetch:", data)

      // Check if the data contains the expected "documents" array
      if (!data.data || !Array.isArray(data.data.documents)) {
        throw new Error("Invalid response data format.")
      }

      const reviewsData = data.data.documents
      console.log("REVIEW data of the fetch:", reviewsData)
      console.log("LENGTH data of the fetch:", reviewsData.length)

      setReviews(reviewsData)
      console.log("reviews", reviews)

      // Find the user's review in the list and set the userReviewId
      const userReview = reviewsData.find(
        (reviewItem) => reviewItem.user._id === userReviewId
      )
      setUserReviewId(userReview ? userReview._id : loggedInUser)
    } catch (error) {
      console.log("Error fetching reviews:", error)
    }
  }

  // * deleting the reviews
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `http://192.168.1.12:3000/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (response.ok) {
        // Review deleted successfully, fetch reviews again to update the list
        fetchReviews()
        setSuccessModalVisible(true) // Set success modal to be visible
      } else {
        // Error occurred while deleting the review
        setErrorModalVisible(true)
        setErrorMessage("An error occurred while trying to delete your review.")
      }
    } catch (error) {
      console.log("Error deleting review:", error)
      setErrorModalVisible(true)
      setErrorMessage("An error occurred while trying to delete your review.")
    }
  }

  // * toggling the bookmarks
  const toggleBookmark = () => {
    if (isBookmarked) {
      removeRoomFromFavorites(tour._id)
      setIsDeletedModalVisible(true)
    } else {
      addRoomToFavorites(tour)
      setIsAddedModalVisible(true)
    }
  }

  // * Function to handle editing a review
  const handleEditReview = async (reviewItem) => {
    console.log("userReviewId:", userReviewId)
    if (reviewItem.user._id === userReviewId) {
      if (!review || rating < 1) {
        setErrorModalVisible(true)
        setErrorMessage(
          "Please provide both a rating (minimum 1) and a review."
        )
        return
      }

      setReview(reviewItem.review)
      setRating(reviewItem.rating)
      setUserReviewId(reviewItem.user._id)

      try {
        const response = await fetch(
          `http://192.168.1.12:3000/api/reviews/${reviewItem._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ review, rating }),
          }
        )

        const data = await response.json() // Parse the response JSON

        if (response.ok) {
          // Review edited successfully, fetch reviews again to update the list
          fetchReviews()
          setSuccessModalVisible(true) // Set success modal to be visible
          // Reset the review and rating
          setReview("")
          setRating(0)
        } else {
          // Error occurred while editing the review
          console.log("Error editing review:", data)
          setErrorModalVisible(true)
          setErrorMessage(
            data.message ||
              "An error occurred while trying to edit your review."
          )
        }
      } catch (error) {
        console.log("Error editing review:", error)
        setErrorModalVisible(true)
        setErrorMessage("An error occurred while trying to edit your review.")
      }
    } else {
      // Display error modal for unauthorized edit
      setErrorModalVisible(true)
      setErrorMessage("You are not authorized to edit this review.")
    }
  }

  // * fetch guides
  const fetchGuides = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.12:3000/api/tours/${tour._id}`
      )
      const data = await response.json()

      // Get the guides array from the tour data
      const guides = data.data.tour.guides
      console.log("all the guides", guides)
      console.log("guides", guides[0].name, guides[0].photo)

      // get each guide's name and photo from the guides array
      const guidesData = guides.map((guide) => ({
        id: guide._id,
        name: guide.name,
        photo: guide.photo,
      }))

      setGuides(guidesData)
      console.log("guidesData", guidesData)

      // * 2nd method :
      // Fetch details of the guides based on their IDs
      // const guidesData = await Promise.all(
      //   guides.map(async (guide) => {
      //     const guideResponse = await fetch(
      //       `http://192.168.1.12:3000/api/users/${guide._id}`
      //     )
      //     console.log("guidesResponse", guideResponse)
      //     const guideData = await guideResponse.json()
      //     console.log("guideData", guideData)
      //     return guideData.data.documents
      //   })
      // )
      return guidesData
    } catch (error) {
      console.log(error)
    }
    return null // if there's is an error
  }

  // * fetch locations
  const fetchLocations = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.12:3000/api/tours/${tour._id}`
      )
      const data = await response.json()

      const locations = data.data.tour.locations
      console.log("locations", locations)
      if (locations.length > 0) {
        const firstLocation = locations[0]
        console.log("First Location:", firstLocation)

        // Set the first location and initial region for the map
        setFirstLocation(firstLocation)
        setInitialRegion({
          latitude: firstLocation.coordinates[1],
          longitude: firstLocation.coordinates[0],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      } else {
        console.log("No locations found for this tour.")
        return null
      }
    } catch (error) {
      console.log("Error fetching locations:", error)
      return null
    }
  }

  // * date formatter
  const formatDate = (dateString) => {
    const datePart = dateString.split("T")[0]
    return datePart.replace(/-/g, "/")
  }

  // * rendering guides
  const renderGuides = () => {
    return guides.map((guide) => (
      <View key={guide.id} style={styles.guideItem}>
        <Image source={{ uri: guide.photo }} style={styles.guidePhoto} />
        <Text style={styles.guideName}>{`${guide.name}`}</Text>
      </View>
    ))
  }

  // *  Function to calculate the booking expenses
  const calculateBookingExpense = () => {
    // Perform your calculation based on numAdults, numChildren, numRooms, and daysDifference
    // For example, let's assume the room price is $100 per night
    const tourPrice = tour.price

    const totalGuests = numAdults + numChildren

    const totalExpense = tourPrice * totalGuests

    return { totalExpense }
  }

  // Calculate the booking expenses based on the booking details
  const bookingExpense = calculateBookingExpense()

  // * Function to handle the "Pay Now" button press
  const handlePayNow = () => {
    setPaymentModalVisible(true)
    setBookingDetails()
  }

  // * fetching and showing the map only when i click on the icon
  const handlePlaceIconPress = () => {
    setShowMap(true) // Show the map when the place icon is clicked
    fetchLocations() // Fetch locations when the place icon is clicked
  }

  // Function to check if the tour dates are within the selected start and end dates
  // Function to check if the tour dates are within the selected start and end dates
  const checkTourAvailability = () => {
    // Convert the selected start and end dates to Date objects
    const startDateParts = selectedStartDate.split("/")
    const endDateParts = selectedEndDate.split("/")

    // Construct the Date objects from the parts
    const startDateObject = new Date(
      parseInt(startDateParts[0]),
      parseInt(startDateParts[1]) - 1, // Month is 0-indexed in Date constructor
      parseInt(startDateParts[2])
    )

    const endDateObject = new Date(
      parseInt(endDateParts[0]),
      parseInt(endDateParts[1]) - 1, // Month is 0-indexed in Date constructor
      parseInt(endDateParts[2])
    )

    // Convert the tour start dates to Date objects for proper comparison
    const tourStartDates = tour.startDates.map(
      (startDate) => new Date(startDate)
    )

    // Check if any tour date falls within the selected start and end dates
    const isAvailable = tourStartDates.some(
      (date) => date >= startDateObject && date <= endDateObject
    )

    return isAvailable
  }

  // Function to handle the "Book Now" button press
  const handleBookNow = () => {
    const isAvailable = checkTourAvailability()
    if (isAvailable) {
      setBookingModalVisible(true)
    } else {
      setErrorModalVisible(true)
      setErrorMessage("Tour not available for selected dates.")
    }
  }

  // * rendering stars
  const renderRatingStars = (averageRating, ratingsQuantity) => {
    const filledStars = Math.floor(averageRating)
    const hasHalfStar = averageRating - filledStars >= 0.5

    return (
      <View style={styles.ratingContainer}>
        {[...Array(filledStars)].map((_, index) => (
          <Icon key={index} name="star" size={20} color={COLORS.orange} />
        ))}
        {hasHalfStar && (
          <Icon name="star-half" size={20} color={COLORS.orange} />
        )}
        {[...Array(5 - filledStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
          <Icon key={index} name="star-border" size={20} color={COLORS.grey} />
        ))}
        <Text style={styles.ratingCount}>({ratingsQuantity})</Text>
      </View>
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: COLORS.white,
        paddingBottom: 20,
      }}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <View style={styles.headerImage}>
        <View style={styles.header}>
          <Icon
            name="arrow-back-ios"
            size={32}
            color={COLORS.primary}
            onPress={navigation.goBack}
            style={{ top: 30 }}
          />
          <Icon
            name={isBookmarked ? "bookmark" : "bookmark-border"}
            size={32}
            color={COLORS.primary}
            onPress={toggleBookmark}
            style={{ top: 30 }}
          />
        </View>

        <Image
          source={{ uri: tour.imageCover }}
          style={styles.headerImageBackground}
        />
      </View>

      {/* //* map view */}
      <View>
        <View style={styles.iconContainer}>
          <Icon
            name="place"
            color={COLORS.white}
            size={28}
            onPress={handlePlaceIconPress} // Handle press on place icon
          />
        </View>
        {showMap && firstLocation && (
          <Modal visible={showMap} transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={initialRegion}
                  region={initialRegion}
                >
                  <Marker
                    coordinate={{
                      latitude: firstLocation.coordinates[1],
                      longitude: firstLocation.coordinates[0],
                    }}
                  />
                </MapView>
              </View>
              <TouchableOpacity
                style={styles.closeButtonContainer}
                onPress={() => setShowMap(false)}
              >
                <Icon name="close" size={28} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </Modal>
        )}
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{tour.name}</Text>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "400",
              color: COLORS.grey,
              marginTop: 5,
              top: 5,
            }}
          >
            Difficulty : {tour.difficulty}
          </Text>

          {/* // * start dates */}

          <View
            style={{
              marginTop: 10,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                lineHeight: 20,
                top: 10,
              }}
            >
              Start Dates :
            </Text>
            {tour.startDates.map((startDate, index) => (
              <Text key={index} style={{ top: 15 }}>
                {formatDate(startDate)}
              </Text>
            ))}
          </View>

          <Text style={{ lineHeight: 20, top: 25, color: COLORS.grey }}>
            {tour.summary}
          </Text>
          <View
            style={{
              marginTop: 30,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ top: 5 }}> {tour.ratingsAverage}</Text>
              {renderRatingStars(tour.ratingsAverage, tour.ratingsQuantity)}
            </View>
            <Text style={{ fontSize: 20, right: 10, color: COLORS.grey }}>
              {`Reviews: ${tour.ratingsQuantity}`}
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ lineHeight: 20, color: COLORS.grey }}>
              {tour.description}
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", right: 5 }}>
              Price for the tour:
            </Text>
            <View style={styles.priceTag}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: COLORS.grey,
                  marginLeft: 5,
                }}
              >
                ${tour.price}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: COLORS.grey,
                  marginLeft: 5,
                }}
              >
                + TRAVEL
              </Text>
            </View>
          </View>
        </View>

        {/* // * rendering guides */}
        <View style={styles.guidesContainer}>
          <Text style={styles.sectionHeaderTextGuides}>Meet Your Guides:</Text>
          {renderGuides()}
        </View>

        {/* // * tour description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderText}>What you'll get</Text>
          <View style={styles.iconsContainer}>
            <Icon
              name="wb-sunny"
              size={28}
              color={COLORS.grey}
              style={styles.icon}
            />
            <Icon
              name="tour"
              size={30}
              color={COLORS.grey}
              style={styles.icon}
            />
            <Icon
              name="follow-the-signs"
              size={30}
              color={COLORS.grey}
              style={styles.icon}
            />
          </View>
        </View>

        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionHeaderText}>Reviews</Text>
          {reviews && reviews.length > 0 ? (
            reviews.map((reviewItem) => (
              <View key={reviewItem._id} style={styles.reviewItem}>
                <Image
                  source={{ uri: reviewItem.user.photo }}
                  style={styles.reviewUserPhoto}
                />
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewUsername}>
                    {reviewItem.user.name}
                  </Text>
                  <Text style={styles.reviewText}>{reviewItem.review}</Text>
                  <View style={styles.ratingContainer}>
                    {[...Array(reviewItem.rating)].map((_, index) => (
                      <Icon
                        key={index}
                        name="star"
                        size={20}
                        color={COLORS.orange}
                      />
                    ))}
                    <View style={styles.reviewDetails}>
                      <Text style={styles.reviewDate}>
                        {/* Format the date using JavaScript's toLocaleDateString() */}
                        {new Date(reviewItem.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  {reviewItem.user._id === userReviewId && (
                    <TouchableOpacity
                      onPress={() => handleEditReview(reviewItem)}
                      style={styles.editIconContainer}
                    >
                      <Icon name="edit" size={20} color={COLORS.grey} />
                    </TouchableOpacity>
                  )}
                  {/* Add the delete icon container */}
                  {reviewItem.user._id === userReviewId &&
                    editingReviewId !== reviewItem._id && (
                      <TouchableOpacity
                        onPress={() => handleDeleteReview(reviewItem._id)}
                        style={styles.deleteIconContainer}
                      >
                        <Icon name="delete" size={20} color={COLORS.red} />
                      </TouchableOpacity>
                    )}
                </View>
              </View>
            ))
          ) : (
            <Text>No reviews available</Text>
          )}
        </View>

        <View style={styles.reviewContainer}>
          <Text style={styles.reviewLabel}>Review:</Text>
          <TextInput
            style={styles.reviewInput}
            multiline
            placeholder="Enter your review"
            value={review}
            onChangeText={setReview}
          />
          <Text style={styles.reviewLabel}>Rating:</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                activeOpacity={0.8}
                onPress={() => setRating(value)}
              >
                <Icon
                  name="star"
                  size={28}
                  color={value <= rating ? COLORS.orange : COLORS.grey}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={submitReview}
            style={styles.submitButton}
          >
            <Text style={{ color: COLORS.white, fontSize: 18 }}>
              Submit Review
            </Text>
          </TouchableOpacity>
        </View>
        {/* // * book now  */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBookNow}
          style={
            checkTourAvailability()
              ? styles.bookButton // Use green button style if available
              : styles.bookButtonNotAvailable // Use red button style if not available
          }
        >
          <Text style={styles.bookButtonText}>
            {checkTourAvailability() ? "Book Now" : "Not Available ...⏱"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for "Not Available" message */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Please select a tour within your date of stay.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.ButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Booking Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)} // Allow closing modal on Android back button press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Booking Details</Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setBookingModalVisible(false)}
              >
                <Icon
                  name="close"
                  size={28}
                  color={COLORS.dark}
                  style={{ left: 60, bottom: 20 }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Tour Price: ${tour.price}</Text>

            <Text style={styles.modalText}>
              Total Guests: {numAdults + numChildren}
            </Text>

            <Text style={styles.modalTextPrice}>
              Total Tour Price : ${bookingExpense.totalExpense}
            </Text>

            <TouchableOpacity
              style={styles.payNowButton}
              onPress={handlePayNow} //  Handle "Pay Now" button press
            >
              <Text style={styles.payNowButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Payment Success */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)} // Allow closing modal on Android back button press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment Successfully</Text>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setPaymentModalVisible(false)}
            >
              <Text style={styles.closeModalButtonPayment}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* // * favorites modal */}
      <Modal visible={isAddedModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsAddedModalVisible(false)}>
          <View style={styles.modalOverlayBookmark}>
            <View style={styles.modalContentBookmark}>
              <Icon name="check-circle" size={80} color={COLORS.primary} />
              <Text style={styles.modalTextBookmark}>Added to favorites</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal visible={isDeletedModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => setIsDeletedModalVisible(false)}
        >
          <View style={styles.modalOverlayBookmark}>
            <View style={styles.modalContentBookmark}>
              <Icon name="cancel" size={80} color={COLORS.orange} />
              <Text style={styles.modalTextBookmark}>
                Removed from favorites
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal visible={successModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setSuccessModalVisible(false)}>
          <View style={styles.modalOverlayBookmark}>
            <View style={styles.modalContent}>
              <Icon name="check-circle" size={80} color={COLORS.primary} />
              <Text style={styles.modalText}>
                Review submitted successfully!
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal visible={errorModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setErrorModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Icon name="error" size={80} color={COLORS.orange} />
              <Text style={styles.modalText}>{errorMessage}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    // marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    justifyContent: "space-between",
    zIndex: 1,
  },
  headerImage: {
    height: 400,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    overflow: "hidden",
  },
  iconContainer: {
    position: "absolute",
    height: 60,
    width: 60,
    backgroundColor: COLORS.primary,
    top: -30,
    right: 20,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingCount: {
    fontSize: 15,
    color: COLORS.grey,
    marginLeft: 5,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionHeaderTextGuides: {
    top: 5,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    left: 15,
  },
  iconsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-evenly",
  },
  icon: {
    marginHorizontal: 10,
  },
  reviewsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  reviewItem: {
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  reviewContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  reviewLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  reviewInput: {
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 200,
    alignSelf: "flex-end",
  },
  priceTag: {
    height: 50,
    alignItems: "center",
    marginLeft: 40,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: "row",
  },
  bookButton: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  bookButtonNotAvailable: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: COLORS.orange,
    marginHorizontal: 20,
    borderRadius: 10,
  },

  bookButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
  modalTextPrice: {
    fontSize: 22,
    marginTop: 20,
    textAlign: "center",
    fontFamily: "sans-serif",
    fontWeight: "bold",
  },
  modalOverlayBookmark: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    // height: 300,
  },
  modalContentBookmark: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTextBookmark: {
    top: 10,
    fontSize: 20,
    textAlign: "center",
    color: COLORS.dark,
  },
  guideItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    top: 5,
  },
  guidePhoto: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
    left: 10,
  },
  guideName: {
    fontSize: 18,
    fontWeight: "bold",
    left: 7,
  },

  editIconContainer: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 10,
    overflow: "hidden",
    width: "95%",
    aspectRatio: 1, // Adjust the aspect ratio as per your design preference
  },
  map: {
    flex: 1,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewContent: {
    marginLeft: 10,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
  modalOverlayBookmark: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentBookmark: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTextBookmark: {
    top: 10,
    fontSize: 20,
    textAlign: "center",
    color: COLORS.dark,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 5,
    right: 30,
  },
  reviewDetails: {
    marginTop: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.grey,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 10,
    width: "80%", // Adjust the width of the modal content
    maxHeight: "80%", // Adjust the maximum height of the modal content
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    left: 15,
    color: COLORS.primary,
  },
  closeModalButtonPayment: {
    top: 5,
    padding: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
  payNowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  payNowButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  closeModalButtonText: {
    fontSize: 18,
    color: COLORS.dark,
  },

  headerImageBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    top: -30,
  },
})

export default TourDetailsScreen
