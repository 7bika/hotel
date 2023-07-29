import * as React from "react"
import { View, Text, Pressable, Image, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { useColorScheme } from "nativewind"
import { useNavigation } from "@react-navigation/native"
import COLORS from "../../constants/colors"

const primary = COLORS.primary

export default function ProductCard({ ...item }) {
  const { summary, name, imageCover, categories, price, id } = {
    ...item,
  }

  const [count, setCount] = React.useState(1)
  const { colorScheme } = useColorScheme()

  const navigation = useNavigation()

  if (count < 0) {
    setCount(0)
  }

  return (
    <View className={"w-full bg-white dark:bg-gray-50/10 rounded-3xl p-5 my-5"}>
      <View className="bg-white rounded-xl">
        <Image
          source={{ uri: imageCover }}
          className={"w-full h-72"}
          style={{ resizeMode: "contain" }}
        />
      </View>
      <View className="mt-5">
        <Text className={"text-sm text-black/60 dark:text-white/70"}>
          CATEGORY : {categories}
        </Text>
        <Text className={"text-lg font-semibold dark:text-white"}>{name}</Text>
        <View className={"flex-row justify-between items-center my-3"}>
          <View className={"flex-row items-center gap-3"}>
            <AntDesign
              name="minuscircleo"
              size={24}
              color={colorScheme === "light" ? "black" : "white"}
              onPress={() => setCount(count - 1)}
            />
            <Text className={"text-xl dark:text-white"}>{count}</Text>
            <AntDesign
              name="pluscircleo"
              size={24}
              color={colorScheme === "light" ? "black" : "white"}
              onPress={() => setCount(count + 1)}
            />
          </View>
          <Text className={"text-2xl font-extrabold dark:text-white"}>
            ${price * count}
          </Text>
        </View>
        <Text
          numberOfLines={2}
          className={"text-sm text-black/60 dark:text-white/70"}
        >
          {summary}
        </Text>
        <View
          // onPress={() => navigation.navigate("ProductDetails", { id, ...item })}
          className="flex-row justify-center rounded-full bg-black/90 dark:bg-white/90 p-3 w-10/12 self-center mt-5"
        >
          <Text className="text-white dark:text-black font-bold">
            More Details
          </Text>
        </View>
      </View>
    </View>
  )
}
