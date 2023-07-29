import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "../components/Icon"
import { colors, sizes } from "../constants/theme"
import { StyleSheet, Animated } from "react-native"
import HomeScreen from "../screens/HomeScreen"
import ToursScreen from "../screens/ToursScreen"
import UserScreen from "../screens/user/UserScreen"
import FavoriteRoomsScreen from "../screens/FavoriteRoomsScreen"
import Shop from "./../screens/shop/Shop"
import CartScreen from "../screens/Cart/CartScreen"

const tabs = [
  {
    name: "Home",
    screen: HomeScreen,
  },
  {
    name: "Tours",
    screen: ToursScreen,
  },
  {
    name: "Favorite",
    screen: FavoriteRoomsScreen,
  },
  {
    name: "User",
    screen: UserScreen,
  },
  {
    name: "Shop",
    screen: Shop,
  },
  {
    name: "Cart",
    screen: CartScreen,
  },
]

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  const offsetAnimation = React.useRef(new Animated.Value(0)).current
  return (
    <>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        {tabs.map(({ name, screen }, index) => {
          return (
            <Tab.Screen
              key={name}
              name={name}
              component={screen}
              options={{
                tabBarIcon: ({ focused }) => {
                  return (
                    <Icon
                      icon={name}
                      size={40}
                      style={{
                        tintColor: focused ? colors.primary : colors.gray,
                      }}
                    />
                  )
                },
              }}
              listeners={{
                focus: () => {
                  Animated.spring(offsetAnimation, {
                    toValue: index * (sizes.width / tabs.length),
                    useNativeDriver: true,
                  }).start()
                },
              }}
            />
          )
        })}
      </Tab.Navigator>
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [
              {
                translateX: offsetAnimation,
              },
            ],
          },
        ]}
      />
    </>
  )
}

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    width: 32,
    height: 4,
    left: sizes.width / tabs.length / 3 - 5,
    bottom: 45,
    backgroundColor: colors.primary,
    zIndex: 100,
  },
})

export default TabNavigation
