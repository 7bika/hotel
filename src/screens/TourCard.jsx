import React from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import COLORS from "../constants/colors"

const TourCard = ({ tour }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: tour.imageCover }} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{tour.name}</Text>
        <Text style={styles.price}>${tour.price}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={15} color={COLORS.orange} />
          <Text style={styles.ratingText}>{tour.ratingsAverage}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: cardHeight,
    width: cardWidth,
    backgroundColor: COLORS.white,
    elevation: 15,
    marginRight: 20,
    borderRadius: 15,
  },
  image: {
    height: cardHeight - 80,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.grey,
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default TourCard
