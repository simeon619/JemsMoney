import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { useRouter, useSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import PhoneNumber from "google-libphonenumber";
import { phone } from "phone";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, useColorScheme, useWindowDimensions } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Contact from "../components/Contact";
import ProofPayment from "../components/ProofPayment";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { ContactShema } from "./modal";
export type valuePassSchema = {
  pays: string;
  valid: boolean;
  agence: string;
  currency: string;
};
const makeTransaction = () => {
  let phoneUtil = PhoneNumber.PhoneNumberUtil.getInstance();
  //   const [recupValid, setRecupValid] = useState("RU");
  // let listContact = useSelector((state: RootState) => state.contact);
  const { height, width } = useWindowDimensions();
  const [user, setUser] = useState<any>(null);
  const [disabledScroll, setDisabledScroll] = useState(false);
  const [valuePass, setValuePass] = useState<valuePassSchema>({
    agence: "",
    pays: "",
    currency: "",
    valid: false,
  });
  const [page, setPage] = useState(0);
  const colorScheme = useColorScheme();
  const params = useSearchParams();
  let router = useRouter();
  // const contact : ContactShema = params
  let infoUserReceiver: ContactShema;
  const validatePhoneNumber = (phoneNumber: string) => {
    let codeError = {
      isValid: false,
      code: "ZZ",
    };
    if (!phoneNumber && Array.isArray(phoneNumber)) {
      return codeError;
    }
    let parsedNumber;
    let codeCountry;
    try {
      parsedNumber = phoneUtil.parse(phoneNumber);
      codeCountry = phoneUtil.getRegionCodeForNumber(parsedNumber);
    } catch (error) {
      return codeError;
    }

    return {
      isValid: phoneUtil.isValidNumber(parsedNumber),
      code: codeCountry,
    };
  };

  useEffect(() => {
    const getuser = () => {
      let rawNumber = (params.number as string)?.trim().replaceAll(" ", "");
      let result = validatePhoneNumber("+" + rawNumber);
      if (!result.isValid) {
        // let resultLibPhone = validatePhoneNumber(rawNumber);
        let resultPhone = phone("+" + rawNumber, { country: undefined });

        setUser({
          isValid: resultPhone.isValid,
          code: resultPhone.countryIso2,
          name: params.name,
          id: params.id,
          number: resultPhone.phoneNumber || params.number,
        });
      } else {
        let result2 = phone("+" + rawNumber, { country: undefined });
        setUser({
          isValid: result2.isValid,
          code: result2.countryIso2,
          name: params.name,
          id: params.id,
          number: result2.phoneNumber || params.number,
        });
      }
    };

    getuser();
  }, [params.number]);
  // console.log(getuser());
  const swiperRef = useRef<PagerView>(null);
  function changeTOProofPayment(val: any) {
    setDisabledScroll(true);
    swiperRef.current?.setPage(1);
    setPage(1);

    setValuePass(val);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        lightColor="#f6f7fb"
        style={{
          flex: 1,
        }}
      >
        <View
          lightColor="#f6f7fb"
          style={{
            // height: verticalScale(50),
            paddingHorizontal: horizontalScale(15),
            flexDirection: "row",
            justifyContent: "center",
            width,
            padding: verticalScale(7),
          }}
        >
          <Pressable
            onPress={() => {
              setPage(0);
              if (page === 0) {
                router.back();
              } else {
                swiperRef.current?.setPage(0);
                setPage(0);
              }
            }}
            style={{
              position: "absolute",
              left: horizontalScale(0),
              top: horizontalScale(7),
              zIndex: 99,
            }}
          >
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="arrow-left"
                color={Colors[colorScheme ?? "light"].text}
                size={28}
                style={[
                  {
                    marginLeft: horizontalScale(10),
                    opacity: pressed ? 0.5 : 1,
                    backgroundColor: "#fff",
                    borderRadius: 99,
                    padding: moderateScale(2),
                  },
                  shadow(1),
                ]}
              />
            )}
          </Pressable>
          <Text
            style={{
              fontSize: moderateScale(18),
              fontWeight: "700",
              marginTop: horizontalScale(7),
            }}
          >
            Fill info transaction
          </Text>
          {/* <View /> */}
        </View>
        <PagerView
          style={{ flex: 1 }}
          initialPage={page}
          scrollEnabled={false}
          ref={swiperRef}
        >
          {user !== null ? (
            <Contact
              key={1}
              user={user}
              changeTOProofPayment={changeTOProofPayment}
            />
          ) : (
            <View key={1}></View>
          )}
          <ProofPayment valuePass={valuePass} key={2} />
        </PagerView>
        <StatusBar style="dark" backgroundColor="#f7f8fc" />
      </View>
    </SafeAreaView>
  );
};

export default makeTransaction;
