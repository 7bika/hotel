import React, { useState, useRef, useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native"
import { useColorScheme } from "nativewind"
import { Camera } from "expo-camera"
import { BarCodeScanner } from "expo-barcode-scanner"
import ProductsList from "./ProductsList"
import { useNavigation } from "@react-navigation/native"
import { Picker } from "@react-native-picker/picker"
import { Ionicons } from "@expo/vector-icons"

export default function Shop() {
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const navigation = useNavigation()

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  const [searchKeyword, setSearchKeyword] = useState("")
  const [filterCriteria, setFilterCriteria] = useState("")

  const [minPrice, setMinPrice] = useState("") // New state for minimum price
  const [maxPrice, setMaxPrice] = useState("") // New state for maximum price

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // New state variable for showing incomplete price modal
  const [showIncompletePriceModal, setShowIncompletePriceModal] =
    useState(false)

  // * fetch all of the products with search functionality
  useEffect(() => {
    fetchProducts()
  }, [searchKeyword, filterCriteria, minPrice, maxPrice])

  console.log("all the products", products)

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === "granted")
    }

    getBarCodeScannerPermissions()
  }, [])

  // * fetching products :
  const fetchProducts = async () => {
    try {
      let apiUrl = "http://192.168.1.12:3000/api/products"

      const params = []
      if (searchKeyword) {
        params.push(`name=${encodeURIComponent(searchKeyword)}`)
      }

      if (filterCriteria) {
        params.push(`categories=${encodeURIComponent(filterCriteria)}`)
      }

      if (minPrice && !isNaN(minPrice)) {
        params.push(`price[gte]=${encodeURIComponent(minPrice)}`)
      }

      if (maxPrice && !isNaN(maxPrice)) {
        params.push(`price[lte]=${encodeURIComponent(maxPrice)}`)
      }

      if (params.length > 0) {
        apiUrl += "?" + params.join("&")
      }

      const response = await fetch(apiUrl)
      const data = await response.json()
      setProducts(data.data.documents)
      console.log("products", products)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="black" />
      </View>
    )
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    alert(`Bar code with type ${type} and data ${data} has been scanned!`)
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-200 dark:bg-black">
      <View className={"flex-row w-full gap-5"}>
        <Text className="dark:text-white text-2xl font-bold top-2">
          All Products
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={colorScheme === "dark" ? "#f5dd4b" : "#f4f3f4"}
          value={colorScheme === "dark"}
          onChange={toggleColorScheme}
        />
      </View>

      {/* // * search input  */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
      </View>

      {/* // * filtering  */}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={filterCriteria}
          onValueChange={(itemValue) => setFilterCriteria(itemValue)}
        >
          <Picker.Item label="All Categories" value="" />
          <Picker.Item label="entertainment" value="entertainment" />
          <Picker.Item label="clothes" value="clothes" />
          <Picker.Item label="Technology" value="Technology" />
          <Picker.Item
            label="Personal Care Items"
            value="Personal Care Items"
          />
          <Picker.Item label="Souvenirs" value="Souvenirs" />
        </Picker>
      </View>

      {/* // * Price filtering */}
      <View style={styles.priceFilterContainer}>
        <TextInput
          style={styles.priceFilterInput}
          placeholder="Min Price"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={(text) => setMinPrice(text)}
        />
        <Text style={styles.priceFilterText}>to</Text>
        <TextInput
          style={styles.priceFilterInput}
          placeholder="Max Price"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={(text) => setMaxPrice(text)}
        />
      </View>

      {/* // * Filter button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => {
          if (minPrice === "" || maxPrice === "") {
            setShowIncompletePriceModal(true)
          } else {
            setIsLoading(true)
            // Fetch products based on the provided filters
            fetchProducts().then(() => setIsLoading(false))
          }
        }}
      >
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      {/* // * all of the products */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <ProductsList products={products} />
      )}

      {/* // * incomplete price modal */}
      <Modal
        visible={showIncompletePriceModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Please enter both Min Price and Max Price.
            </Text>
            <TouchableOpacity
              onPress={() => setShowIncompletePriceModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* // * camera  */}
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate("Camera")}
      >
        <Image
          style={styles.cameraLogo}
          source={require("./../../../assets/Camera-Logo.png")}
        />
      </TouchableOpacity>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  cameraButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraLogo: {
    width: 30,
    height: 30,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  capturedPhoto: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
    width: "80%",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterContainer: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: "80%",
  },
  // Styles for price filter
  priceFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: "80%",
  },
  priceFilterInput: {
    flex: 1,
    marginLeft: 50,
    fontSize: 17,
  },
  priceFilterText: {
    fontSize: 17,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  priceFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: "80%",
  },
  priceFilterInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  priceFilterText: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  filterButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    width: "80%",
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Modal styles
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
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
})
