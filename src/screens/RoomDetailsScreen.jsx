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
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import COLORS from "./../constants/colors"
import { RoomContext } from "./RoomContext"

const RoomDetailsScreen = ({ navigation, route }) => {
  const { room } = route.params
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

  // State variables for booking modal
  const [bookingModalVisible, setBookingModalVisible] = useState(false)

  // State variables for payment modal
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)

  const {
    favoriteRooms,
    addRoomToFavorites,
    removeRoomFromFavorites,
    numAdults,
    numChildren,
    numRooms,
    daysDifference,
  } = useContext(RoomContext)

  const isBookmarked = favoriteRooms.some((favRoom) => favRoom.id === room.id)

  // * getting the logged in user
  const { loggedInUser } = useContext(RoomContext)
  console.log("LoggedInUser", loggedInUser)

  // * fetching reviews
  useEffect(() => {
    fetchReviews()
  }, [])

  // * submitting the reviews
  const submitReview = async () => {
    if (review && rating > 0) {
      try {
        const response = await fetch(
          `http://192.168.1.12:3000/api/rooms/${room.id}/reviews`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ review, rating }),
          }
        )
        const data = await response.json()
        console.log("Review submitted:", data)
        if (response.ok) {
          const reviewId = data.data.review._id // Extract the review ID
          console.log("Review ID:", reviewId)
          const userId = data.data.review.user // Extract the user ID
          console.log("User ID:", userId)

          setUserReviewId(userId)
          setSuccessModalVisible(true)
          // Fetch reviews again to update the list
          fetchReviews()
          // Reset the review and rating
          setReview("")
          setRating(0)
        } else {
          console.log("Error submitting review:", data)
          setErrorModalVisible(true)
          setErrorMessage(data.message)
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
        `http://192.168.1.12:3000/api/rooms/${room.id}/reviews`
      )
      const data = await response.json()
      console.log("data", data)
      setReviews(data.data.documents)

      // Find the user's review in the list and set the userReviewId
      const userReview = data.data.documents.find(
        (reviewItem) => reviewItem.user === userReviewId
      )
      if (userReview) {
        setUserReviewId(userReview._id)
      }
    } catch (error) {
      console.log(error)
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
      removeRoomFromFavorites(room.id)
      setIsDeletedModalVisible(true)
    } else {
      addRoomToFavorites(room)
      setIsAddedModalVisible(true)
    }
  }

  // * Function to handle editing a review
  const handleEditReview = async (reviewItem) => {
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
      setUserReviewId(reviewItem._id)

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

  // *  Function to calculate the booking expenses
  const calculateBookingExpense = () => {
    // Perform your calculation based on numAdults, numChildren, numRooms, and daysDifference
    // For example, let's assume the room price is $100 per night
    const roomPricePerNight = room.price
    const totalNights = daysDifference
    const totalGuests = numAdults + numChildren
    const totalRooms = numRooms

    const totalRoomExpense = roomPricePerNight * totalNights * totalRooms
    const totalGuestExpense = roomPricePerNight * totalNights * totalGuests

    return { totalRoomExpense, totalGuestExpense }
  }

  // Calculate the booking expenses based on the booking details
  const bookingExpense = calculateBookingExpense()

  // * Function to handle the "Pay Now" button press
  const handlePayNow = () => {
    setPaymentModalVisible(true)
  }

  // Function to handle the "Book Now" button press
  const handleBookNow = () => {
    setBookingModalVisible(true)
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
      <ImageBackground style={styles.headerImage} source={room.image}>
        <View style={styles.header}>
          <Icon
            name="arrow-back-ios"
            size={28}
            color={COLORS.primary}
            onPress={navigation.goBack}
          />
          <Icon
            name={isBookmarked ? "bookmark" : "bookmark-border"}
            size={28}
            color={COLORS.primary}
            onPress={toggleBookmark}
          />
        </View>
      </ImageBackground>
      <View>
        <View style={styles.iconContainer}>
          <Icon name="place" color={COLORS.white} size={28} />
        </View>
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{room.name}</Text>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "400",
              color: COLORS.grey,
              marginTop: 5,
              top: 5,
            }}
          >
            {room.type}
          </Text>
          <Text style={{ lineHeight: 20, top: 5, color: COLORS.grey }}>
            {room.summary}
          </Text>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ top: 5 }}> {room.ratingsAverage}</Text>
              {renderRatingStars(room.ratingsAverage, room.ratingsQuantity)}
            </View>
            <Text style={{ fontSize: 20, right: 10, color: COLORS.grey }}>
              {`Reviews: ${room.ratingsQuantity}`}
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ lineHeight: 20, color: COLORS.grey }}>
              {room.description}
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Price per night:
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
                ${room.price}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: COLORS.grey,
                  marginLeft: 5,
                }}
              >
                + BREAKFAST
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderText}>What you'll get</Text>
          <View style={styles.iconsContainer}>
            <Icon
              name="wifi"
              size={28}
              color={COLORS.grey}
              style={styles.icon}
            />
            <Icon name="tv" size={28} color={COLORS.grey} style={styles.icon} />
            <Icon
              name="emoji-food-beverage"
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
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setBookingModalVisible(true)} // Correctly call setBookingModalVisible
        >
          <Text
            style={{ color: COLORS.white, fontSize: 18, fontWeight: "bold" }}
          >
            Book Now
          </Text>
        </TouchableOpacity>

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
              <Text style={styles.modalText}>
                Room Price Per Night: ${room.price}
              </Text>

              <Text style={styles.modalText}>
                Total Nights: {daysDifference}
              </Text>
              <Text style={styles.modalText}>
                Total Guests: {numAdults + numChildren}
              </Text>
              <Text style={styles.modalText}>Total Rooms: {numRooms}</Text>
              <Text style={styles.modalText}>
                Room Price Per Night: ${bookingExpense.totalRoomExpense}
              </Text>
              <Text style={styles.modalTextPrice}>
                Total Price: ${bookingExpense.totalGuestExpense}
              </Text>
              <TouchableOpacity
                style={styles.payNowButton}
                onPress={handlePayNow}
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
      </View>

      {/* // * modal for the add to addRoomToFavorites  */}
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
  btn: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    borderRadius: 10,
  },

  header: {
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    justifyContent: "space-between",
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
    flexDirection: "row",
    marginBottom: 10,
  },
  reviewUserPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewContent: {
    marginLeft: 10,
    flex: 1,
  },
  reviewUsername: {
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editIconContainer: {
    position: "absolute",
    top: 5,
    right: 5,
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
    top: 5,
    fontSize: 22,
    marginTop: 20,
    textAlign: "center",
    fontFamily: "sans-serif-medium",
    fontWeight: "bold",
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
})

export default RoomDetailsScreen
