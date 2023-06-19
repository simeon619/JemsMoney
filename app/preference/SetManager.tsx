import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, Text, View } from "../../components/Themed";
import { moderateScale, shadow } from "../../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../../store";
import { deleteManager } from "../../store/manager/managerSlice";

const SetManager = () => {
  const Managers = useSelector((state: RootState) => state.manager);
  const dispatch: AppDispatch = useDispatch();
  console.log(
    "🚀 ~ file: SetManager.tsx:10 ~ SetManager ~ Managers:",
    Managers
  );
  Object.keys(Managers).forEach((manager) => {
    console.log({ manager });
  });
  const route = useRouter();
  const handleDetails = (id: string) => {
    // Logique pour afficher les détails de l'élément avec l'ID donné
    console.log("Détails de l'élément avec ID:", id);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteManager({ managerId: id }));
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: moderateScale(10) }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              // backgroundColor: "#007AFF",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => route.back()}
          >
            <FontAwesome
              name="arrow-left"
              size={25}
              color={"#125"}
              onPress={() => {
                route.back();
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#14aa25",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => route.push("preference/AddManager")}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
              Ajouter
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          {Object.keys(Managers).map((key) => {
            if (key === "success" || key === "loading") {
              return null;
            }
            return (
              <View
                key={key}
                style={{
                  marginBottom: 20,
                  padding: 10,
                  borderRadius: 8,
                  ...shadow(5),
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                  ID: {key}
                </Text>
                <Text>Name: {Managers[key].name}</Text>
                <Text>Telephone: {Managers[key].telephone}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#007AFF",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => handleDetails(key)}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      Détails
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#EE1A00",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => handleDelete(key)}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      Supprimer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SetManager;
