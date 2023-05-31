import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";

import { Entypo } from "@expo/vector-icons";
import getSymbolFromCurrency from "currency-symbol-map";
import phone from "phone";
import { MagicModalPortal, magicModal } from "react-native-magic-modal";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../constants/Colors";
import { normeFormat } from "../fonctionUtilitaire/data";
import { formatAmount } from "../fonctionUtilitaire/formatAmount";
import { TransactionServer } from "../fonctionUtilitaire/type";
import { AppDispatch, RootState } from "../store";
import { Agency } from "../store/country/countrySlice";
import { updateTransaction } from "../store/transaction/transactionSlice";
import { MonoText } from "./StyledText";
import { ScrollView, Text, View } from "./Themed";

const Contact = ({
  user,
  changeTOProofPayment,
  changeFrame,
  transactionId,
  dataSavedTransaction,
}: {
  user: {
    isValid: boolean;
    code: string;
    name: string;
    id: string;
    number: string;
  };
  changeTOProofPayment: (
    sum: string,
    page: number,
    agence: Agency,
    currentCurrency: string,
    senderFile?: string
  ) => void;
  transactionId: string;
  dataSavedTransaction: TransactionServer | undefined;
  changeFrame: (page: number) => void;
}) => {
  const country = useSelector((state: RootState) => state.country);
  const { rates, serviceCharge } = useSelector(
    (state: RootState) => state.entreprise
  );
  const colorSheme = useColorScheme();
  const [countryId, setCountryId] = useState<string>("");
  const [currencyReceiver, setCurrencyReceiver] = useState<string>(
    country[""]?.currency
  );
  const [currentCurrency, setCurrentCurrency] = useState<string>("XOF");

  const [amount, setAmount] = useState<string>("0");
  const [name, setName] = useState<string>(user?.name);
  const [valid, setValid] = useState<boolean>(Boolean(user?.isValid));
  const [change, setChange] = useState<number>(
    rates[currentCurrency + "to" + country[""]?.currency]
  );
  const [cardSb, setCardSb] = useState<string>("");
  const [service, setService] = useState<Agency[]>();
  const [fee, setFee] = useState<number>(0.05);
  const [agence, setAgence] = useState<Agency>();
  const [number, setNumber] = useState<string>(() => {
    let number = user?.number?.replaceAll(" ", "");
    return number;
  });
  let montant = parseFloat(amount) * (change || 1);
  console.log({ dataSavedTransaction }, "OLOLLOLO");

  let taxes = (fee * montant) / 100;
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setCountryId(dataSavedTransaction?.country || "");

    setCurrencyReceiver(country[dataSavedTransaction?.country || ""]?.currency);
    setFee(
      serviceCharge +
        (country[dataSavedTransaction?.country || ""]?.charge || 0) +
        (agence?.charge || 0)
    );
    setAmount(
      dataSavedTransaction?.sum ? String(dataSavedTransaction?.sum) : "0"
    );
    setName(dataSavedTransaction?.receiverName || user?.name);
    setValid(Boolean(user?.isValid));
    setChange(
      rates[
        currentCurrency +
          "to" +
          country[dataSavedTransaction?.country || ""]?.currency
      ]
    );
    setCardSb(dataSavedTransaction?.country || "");

    let number =
      dataSavedTransaction?.telephone || user?.number?.replaceAll(" ", "");
    const indicatifLength =
      country[dataSavedTransaction?.country || ""]?.indicatif?.length ||
      user?.code?.length;

    if (number) {
      number = number.slice(indicatifLength);
    } else {
      number = user?.number?.replaceAll(" ", "");
    }
    if (user?.code) {
      Object.keys(country).forEach((id) => {
        if (country[id].indicatif === user?.code) {
          setCountryId(id);
        }
      });
    }

    setNumber(number);
  }, [
    dataSavedTransaction,
    country,
    rates,
    // currentCurrency,
    normeFormat,
    user,
  ]);

  useEffect(() => {
    setCurrencyReceiver(country[countryId]?.currency);
    // setFee(
    //   +country[countryId]?.charge +
    //     +serviceCharge +
    //     +country[countryId]?.agency[0]?.charge
    // );
  }, [countryId]);

  useEffect(() => {
    let validnumber = country[countryId]?.indicatif
      ? country[countryId]?.indicatif + number
      : user.code + number;
    let resultPhone = phone(validnumber, { country: undefined });
    setValid(resultPhone.isValid);
    setAgence(undefined);

    setService(country[countryId]?.agency);
    country[countryId]?.agency.forEach((agence) => {
      if (agence.id === dataSavedTransaction?.agence) {
        setAgence(agence);
      }
    });
  }, [countryId, number]);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      if (agence && dataSavedTransaction?.senderFile) {
        isFirstMount.current = false;
        const timer = setTimeout(() => {
          changeTOProofPayment(
            String(dataSavedTransaction.sum),
            2,
            agence,
            currentCurrency,
            dataSavedTransaction.senderFile
          );
        });
        return () => {
          clearTimeout(timer);
          isFirstMount.current = true;
        };
      }
    }
  }, [agence, dataSavedTransaction?.senderFile]);

  useEffect(() => {
    setChange(rates[currentCurrency + "to" + currencyReceiver]);
  }, [currencyReceiver, currentCurrency]);
  const ServiceModal = () => {
    const renderItem = ({ item }: { item: Agency }) => {
      //@ts-ignore
      // item.
      return (
        <TouchableOpacity
          onPress={() => {
            magicModal.hide(<ServiceModal />);
            setAgence(item);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: moderateScale(10),
          }}
        >
          <MonoText
            style={{
              fontSize: moderateScale(20),
              textAlign: "left",
              paddingVertical: verticalScale(10),
            }}
          >
            {item?.name}
          </MonoText>
          <Image
            source={item?.icon}
            contentFit="contain"
            style={{
              width: horizontalScale(60),
              aspectRatio: 1,
              // marginRight: 5,
              // paddingVertical: moderateScale(15),
            }}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          data={service}
          //@ts-ignore
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };
  const ChangeCurrentcurency = () => {
    const change = new Set<string>();

    Object.keys(rates).forEach((rateKey) => {
      const currencyCode = rateKey.substring(0, 3);
      change.add(currencyCode);
    });
    const renderItem = ({ item }: { item: string }) => {
      console.log("🚀 ~ file: Contact.tsx:237 ~ renderItem ~ item:", item);
      //@ts-ignore
      // item.
      return (
        <TouchableOpacity
          onPress={() => {
            setCurrentCurrency(item);
            magicModal.hide();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            // gap: moderateScale(5),
          }}
        >
          <MonoText
            style={{
              fontSize: moderateScale(20),
              textAlign: "left",
              paddingVertical: verticalScale(10),
            }}
          >
            {item} - {getSymbolFromCurrency(item)}
          </MonoText>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          data={[...change]}
          //@ts-ignore
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      </View>
    );
  };
  const ResponseModal = () => {
    const renderItem = ({ item }: { item: any }) => {
      const countr = country[item];
      if (!countr?.name) {
        return <></>;
      }
      return (
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            setCountryId(country[item]?.id);
            magicModal.hide();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: verticalScale(15),
          }}
        >
          <Image
            source={countr?.icon}
            contentFit="contain"
            style={{
              width: horizontalScale(30),
              height: verticalScale(30),
              marginRight: 5,
              // paddingVertical: moderateScale(15),
            }}
          />
          <MonoText style={{ fontSize: moderateScale(18) }}>
            {countr?.name}
          </MonoText>
          <Text style={{ marginLeft: 10 }}>{countr?.indicatif}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          //@ts-ignore
          data={Object.keys(country)}
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      </View>
    );
  };

  const handleChangeText = (text: string) => {
    const cleanText = text.replace(/,/g, "");

    setAmount(cleanText);
  };

  function verifyAndNext(): void {
    let realNumber = country[countryId]?.indicatif + number;
    const nameRegex = /^[A-Za-z]+$/;
    // let testAgence =
    //   agence?.name === "ORANGE MONEY" || agence === "MTN MONEY" || agence === "WAVE";
    // let testName = /^[a-zA-ZÀ-ÖØ-öø-ſÇ-üŸ-ÿ\s-]+$/.test(name) || /^[а-яА-ЯёЁ]+$/.test(name);

    if (!!agence?.name && name?.length >= 3) {
      changeTOProofPayment(amount, 1, agence, currentCurrency);
      dispatch(
        updateTransaction({
          data: {
            transacData: {
              telephone: realNumber,
              sum: amount,
              agence: agence.id,
              country: countryId,
              receiverName: name,
              carte: cardSb,
              codePromo: "jems545",
              typeTransaction: !!cardSb ? "carte" : "number",

              // typeTransaction: "agence",
            },
            transactionId,
          },
        })
      );
      console.log(
        "🚀 ~ file: Contact.tsx:218 ~ verifyAndNext ~ transactionId:",
        transactionId
      );

      console.log({ valid, agence, realNumber });
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="never"
      lightColor="#f6f7fb"
      style={{
        flex: 1,
        paddingHorizontal: horizontalScale(15),
        marginTop: verticalScale(10),
        gap: 20,
      }}
    >
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={10}
        style={{ flex: 1 }}
      >
        <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Recipient name
          </Text>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
              name?.length < 3 && { borderWidth: 0.4, borderColor: "#e42" },
            ]}
          >
            <TouchableOpacity
              style={{
                flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="user"
                size={25}
                color={Colors[colorSheme ?? "light"].text}
              />
            </TouchableOpacity>
            <TextInput
              // maxLength={10}
              placeholder="full name"
              value={name}
              onChangeText={(txt) => setName(txt)}
              keyboardType="name-phone-pad"
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(0),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(18),
              }}
            />
          </View>
          {name?.length < 3 ? (
            <Text style={{ color: "#e42", textAlign: "center" }}>
              name invalid
            </Text>
          ) : (
            <Text />
          )}
        </View>

        <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Recipient number
          </Text>

          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
              !valid && { borderWidth: 0.4, borderColor: "#e42" },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                magicModal.show(() => <ResponseModal />);
              }}
              style={{
                // flex: 4,
                // justifyContent: "center",
                alignItems: "center",

                gap: moderateScale(1),
                flexDirection: "row",
                // borderRightColor: "#b2c5ca",
                // borderRightWidth: 1,
                paddingHorizontal: horizontalScale(5),
              }}
            >
              <Entypo name="chevron-down" size={25} color={"#b2c5ca"} />
              <Text
                // lightColor="#444"
                style={{
                  color: Colors[colorSheme ?? "light"].text,
                  fontSize: moderateScale(18),
                }}
              >
                {country[countryId]?.indicatif || user?.code || "+1"}
              </Text>
            </TouchableOpacity>
            <TextInput
              maxLength={
                parseInt(country[countryId]?.digit) || user.number?.length
              }
              value={number}
              placeholder="0565848273"
              onChangeText={(txt) => {
                setNumber(txt);
              }}
              keyboardType="phone-pad"
              style={{
                flex: 10,
                // paddingHorizontal: horizontalScale(15),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(18),
              }}
            />

            <TouchableOpacity
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={[country[countryId]?.icon]}
                style={{ width: moderateScale(30), aspectRatio: 1 }}
              />
            </TouchableOpacity>
          </View>

          {!valid ? (
            <Text style={{ color: "#e42", textAlign: "center" }}>
              format invalid
            </Text>
          ) : (
            <Text />
          )}
        </View>

        {country[countryId]?.name === "russie" ? (
          <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(16), fontWeight: "500" }}
            >
              Card
            </Text>
            <View
              style={[
                {
                  flexDirection: "row",
                  margin: verticalScale(8),
                  borderRadius: 10,
                },
                shadow(1),
              ]}
            >
              <TouchableOpacity
                style={{
                  //   flex: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: horizontalScale(10),
                }}
              >
                <Text
                  lightColor="#b2c5ca"
                  style={{
                    fontSize: moderateScale(16),
                    borderRightColor: "#b2c5ca",
                    borderRightWidth: 1,
                    paddingRight: horizontalScale(5),
                  }}
                >
                  SBERBANK
                </Text>
              </TouchableOpacity>
              <TextInput
                // maxLength={10}
                value={cardSb}
                onChangeText={(txt) => {
                  setCardSb;
                }}
                keyboardType="number-pad"
                style={{
                  flex: 10,
                  paddingHorizontal: horizontalScale(0),
                  paddingVertical: verticalScale(8),
                  color: Colors[colorSheme ?? "light"].text,
                  fontSize: moderateScale(18),
                }}
              />
            </View>
          </View>
        ) : valid ? (
          <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(10) }}>
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(16), fontWeight: "500" }}
            >
              Withdrawal mode
            </Text>

            <TouchableOpacity
              onPress={() => {
                magicModal.show(() => <ServiceModal />);
              }}
              style={[
                {
                  //   flex: 3,
                  // justifyContent: "center",
                  // alignItems: "center",
                  // paddingHorizontal: horizontalScale(0),
                  borderRadius: 10,
                  margin: verticalScale(8),
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingVertical: verticalScale(10),
                  // paddingHorizontal: horizontalScale(5),
                  backgroundColor: "white",
                },
                shadow(1),
              ]}
            >
              <Entypo
                name="chevron-down"
                size={30}
                color={"#b2c5ca"}
                style={{
                  position: "absolute",
                  left: horizontalScale(10),
                  bottom: verticalScale(5),
                }}
              />
              <Text
                lightColor="#b2c5ca"
                style={{
                  fontSize: moderateScale(18),
                  // paddingHorizontal: horizontalScale(10),
                  textAlign: "center",
                  // backgroundColor: "red",
                }}
              >
                {agence?.name}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(16), fontWeight: "500" }}
          >
            Amount to send
          </Text>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
            ]}
          >
            <TouchableOpacity
              style={{
                flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="wallet"
                size={25}
                color={Colors[colorSheme ?? "light"].text}
              />
            </TouchableOpacity>
            <TextInput
              // maxLength={10}
              value={amount}
              onChangeText={handleChangeText}
              keyboardType="numeric"
              // pas
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(20),
                fontWeight: "500",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                magicModal.show(() => <ChangeCurrentcurency />);
              }}
              style={{
                // flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <Text
                lightColor="#b2c5ca"
                style={{
                  fontSize: moderateScale(22),
                  // borderLeftColor: "#b2c5ca",
                  // borderLeftWidth: 1,
                  paddingLeft: horizontalScale(10),
                }}
              >
                {getSymbolFromCurrency(currentCurrency)}
              </Text>
            </TouchableOpacity>
          </View>
          {+amount < 1 ? (
            <Text style={{ color: "#e42", textAlign: "center" }}>
              Amount invalid
            </Text>
          ) : (
            <Text />
          )}
        </View>
        <View lightColor="#f6f7fb" style={{}}>
          <Text
            lightColor="#b2c5ca"
            style={{ fontSize: moderateScale(15), fontWeight: "500" }}
          >
            Real amount Received (after fee)
          </Text>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                magicModal.show(() => <ResponseModal />);
              }}
              style={{
                flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="wallet"
                size={25}
                color={Colors[colorSheme ?? "light"].text}
              />
            </TouchableOpacity>
            <Text
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(5),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(20),
                fontWeight: "500",
              }}
            >
              {formatAmount(montant - taxes)}
            </Text>
            <TouchableOpacity
              style={{
                // flex: 2.5,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: horizontalScale(10),
              }}
            >
              <Text
                lightColor="#b2c5ca"
                style={{
                  fontSize: moderateScale(22),
                  // borderLeftColor: "#b2c5ca",
                  // borderLeftWidth: 1,
                  paddingLeft: horizontalScale(10),
                }}
              >
                {getSymbolFromCurrency(currencyReceiver)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={verifyAndNext}
          style={[
            {
              width: "40%",
              alignSelf: "flex-start",
              backgroundColor: Colors[colorSheme ?? "light"].text,
              marginTop: verticalScale(30),
              paddingVertical: verticalScale(15),
              borderRadius: moderateScale(10),
            },
            shadow(10),
          ]}
        >
          <Text
            style={{
              textAlign: "center",
              color: Colors[colorSheme ?? "dark"].textOverlay,
              fontSize: moderateScale(20),
              textTransform: "uppercase",
            }}
          >
            next
          </Text>
        </TouchableOpacity>

        <MagicModalPortal />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Contact;
