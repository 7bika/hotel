// /* eslint-disable */
// import axios from "axios"
// import { Stripe } from "@stripe/stripe-react-native"

// const stripe = Stripe(
//   "pk_test_51NNxuZAcVvIv9aW3Io3OHpMsntQYmwqxQfeszYWguCmV9MraIaTyA3Kbp6Z34iyV0LH80lP9foRCiGOwiWtPAZHK00RnHLeeXR"
// )

// export const bookTour = async (tourId) => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(
//       `http://192.168.1.12:3000/api/bookings/checkout-session/tour/${tourId}`
//     )
//     console.log(session)

//     // 2) Create checkout form + chanre credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id,
//     })
//   } catch (err) {
//     console.log(err)
//     alert("error", err)
//   }
// }

// export const bookRoom = async (roomId) => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(
//       `http://192.168.1.12:3000/api/bookings/checkout-session/room/${roomId}`
//     )
//     console.log(session)

//     // 2) Create checkout form + chanre credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id,
//     })
//   } catch (err) {
//     console.log(err)
//     alert("error", err)
//   }
// }

// export const bookProduct = async (roomId) => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(
//       `http://192.168.1.12:3000/api/bookings/checkout-session/room/${roomId}`
//     )
//     console.log(session)

//     // 2) Create checkout form + chanre credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id,
//     })
//   } catch (err) {
//     console.log(err)
//     alert("error", err)
//   }
// }
