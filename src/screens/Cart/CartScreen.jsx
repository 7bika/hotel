import React, { useState, useContext } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native"
import { AntDesign } from "@expo/vector-icons"
import COLORS from "./../../constants/colors"
import { RoomContext } from "../RoomContext"

const CartItem = ({ item, onDelete }) => {
  return (
    <View style={styles.cartItem}>
      {/* Display item details */}
      <Text style={styles.cartItemText}>{item.name}</Text>
      <Text style={styles.cartItemText}>Price: ${item.price.toFixed(2)}</Text>
      <Text style={styles.cartItemText}>Quantity: {item.count}</Text>
      {/* Delete Icon */}
      <TouchableOpacity
        onPress={() => onDelete(item)}
        style={styles.deleteButton}
      >
        <AntDesign name="close" size={20} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const CartScreen = () => {
  const { cartItems, clearCart, removeFromCart } = useContext(RoomContext)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)
  const [limitPrice, setLimitPrice] = useState(null)
  const [showLimitExceededModal, setShowLimitExceededModal] = useState(false)
  const [showPriceSavedModal, setShowPriceSavedModal] = useState(false)

  const renderCartItem = ({ item }) => (
    <CartItem item={item} onDelete={removeCartItem} />
  )

  // Calculate total price of items in cart
  const total = cartItems.reduce(
    (total, item) => total + item.price * item.count,
    0
  )

  // Check if the total price exceeds the limit price
  const isExceededLimit = total > limitPrice

  const handleDelete = (item) => {
    removeFromCart(item)
  }

  const removeCartItem = (item) => {
    setItemToRemove(item)
    setShowRemoveModal(true)
  }

  const closeRemoveModal = (removeItem) => {
    setShowRemoveModal(false)
    if (removeItem) {
      removeFromCart(itemToRemove)
    }
  }

  const handleSavePriceLimit = () => {
    if (limitPrice !== null && limitPrice > 0) {
      // Save the price limit
      console.log("Price limit saved:", limitPrice)
    }
  }

  const handlePay = () => {
    if (!isExceededLimit) {
      if (limitPrice !== null && limitPrice > 0) {
        // Perform the payment action here
        console.log("Payment success!")
      } else {
        // Display an error modal for invalid price limit
        setShowLimitExceededModal(true)
      }
    }
  }

  const handleSaveAndShowModal = () => {
    handleSavePriceLimit()
    setShowPriceSavedModal(true)
  }

  const handleDeletePriceLimit = () => {
    // Delete the price limit
    setLimitPrice(null)
  }

  return (
    <View style={styles.container}>
      {/* Price Limit Input */}
      <View style={styles.priceLimitContainer}>
        <TextInput
          style={[styles.priceInput, styles.priceInputText]}
          placeholder="Enter Price Limit"
          keyboardType="numeric"
          value={limitPrice?.toString() || ""}
          onChangeText={(text) => setLimitPrice(parseFloat(text) || null)}
        />
        {limitPrice !== null && limitPrice <= 0 && (
          <Text style={styles.errorText}>
            Price limit must be higher than 0
          </Text>
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "grey" }]}
            onPress={handleSaveAndShowModal}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: COLORS.dark, marginLeft: 8 },
            ]}
            onPress={handleDeletePriceLimit}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* // * all items  */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CartItem item={item} onDelete={handleDelete} />
        )}
      />
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setShowClearModal(true)}
        >
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
      )}

      {/* Clear Cart Modal */}
      <Modal
        visible={showClearModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClearModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Delete all the items?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                onPress={() => setShowClearModal(false)}
                style={[styles.modalButton, styles.modalButtonCancel]}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  clearCart()
                  setShowClearModal(false)
                }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Total Price */}
      <View
        style={[
          styles.totalContainer,
          limitPrice !== null &&
            total > limitPrice &&
            styles.exceededTotalContainer,
        ]}
      >
        <Text
          style={[
            styles.totalText,
            limitPrice !== null &&
              total > limitPrice &&
              styles.exceededTotalText,
          ]}
        >
          Total: ${total.toFixed(2)}
        </Text>
      </View>

      {/* Pay Button */}
      {limitPrice === null || limitPrice === 0 || total <= limitPrice ? (
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.limitExceededContainer}>
          <Text style={styles.limitExceededText}>Exceeded Limit</Text>
        </View>
      )}

      {/* Price Limit Exceeded Modal */}
      <Modal
        visible={showLimitExceededModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLimitExceededModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Price limit exceeded!</Text>
            <TouchableOpacity
              onPress={() => setShowLimitExceededModal(false)}
              style={[styles.modalButton, styles.modalButtonOK]}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Price Saved */}
      <Modal
        visible={showPriceSavedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPriceSavedModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Price Limit Saved:</Text>
            <Text style={styles.savedPriceText}>${limitPrice}</Text>
            <TouchableOpacity
              onPress={() => setShowPriceSavedModal(false)}
              style={[styles.modalButton, styles.modalButtonOK]}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  cartItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cartItemText: {
    fontSize: 20,
    marginBottom: 5,
  },
  deleteButton: {
    padding: 5,
    left: 340,
    bottom: 90,
  },
  clearButton: {
    bottom: 7,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    height: 150,
    width: "70%",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    width: 100,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "gray",
    marginRight: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  totalContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "gray",
    alignItems: "flex-end",
  },
  totalText: {
    fontSize: 23,
    fontWeight: "bold",
  },
  cartItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    // flexDirection: "row",
    justifyContent: "space-between",
  },
  cartItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  // limitPrice
  // limitPrice
  priceLimitContainer: {
    paddingVertical: 10,
  },
  priceInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  priceInputText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },

  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  exceededTotalContainer: {
    backgroundColor: "red",
  },
  exceededTotalText: {
    color: "white",
  },
  limitExceededContainer: {
    backgroundColor: "red",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  limitExceededText: {
    color: "white",
    fontWeight: "bold",
  },
  payButton: {
    backgroundColor: COLORS.dark,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  payButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    width: 100,
    alignItems: "center",
  },
  modalButtonOK: {
    backgroundColor: "green",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  // button save
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
})

export default CartScreen
