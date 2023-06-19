import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { MonoText } from "../../components/StyledText";
import { ScrollView, Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../../store";
import { deleteCountry, removeAgence } from "../../store/country/countrySlice";

const ListCountry = () => {
  const dispatch: AppDispatch = useDispatch();
  let country = useSelector((state: RootState) => state.country);
  console.log(
    "🚀 ~ file: ListCountry.tsx:10 ~ ListCountry ~ country:",
    country
  );
  const colorScheme = useColorScheme();

  let route = useRouter();

  const renderItems = () => {
    return Object.keys(country).map((key) => {
      if (key === "loading" || key === "success") {
        return null;
      }

      const item = country[key];

      return (
        <View
          key={item.id}
          style={[
            {
              marginBottom: 16,
              backgroundColor: Colors[colorScheme ?? "light"].background,
              padding: 16,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
            },
            shadow(2),
          ]}
        >
          <Image
            source={{ uri: item.icon }}
            style={{
              width: 32,
              height: 32,
              marginRight: 8,
              alignSelf: "flex-start",
            }}
          />
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                gap: 5,
                backgroundColor: Colors[colorScheme ?? "light"].background,
              }}
            >
              <Text
                style={{
                  fontSize: moderateScale(18),
                  fontWeight: "bold",
                  paddingHorizontal: horizontalScale(5),
                  borderRadius: 5,
                  marginBottom: 4,
                  color: Colors[colorScheme ?? "light"].textOverlay,
                  backgroundColor: Colors[colorScheme ?? "light"].text,
                }}
              >
                {item.name}
              </Text>
              {item.currency && (
                <Text style={{ fontSize: moderateScale(14), marginBottom: 4 }}>
                  {item.currency}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: horizontalScale(24),
                marginBottom: verticalScale(10),
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  route.push({
                    pathname: "preference/SetCountry",
                    params: {
                      id: item.id,
                      icon: item.icon.replace(/\//g, "*"),
                      name: item.name,
                      currency: item.currency,
                      digit: item.digit,
                      indicatif: item.indicatif,
                      charge: item.charge,
                    },
                  });
                }}
                style={{
                  backgroundColor: "#4a1a",
                  padding: moderateScale(5),
                  borderRadius: moderateScale(5),
                }}
              >
                <FontAwesome name="edit" size={24} color={"#fff"} />
                {/* <MonoText
                  style={{ color: Colors[colorScheme ?? "light"].textOverlay }}
                >
                  Modifier
                </MonoText> */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  dispatch(deleteCountry({ idCountry: item.id }));
                }}
                style={{
                  backgroundColor: "#d13a",
                  padding: moderateScale(5),
                  borderRadius: moderateScale(5),
                }}
              >
                {/* <MonoText
                  style={{ color: Colors[colorScheme ?? "light"].textOverlay }}
                >
                  Supprimer
                </MonoText> */}
                <FontAwesome name="trash" size={24} color={"#fff"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors[colorScheme ?? "light"].background,
                  padding: moderateScale(5),
                  borderRadius: moderateScale(5),
                  borderWidth: 1,
                  borderColor: "#0012",
                }}
                onPress={() => {
                  route.push({
                    pathname: "preference/AddAgence",
                    params: { idCountry: item.id },
                  });
                }}
              >
                <MonoText
                  style={{ color: Colors[colorScheme ?? "light"].text }}
                >
                  Ajouter Agence
                </MonoText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "column",
                padding: moderateScale(5),
              }}
            >
              {item.agency.map((agence, i) => (
                <View key={i}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: 5,
                      }}
                    >
                      <MonoText
                        style={{
                          fontSize: moderateScale(14),
                          fontWeight: "bold",
                          marginBottom: 4,
                        }}
                      >
                        {agence.name}
                      </MonoText>
                      <MonoText>{agence.number}</MonoText>
                    </View>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: horizontalScale(24),
                        marginBottom: verticalScale(10),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          route.push({
                            pathname: "preference/SetAgence",
                            params: {
                              id: agence.id,
                              icon: agence.icon.replace(/\//g, "*"),
                              name: agence.name,
                              managerName: agence.managerName,
                              number: agence.number,
                              charge: agence.charge,
                            },
                          });
                        }}
                        style={{
                          backgroundColor: "#4a19",
                          padding: moderateScale(5),
                          borderRadius: moderateScale(5),
                        }}
                      >
                        {/* <FontAwesome name="edit" size={24} color={"#fff"} /> */}
                        <MonoText
                          style={{
                            color: Colors[colorScheme ?? "light"].textOverlay,
                          }}
                        >
                          Modifier
                        </MonoText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(
                            removeAgence({
                              idAgence: agence.id,
                              idCountry: item.id,
                            })
                          );
                        }}
                        style={{
                          backgroundColor: "#d139",
                          padding: moderateScale(5),
                          borderRadius: moderateScale(5),
                        }}
                      >
                        <MonoText
                          style={{
                            color: Colors[colorScheme ?? "light"].textOverlay,
                          }}
                        >
                          Supprimer
                        </MonoText>
                        {/* <FontAwesome name="trash" size={24} color={"#fff"} /> */}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        lightColor="#eee"
        darkColor="#111"
        contentContainerStyle={{
          padding: 16,
        }}
      >
        {renderItems()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListCountry;
