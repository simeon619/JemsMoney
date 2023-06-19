import React, { useState } from "react";
import {
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { View } from "../Themed";

import { AppDispatch, RootState } from "../../store";
// import countryAPI from "../../store/country.json";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { updateCharges } from "../../store/entreprise/entrepriseSlice";
import { MonoText } from "../StyledText";

export const SetFee = ({
  modalVisible,
  closeModal,
}: {
  modalVisible: boolean;
  closeModal: () => void;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, serviceCharge, rates, success } = useSelector(
    (state: RootState) => state.entreprise
  );

  const [searchTerm, setSearchTerm] = useState(String(serviceCharge * 100));
  // const [searchPerformed, setSearchPerformed] = useState(false);

  const router = useRouter();

  const handleClearSearch = () => {
    setSearchTerm("");
    if (!!!searchTerm) {
      closeModal();
    }
  };

  const handleBackdropPress = () => {
    // closeModal();
  };
  const handleModalPress = () => {
    // Do Nothing
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="none"
      transparent={true}
      onRequestClose={closeModal}
    >
      <Toast />
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(01, 0, 40, 0.3)",
          }}
        >
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <View
              style={{
                position: "absolute",
                left: horizontalScale(25),
                right: horizontalScale(25),
                bottom: verticalScale(10),
                padding: moderateScale(10),
                borderRadius: 10,
                // backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: horizontalScale(15),
                }}
              >
                <TextInput
                  placeholder="10%"
                  value={searchTerm}
                  // focusable={true}
                  maxLength={3}
                  returnKeyType="none"
                  autoFocus={true}
                  keyboardType="number-pad"
                  onChangeText={(text) => setSearchTerm(() => text)}
                  style={{
                    fontSize: moderateScale(18),
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    let per = parseInt(searchTerm) / 100;
                    if (isNaN(per)) {
                      Toast.show({
                        position: "top",
                        text1: "Erreur format",
                      });
                    } else {
                      dispatch(updateCharges(per));
                    }
                    closeModal();
                  }}
                >
                  <MonoText style={{ fontSize: moderateScale(18) }}>
                    Valider
                  </MonoText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
