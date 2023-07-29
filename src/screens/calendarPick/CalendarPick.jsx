import React, { useState, useContext, useEffect } from "react"
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import DatePicker from "react-native-modern-datepicker"
import { getFormatedDate } from "react-native-modern-datepicker"
import Icon from "react-native-vector-icons/FontAwesome"
import { useNavigation } from "@react-navigation/native"
import COLORS from "../../constants/colors"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RoomContext } from "../RoomContext"

const CalendarPick = () => {
  // * getting the logged in user

  const { updateBookingDetails, LoggedInUser } = useContext(RoomContext)

  const navigation = useNavigation()

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const maxDate = new Date()
  maxDate.setDate(today.getDate() + 30)

  // * shows the calendar only for the first time
  const [showCalendar, setShowCalendar] = useState(false)

  // * other states
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false)
  const [numAdults, setNumAdults] = useState(1)
  const [numChildren, setNumChildren] = useState(0)
  const [numRooms, setNumRooms] = useState(1)
  const [selectedEndDate, setSelectedEndDate] = useState("")
  const [endedDate, setEndedDate] = useState("2023/12/12")

  useEffect(() => {
    // Check if the component should be shown for the first time
    // based on the logged-in user status
    if (!LoggedInUser && !showCalendar) {
      setShowCalendar(true)
    }
  }, [LoggedInUser])

  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY/MM/DD"
  )
  const [selectedStartDate, setSelectedStartDate] = useState("")
  const [startedDate, setStartedDate] = useState("2023/12/12")

  function handleChangeStartDate(propDate) {
    setStartedDate(propDate)
  }

  function handleChangeEndDate(propDate) {
    setEndedDate(propDate)
  }

  const handleNumChange = (type, value) => {
    if (type === "adults") {
      setNumAdults(value)
    } else if (type === "children") {
      setNumChildren(value)
    } else if (type === "rooms") {
      setNumRooms(value)
    }
  }

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker)
  }

  const handleOnPressEndDate = () => {
    setOpenEndDatePicker(!openEndDatePicker)
  }

  const handleCalculateAndSubmit = () => {
    // Check if both start date and end date are selected
    if (!selectedStartDate || !selectedEndDate) {
      alert("Please select both start date and end date.")
      return
    }

    console.log(selectedStartDate, selectedEndDate)

    // Convert selected dates to the correct format "YYYY-MM-DD"
    const formattedStartDate = selectedStartDate.replace(/\//g, "-")
    const formattedEndDate = selectedEndDate.replace(/\//g, "-")

    // Create Date objects from formatted dates
    const startDateObject = new Date(formattedStartDate)
    const endDateObject = new Date(formattedEndDate)
    console.log("start dates ", startDateObject, endDateObject)

    // Check if the start date is before or equal to the end date
    if (startDateObject > endDateObject) {
      alert("Invalid date range. Please select a valid start and end date.")
      return
    }

    const timeDifference = endDateObject.getTime() - startDateObject.getTime()
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24))
    console.log("number of days", daysDifference)

    // Check if the calculated value is valid (not NaN)
    if (isNaN(daysDifference)) {
      alert("Invalid date range. Please select valid start and end dates.")
      return
    }

    // Store the calculated values or perform other actions as needed
    console.log("Start Date:", selectedStartDate)
    console.log("End Date:", selectedEndDate)
    console.log("Number of Adults:", numAdults)
    console.log("Number of Children:", numChildren)
    console.log("Number of Rooms:", numRooms)
    console.log("Number of Days:", daysDifference)

    // If it's the first login, navigate to the TabNavigation screen

    AsyncStorage.setItem("selectedStartDate", selectedStartDate)
    AsyncStorage.setItem("selectedEndDate", selectedEndDate)

    // Update the booking details in the context
    updateBookingDetails(
      numAdults,
      numChildren,
      numRooms,
      daysDifference,
      selectedStartDate,
      selectedEndDate
    )

    navigation.navigate("TabNavigation")

    // , {
    //   startDate: selectedStartDate,
    //   endDate: selectedEndDate,
    //   numAdults,
    //   numChildren,
    //   numRooms,
    //   daysDifference,
    // })
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : ""}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.textSubHeader}>Please Pick Your Date</Text>

            {/* // * start date picker  */}
            <View
              style={{ width: "100%", paddingHorizontal: 22, marginTop: 64 }}
            >
              <View>
                <Text style={{ fontSize: 18 }}>Select Start Date</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={handleOnPressStartDate}
                >
                  <Text>{selectedStartDate}</Text>
                </TouchableOpacity>
              </View>

              {/* // * end date picker */}
              <View>
                <Text style={{ fontSize: 18, marginTop: 20 }}>
                  Select End Date
                </Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={handleOnPressEndDate}
                >
                  <Text>{selectedEndDate}</Text>
                </TouchableOpacity>
              </View>

              {/* Number of guests */}
              <View style={styles.counterSection}>
                <Text style={{ fontSize: 17, top: 5 }}>
                  Select The Number of Guests and Rooms
                </Text>
                <View style={styles.counterRow}>
                  <Text style={styles.adultLabel}>Adults</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => handleNumChange("adults", numAdults - 1)}
                    disabled={numAdults === 1}
                  >
                    <Icon name="minus" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.counterText}>{numAdults}</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => handleNumChange("adults", numAdults + 1)}
                    disabled={numAdults === 5}
                  >
                    <Icon name="plus" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.counterRow}>
                  <Text style={styles.childrenLabel}>Children</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => handleNumChange("children", numChildren - 1)}
                    disabled={numChildren === 0}
                  >
                    <Icon name="minus" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.counterText}>{numChildren}</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => handleNumChange("children", numChildren + 1)}
                    disabled={numChildren === 5}
                  >
                    <Icon name="plus" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.counterRow}>
                  <Text style={styles.label}>Rooms</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => handleNumChange("rooms", numRooms - 1)}
                    disabled={numRooms === 1}
                  >
                    <Icon name="minus" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.counterText}>{numRooms}</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => handleNumChange("rooms", numRooms + 1)}
                    disabled={numRooms === 3}
                  >
                    <Icon name="plus" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleCalculateAndSubmit}
                style={styles.submitBtn}
              >
                <Text style={{ fontSize: 20, color: "white" }}>Submit</Text>
              </TouchableOpacity>
            </View>

            {/* Create modal for start date picker */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={openStartDatePicker}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DatePicker
                    mode="calendar"
                    minimumDate={startDate}
                    selected={startedDate}
                    onDateChanged={handleChangeStartDate}
                    onSelectedChange={(date) => setSelectedStartDate(date)}
                    options={{
                      backgroundColor: "#080516",
                      textHeaderColor: "#469ab6",
                      textDefaultColor: "#FFFFFF",
                      selectedTextColor: "#FFF",
                      mainColor: "#469ab6",
                      textSecondaryColor: "#FFFFFF",
                      borderColor: "rgba(122, 146, 165, 0.1)",
                    }}
                  />

                  <TouchableOpacity onPress={handleOnPressStartDate}>
                    <Text style={{ color: "white" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Create modal for end date picker */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={openEndDatePicker}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DatePicker
                    mode="calendar"
                    minimumDate={startDate}
                    selected={endedDate}
                    onDateChanged={handleChangeEndDate}
                    onSelectedChange={(date) => setSelectedEndDate(date)}
                    options={{
                      backgroundColor: "#080516",
                      textHeaderColor: "#469ab6",
                      textDefaultColor: "#FFFFFF",
                      selectedTextColor: "#FFF",
                      mainColor: "#469ab6",
                      textSecondaryColor: "#FFFFFF",
                      borderColor: "rgba(122, 146, 165, 0.1)",
                    }}
                  />

                  <TouchableOpacity onPress={handleOnPressEndDate}>
                    <Text style={{ color: "white" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 20,
    textAlign: "center",
  },
  calendar: {
    marginBottom: 20,
  },
  dateInfoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  dateInfoText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  counterSection: {
    marginBottom: 20,
    alignSelf: "center",
    top: 5,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "center",
    top: 20,
  },
  counterButton: {
    backgroundColor: COLORS.secondary,
    padding: 5,
    borderRadius: 5,
    alignSelf: "center",
  },
  counterText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: COLORS.dark,
  },
  label: {
    fontSize: 16,
    color: COLORS.grey,
    marginRight: 15,
    alignSelf: "center",
  },
  childrenLabel: {
    fontSize: 16,
    color: COLORS.grey,
    marginRight: 6,
    alignSelf: "center",
  },
  adultLabel: {
    fontSize: 16,
    color: COLORS.grey,
    marginRight: 18,
    alignSelf: "center",
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    top: 8,
  },
  searchButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
  textHeader: {
    fontSize: 36,
    marginVertical: 60,
    color: "#111",
  },
  textSubHeader: {
    fontSize: 25,
    color: "#111",
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#222",
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "center",
    marginTop: 14,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#080516",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})

export default CalendarPick
