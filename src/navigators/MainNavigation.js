import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "../components/Icon"
import { colors } from "../constants/theme"
import HomeScreen from "../screens/HomeScreen"
import ToursScreen from "../screens/ToursScreen"
import UserScreen from "../screens/user/UserScreen"
import FavoriteRoomsScreen from "../screens/FavoriteRoomsScreen"
import Shop from "../screens/shop/Shop"
import CartScreen from "../screens/Cart/CartScreen"

const Tab = createBottomTabNavigator()

const MainNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline"
              break
            case "Tours":
              iconName = focused ? "compass" : "compass-outline"
              break
            case "Favorite":
              iconName = focused ? "heart" : "heart-outline"
              break
            case "User":
              iconName = focused ? "person" : "person-outline"
              break
            case "Shop":
              iconName = focused ? "cart" : "cart-outline"
              break
            case "Cart":
              iconName = focused ? "basket" : "basket-outline"
              break
            default:
              iconName = ""
              break
          }
          return (
            <Icon
              name={iconName}
              size={24}
              color={focused ? "black" : "grey"}
            />
          )
        },
      })}
      tabBarOptions={{
        activeTintColor: "black",
        inactiveTintColor: "grey",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tours" component={ToursScreen} />
      <Tab.Screen name="Favorite" component={FavoriteRoomsScreen} />
      <Tab.Screen name="User" component={UserScreen} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  )
}

export default MainNavigation
