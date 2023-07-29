import React, { useState, useEffect, useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Logo from "./../../../assets/hote2-removebg-preview.png"
import CustomInput from "./../../screens/custom/CustomInput"
import CustomButton from "../../screens/custom/CustomButton"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Svg, Path, LinearGradient, Stop, Defs } from "react-native-svg"
// * google and fb imports
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import * as Facebook from "expo-auth-session/providers/facebook"
import * as AuthSession from "expo-auth-session"
import { ResponseType } from "expo-auth-session"
import { useNavigation } from "@react-navigation/native"
import { RoomContext } from "./../RoomContext"

WebBrowser.maybeCompleteAuthSession()

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [token, setToken] = useState("")
  const [userInfo, setUserInfo] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const modalOpacity = useState(new Animated.Value(0))[0]
  const modalScale = useState(new Animated.Value(0))[0]

  // * authcontext
  const { loggedInUser, getLoggedInUser } = useContext(RoomContext)

  // * handling google auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    expoClientSecret: "",
    responseType: ResponseType.Token,
    scopes: ["profile", "email"],
  })

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken)
      getUserInfo()
    }
  }, [response, token])

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const user = await response.json()
      console.log("USER INFO ", user)
      setUserInfo(user)

      navigation.navigate("CalendarPick")
    } catch (error) {
      alert("Something went wrong. Please try again later.")
      console.warn(error.message)
    }
  }

  // * animation when the page is first rendered
  const logoAnim = useState(new Animated.Value(0))[0]
  const formAnim = useState(new Animated.Value(0))[0]
  const buttonAnim = useState(new Animated.Value(0))[0]

  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])

  const logoTranslateY = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0],
  })

  const formTranslateY = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  })

  const buttonOpacity = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const buttonTranslateY = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  })

  // * fetching data
  const fetchData = async () => {
    if (!email || !password) {
      Alert.alert("All fields are required")
      return
    }
    try {
      setLoading(true)
      const response = await fetch("http://192.168.1.12:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      console.log("data", data)

      setLoading(false)
      if (response.status === 200) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem("token", data.token)

        // Store the logged-in user data in the state
        getLoggedInUser(data.data.user) // Assuming 'data.user' contains the user information
        console.log("user", data.data.user)

        // Show success modal
        setSuccessModalVisible(true)
        Animated.parallel([
          Animated.timing(modalOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(modalScale, {
            toValue: 1,
            friction: 6,
            tension: 50,
            useNativeDriver: true,
          }),
        ]).start()

        // Redirect to home page after a delay
        setTimeout(() => {
          setSuccessModalVisible(false)
          navigation.navigate("CalendarPick")
        }, 2000)
      } else {
        // Show error modal
        setErrorModalVisible(true)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
      setError("An error occurred during login")
    }
  }

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Svg
          width="800"
          height="100%"
          id="svg"
          viewBox="0 0 1440 690"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
              <Stop offset="5%" stopColor="#C59361" />
              <Stop offset="5%" stopColor="#0A96E7" />
            </LinearGradient>
          </Defs>
          <Path
            d="M 0,700 C 0,700 0,140 0,140 C 20.07949486677751,163.835768267704 40.15898973355502,187.67153653540802 63,190 C 85.84101026644498,192.32846346459198 111.44353593255741,173.14962212607188 139,167 C 166.5564640674426,160.85037787392812 196.0668665362154,167.72997496030436 218,174 C 239.9331334637846,180.27002503969564 254.28899792258107,185.93047803271062 275,180 C 295.7110020774189,174.06952196728938 322.7771417734602,156.5481129088531 348,146 C 373.2228582265398,135.4518870911469 396.6024349835781,131.87707033187695 421,123 C 445.3975650164219,114.12292966812306 470.8131182922273,99.94360576363911 495,99 C 519.1868817077727,98.05639423636089 542.1450918475127,110.34850661356663 568,126 C 593.8549081524873,141.65149338643337 622.606514317722,160.66236778209435 651,170 C 679.393485682278,179.33763221790565 707.4288508815987,179.00202225805597 729,166 C 750.5711491184013,152.99797774194403 765.6780821558829,127.3295431856817 787,130 C 808.3219178441171,132.6704568143183 835.8588204948703,163.6798049992172 861,162 C 886.1411795051297,160.3201950007828 908.8866358646364,125.9512368174495 936,119 C 963.1133641353636,112.0487631825505 994.5946360465839,132.51524773098487 1019,153 C 1043.405363953416,173.48475226901513 1060.7348199490277,193.987772258611 1079,187 C 1097.2651800509723,180.012227741389 1116.466084157305,145.5336632345711 1142,142 C 1167.533915842695,138.4663367654289 1199.4008434217533,165.87757480310466 1224,163 C 1248.5991565782467,160.12242519689534 1265.9305421556817,126.95603755301028 1289,123 C 1312.0694578443183,119.04396244698972 1340.8769879555196,144.2982749848542 1367,152 C 1393.1230120444804,159.7017250151458 1416.5615060222403,149.8508625075729 1440,140 C 1440,140 1440,700 1440,700 Z"
            stroke="none"
            strokeWidth="0"
            fill="url(#gradient)"
            fillOpacity="0.265"
            className="transition-all duration-300 ease-in-out delay-150 path-0"
          />
          <Path
            d="M 0,700 C 0,700 0,280 0,280 C 19.70742428182499,306.57217279739507 39.41484856364998,333.14434559479014 60,315 C 80.58515143635002,296.85565440520986 102.04803002722505,233.9947904182345 133,234 C 163.95196997277495,234.0052095817655 204.39303132744988,296.876492732272 227,324 C 249.60696867255012,351.123507267728 254.37984466297553,342.49923865267726 275,325 C 295.62015533702447,307.50076134732274 332.0875900206482,281.1265526570188 359,267 C 385.9124099793518,252.8734473429812 403.26979525443164,250.9945507192474 430,259 C 456.73020474556836,267.0054492807526 492.8332289616251,284.8952444659916 515,275 C 537.1667710383749,265.1047555340084 545.3972888990681,227.42447141678608 564,237 C 582.6027111009319,246.57552858321392 611.5776154421025,303.40686986686404 636,317 C 660.4223845578975,330.59313013313596 680.2922493325225,300.9480491157578 706,288 C 731.7077506674775,275.0519508842422 763.253387227807,278.80093367010494 794,265 C 824.746612772193,251.19906632989506 854.6942017562492,219.84821620382246 877,230 C 899.3057982437508,240.15178379617754 913.9698057471963,291.8062015146053 933,292 C 952.0301942528037,292.1937984853947 975.4265752549657,240.9269777377565 1002,235 C 1028.5734247450343,229.0730222622435 1058.3238932329402,268.4858875343687 1085,290 C 1111.6761067670598,311.5141124656313 1135.277851813273,315.12947212476854 1158,317 C 1180.722148186727,318.87052787523146 1202.5646995139678,318.99622396655684 1228,321 C 1253.4353004860322,323.00377603344316 1282.463350130855,326.8856320090039 1307,305 C 1331.536649869145,283.1143679909961 1351.5818999626129,235.46124799742742 1373,227 C 1394.4181000373871,218.53875200257258 1417.2090500186937,249.26937600128628 1440,280 C 1440,280 1440,700 1440,700 Z"
            stroke="none"
            strokeWidth="0"
            fill="url(#gradient)"
            fillOpacity="0.4"
            className="transition-all duration-300 ease-in-out delay-150 path-1"
          />
          <Path
            d="M 0,700 C 0,700 0,420 0,420 C 30.337932463809715,423.91254941986995 60.67586492761943,427.82509883973984 83,417 C 105.32413507238057,406.17490116026016 119.63447275333198,380.6121540609107 142,391 C 164.36552724666802,401.3878459390893 194.78624405905256,447.72628491661715 219,438 C 243.21375594094744,428.27371508338285 261.2205510104577,362.4827062726206 286,370 C 310.7794489895423,377.5172937273794 342.33155189911645,458.3428899929007 369,471 C 395.66844810088355,483.6571100070993 417.45324139307644,428.14573375577646 439,417 C 460.54675860692356,405.85426624422354 481.8554825285777,439.07417498399326 503,439 C 524.1445174714223,438.92582501600674 545.1248284926127,405.5575663082505 570,404 C 594.8751715073873,402.4424336917495 623.6452035009713,432.69555978300497 645,426 C 666.3547964990287,419.30444021699503 680.2943575035026,375.66019455972935 707,376 C 733.7056424964974,376.33980544027065 773.1773664850185,420.66366197807764 803,439 C 832.8226335149815,457.33633802192236 852.9961765564235,449.6851575279599 870,451 C 887.0038234435765,452.3148424720401 900.8379272892871,462.5957079100827 924,465 C 947.1620727107129,467.4042920899173 979.6521142864287,461.93201083170925 1009,440 C 1038.3478857135713,418.06798916829075 1064.5536155649984,379.67624876308014 1088,376 C 1111.4463844350016,372.32375123691986 1132.1334234535777,403.36299411597025 1154,415 C 1175.8665765464223,426.63700588402975 1198.9126906206905,418.87177477303885 1226,411 C 1253.0873093793095,403.12822522696115 1284.21581406366,395.1499067918741 1306,400 C 1327.78418593634,404.8500932081259 1340.2240531246684,422.5285980594645 1361,428 C 1381.7759468753316,433.4714019405355 1410.8879734376658,426.73570097026777 1440,420 C 1440,420 1440,700 1440,700 Z"
            stroke="none"
            strokeWidth="0"
            fill="url(#gradient)"
            fillOpacity="0.53"
            className="transition-all duration-300 ease-in-out delay-150 path-2"
          />
          <Path
            d="M 0,700 C 0,700 0,560 0,560 C 19.942632141359603,536.126947355117 39.885264282719206,512.2538947102338 66,526 C 92.1147357172808,539.7461052897662 124.40157501048276,591.1113685141817 151,609 C 177.59842498951724,626.8886314858183 198.50843567534977,611.3006312330392 216,583 C 233.49156432465023,554.6993687669608 247.56468228811832,513.686106553662 274,517 C 300.4353177118817,520.313893446338 339.2328351721769,567.9549425523134 370,593 C 400.7671648278231,618.0450574476866 423.503977023174,620.494123237085 443,607 C 462.496022976826,593.505876762915 478.7512567351273,564.068564499347 502,561 C 525.2487432648727,557.931435500653 555.4909960363168,581.2316187655271 581,572 C 606.5090039636832,562.7683812344729 627.284759119605,521.004960438545 649,525 C 670.715240880395,528.995039561455 693.3699674852627,578.748539480293 718,577 C 742.6300325147373,575.251460519707 769.2353709393443,522.0008816402834 795,518 C 820.7646290606557,513.9991183597166 845.6885487573599,559.2479339585735 869,575 C 892.3114512426401,590.7520660414265 914.0104340312159,577.0073825254224 936,569 C 957.9895659687841,560.9926174745776 980.2697151177761,558.722535939737 1003,551 C 1025.730284882224,543.277464060263 1048.9107054976794,530.1024737156293 1074,525 C 1099.0892945023206,519.8975262843707 1126.0874628915058,522.8675691977456 1152,536 C 1177.9125371084942,549.1324308022544 1202.7394429362976,572.4272494933878 1227,571 C 1251.2605570637024,569.5727505066122 1274.9547653633047,543.4234328287032 1298,528 C 1321.0452346366953,512.5765671712968 1343.4414956104843,507.879019191799 1367,515 C 1390.5585043895157,522.120980808201 1415.2792521947579,541.0604904041005 1440,560 C 1440,560 1440,700 1440,700 Z"
            stroke="none"
            strokeWidth="0"
            fill="url(#gradient)"
            fillOpacity="1"
            className="transition-all duration-300 ease-in-out delay-150 path-3"
          />
        </Svg>

        <View style={styles.overlay} />
      </View>

      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ translateY: logoTranslateY }] },
        ]}
      >
        <Image style={styles.logo} source={Logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View
        style={[
          styles.formContainer,
          { transform: [{ translateY: formTranslateY }] },
        ]}
      >
        <Text style={styles.title}>Let's Start By Logging In</Text>

        <CustomInput
          icon="mail-outline"
          placeholder="Email"
          value={email}
          setValue={setEmail}
        />

        <CustomInput
          style={{}}
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
        />

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            },
          ]}
        >
          <CustomButton title="Sign In" loading={loading} onPress={fetchData} />
        </Animated.View>

        <TouchableOpacity
          style={{ top: 8, alignSelf: "center" }}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPassword}>
            Forgot your password? Click here to reset it
          </Text>
        </TouchableOpacity>

        {/* //*  calendar pick  */}
        <TouchableOpacity
          style={{ top: 8, alignSelf: "center" }}
          onPress={() => navigation.navigate("CalendarPick")}
        >
          <Text style={styles.forgotPassword}>calendar pick</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="small" color="#000" />}

        <Modal
          visible={errorModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setErrorModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setErrorModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, styles.errorModal]}>
                  <Ionicons
                    name="close"
                    size={24}
                    color="#fff"
                    style={styles.closeButton}
                    onPress={() => setErrorModalVisible(false)}
                  />
                  <Text style={styles.errorModalText}>
                    Please verify your email or password
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={successModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSuccessModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setSuccessModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Animated.View
                style={[
                  styles.modalContent,
                  styles.successModal,
                  {
                    opacity: modalOpacity,
                    transform: [{ scale: modalScale }],
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={80}
                  color="#fff"
                  style={{ marginBottom: 20 }}
                />
                <Text style={styles.successModalText}>Login Successful</Text>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Text style={styles.signup}>
          Not yet registered?
          <TouchableOpacity
            style={{ left: 50, margin: 25 }}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={{ color: "#C59361", fontWeight: "bold" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </Text>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            onPress={() => {
              promptAsync()
            }}
            style={[styles.socialButton, { backgroundColor: "#AF6C6C" }]}
            disabled={!request}
          >
            <Ionicons name="logo-google" size={24} color="#fff" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              promptAsync()
            }}
            style={[styles.socialButton, { backgroundColor: "#0A96E7" }]}
            disabled={!request}
          >
            <Ionicons name="logo-facebook" size={24} color="#fff" />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FA",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    flex: 2,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    elevation: 5,
  },
  logo: {
    height: "140%",
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  signup: {
    top: 10,
    fontSize: 17,
    textAlign: "center",
    marginTop: 15,
    fontStyle: "normal",
    fontWeight: "bold",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D88F8F",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    top: 25,
  },
  socialButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 40,
    alignItems: "center",
  },
  errorModal: {
    backgroundColor: "#FF6969",
  },
  successModal: {
    backgroundColor: "#68D391",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 2,
  },
  errorModalText: {
    top: 5,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  successModalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#fff",
  },
  buttonContainer: {
    marginTop: 10,
  },
  forgotPassword: {
    fontSize: 12,
    marginTop: 10,
    color: "#000",
    textDecorationLine: "underline",
  },
})

export default Login
