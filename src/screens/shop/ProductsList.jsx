import React, { useState, useEffect } from "react"
import { FlatList, ActivityIndicator, View } from "react-native"
import ProductCard from "./ProductCard"
import { TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default function ProductsList(props) {
  const { products } = props

  console.log("products list", products)

  const navigation = useNavigation()

  if (products.length !== 0) {
    return (
      <FlatList
        data={products}
        keyExtractor={(product) => product._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProductDetails", {
                id: item._id,
                products: products,
              })
            }
          >
            <ProductCard {...item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
      />
    )
  }
}
