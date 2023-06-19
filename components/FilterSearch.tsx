import React, { useState } from "react";
import {
  Pressable,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import CalendarPicker, {
  DateChangedCallback,
} from "react-native-calendar-picker";
//@ts-ignore
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { MonoText } from "./StyledText";
import { ScrollView } from "./Themed";

const FilterSearch = ({
  setShowFilterd,
  showFiltered,
}: {
  setShowFilterd: (value: boolean) => void;
  showFiltered: boolean;
}) => {
  const [selectedStartDate, setSelectedStartDate] =
    useState<moment.Moment | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<moment.Moment | null>(
    null
  );
  console.log({ showFiltered });

  const onDateChange: DateChangedCallback = (date, type) => {
    if (type === "END_DATE") {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };
  const [isLiked, setIsLiked] = useState([
    { id: 1, value: true, name: "Tout", selected: true },
    { id: 2, value: false, name: "Start", selected: false },
    { id: 3, value: false, name: "Full", selected: false },
    { id: 4, value: false, name: "Run", selected: false },
    { id: 5, value: false, name: "End", selected: false },
    { id: 6, value: false, name: "Cancel", selected: false },
  ]);
  const startDate = selectedStartDate ? selectedStartDate.toString() : "";
  console.log(
    "🚀 ~ file: FilterSearch.tsx:55 ~ selectedStartDate:",
    selectedStartDate
  );

  const endDate = selectedEndDate ? selectedEndDate.toString() : "";
  console.log(
    "🚀 ~ file: FilterSearch.tsx:58 ~ selectedEndDate:",
    selectedEndDate
  );

  const SIZE_RADIO = 25;
  const onRadioBtnClick = (item: any) => {
    let updatedState = isLiked.map((isLikedItem) =>
      isLikedItem.id === item.id
        ? { ...isLikedItem, selected: true }
        : { ...isLikedItem, selected: false }
    );
    setIsLiked(updatedState);
  };
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  let router = useRouter();
  const RadioButton = ({ onPress, selected, children }: any) => {
    return (
      <>
        {
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                marginRight: 45,
                marginVertical: verticalScale(5),
              },
            ]}
          >
            <TouchableOpacity
              onPress={onPress}
              style={{
                height: SIZE_RADIO,
                width: SIZE_RADIO,
                backgroundColor: "#ccc",
                borderRadius: SIZE_RADIO / 2,
                borderWidth: 1,
                borderColor: "#E6E6E6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selected ? (
                <View
                  style={{
                    height: SIZE_RADIO / 1.5,
                    width: SIZE_RADIO / 1.5,
                    borderRadius: SIZE_RADIO,
                    backgroundColor:
                      Colors[colorScheme ?? "light"].primaryColour,
                  }}
                />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress}>
              <MonoText
                style={[
                  {
                    fontSize: 16,
                    marginLeft: 16,
                    color: "#888",
                  },
                  selected && { color: "#111" },
                ]}
              >
                {children}
              </MonoText>
            </TouchableOpacity>
          </View>
        }
      </>
    );
  };

  function handleHide(): void {
    setShowFilterd(true);
  }

  return (
    <>
      {!showFiltered ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              width,
              backgroundColor: Colors[colorScheme ?? "light"].primaryColour,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable onPress={handleHide}>
              {({ pressed }) => (
                <MaterialCommunityIcons
                  name="close"
                  color={"#912"}
                  size={30}
                  style={{
                    marginLeft: horizontalScale(10),
                    opacity: pressed ? 0.5 : 1,
                  }}
                />
              )}
            </Pressable>
            <MonoText
              style={{
                color: Colors[colorScheme ?? "light"].textOverlay,
                paddingLeft: horizontalScale(5),
                paddingVertical: verticalScale(10),
                fontSize: moderateScale(20),

                width: width - horizontalScale(80),
              }}
            >
              Filtre
            </MonoText>
            <Pressable onPress={() => {}}>
              {({ pressed }) => (
                <MaterialCommunityIcons
                  name="filter"
                  size={28}
                  color={"#ddda"}
                  style={{
                    opacity: pressed ? 0.5 : 1,
                  }}
                />
              )}
            </Pressable>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <MonoText
                style={{
                  fontSize: moderateScale(20),
                  marginLeft: horizontalScale(20),
                  marginTop: verticalScale(10),
                }}
              >
                Choisir date
              </MonoText>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                weekdays={["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]}
                months={[
                  "Janvier",
                  "Fevrier",
                  "Mars",
                  "Avril",
                  "Mai",
                  "Juin",
                  "Juillet",
                  "Aout",
                  "Septembre",
                  "Octobre",
                  "Novembre",
                  "Decembre",
                ]}
                previousTitle="Precedent"
                nextTitle="Suivant"
                // minDate={minDate}
                // maxDate={maxDate}
                // todayBackgroundColor={Colors[colorScheme ?? "light"].background}
                todayBackgroundColor={
                  Colors[colorScheme ?? "light"].primaryColour
                }
                selectedDayColor="#66ff33"
                selectedDayTextColor="#fff"
                onDateChange={onDateChange}
                textStyle={{
                  fontFamily: "SpaceMono",
                }}
              />
              <View
                style={{
                  marginLeft: horizontalScale(20),
                  marginTop: verticalScale(10),
                }}
              >
                <MonoText style={{ fontSize: moderateScale(20) }}>
                  Etat transaction
                </MonoText>
                {isLiked.map((item) => (
                  <RadioButton
                    onPress={() => onRadioBtnClick(item)}
                    selected={item.selected}
                    key={item.id}
                  >
                    {item.name}
                  </RadioButton>
                ))}
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].primaryColour,
            }}
          >
            <MonoText
              style={{
                color: Colors[colorScheme ?? "light"].textOverlay,
                paddingLeft: horizontalScale(5),
                paddingVertical: verticalScale(10),
                fontSize: moderateScale(22),
                textAlign: "center",
                width,
              }}
            >
              Enregistrer
            </MonoText>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default FilterSearch;
