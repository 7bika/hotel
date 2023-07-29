import React, { createContext, useState } from "react"

const RoomContext = createContext()

const RoomProvider = ({ children }) => {
  const [favoriteRooms, setFavoriteRooms] = useState([])
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [cartItems, setCartItems] = useState([])

  const [numAdults, setNumAdults] = useState(1)
  const [numChildren, setNumChildren] = useState(0)
  const [numRooms, setNumRooms] = useState(1)
  const [daysDifference, setDaysDifference] = useState(1)
  const [selectedStartDate, setSelectedStartDate] = useState("")
  const [selectedEndDate, setSelectedEndDate] = useState("")

  // * room and tour functionalities :
  const addRoomToFavorites = (room) => {
    setFavoriteRooms([...favoriteRooms, room])
  }

  const removeRoomFromFavorites = (roomId) => {
    setFavoriteRooms(favoriteRooms.filter((room) => room.id !== roomId))
  }

  // * getting the logged in user :
  const getLoggedInUser = (user) => {
    setLoggedInUser(user)
  }

  // * cart functionalities :

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (prevItem) => prevItem._id === item._id
      )

      if (existingItem) {
        return prevItems.map((prevItem) =>
          prevItem._id === item._id
            ? { ...prevItem, quantity: prevItem.quantity + 1 }
            : prevItem
        )
      }

      return [...prevItems, { ...item, quantity: 1 }]
    })
  }
  // const addToCart = (item) => {
  //   setCartItems((prevCartItems) => [...prevCartItems, item])
  // }

  const removeFromCart = (itemToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== itemToRemove._id)
    )
  }
  // const removeFromCart = (item) => {
  //   setCartItems((prevCartItems) =>
  //     prevCartItems.filter((el) => el.id !== item.id)
  //   )
  // }

  const clearCart = () => {
    setCartItems([])
  }

  // * booking details
  const updateBookingDetails = (
    adults,
    children,
    rooms,
    daysDiff,
    selectedStartDate,
    selectedEndDate
  ) => {
    setNumAdults(adults)
    setNumChildren(children)
    setNumRooms(rooms)
    setDaysDifference(daysDiff)
    setSelectedStartDate(selectedStartDate)
    setSelectedEndDate(selectedEndDate)
  }

  const contextValue = {
    favoriteRooms,
    addRoomToFavorites,
    removeRoomFromFavorites,
    loggedInUser,
    getLoggedInUser,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    numAdults,
    numChildren,
    numRooms,
    daysDifference,
    updateBookingDetails,
    selectedStartDate,
    selectedEndDate,
  }

  return (
    <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>
  )
}

export { RoomProvider, RoomContext }
