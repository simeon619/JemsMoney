import * as Contacts from "expo-contacts";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { Text, View } from "../components/Themed";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
interface Contact {
  id: string;
  name: string;
  phoneNumbers: { number: string }[];
}
export default function ModalScreen() {
  const [listContact, setListContact] = useState<Contact[]>([]);
  const { height, width } = useWindowDimensions();
  const [value, onChangeText] = useState("");
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          rawContacts: true,
          sort: "firstName",
        });

        if (data.length > 0) {
          let contact = data.filter((c) => c.phoneNumbers !== undefined);
          const mappedContacts = contact.map((contact) => {
            const phoneNumbers = contact.phoneNumbers?.map((phoneNumber) => ({
              number: phoneNumber.number,
            }));
            return { id: contact.id, name: contact.name, phoneNumbers };
          });
          setListContact(mappedContacts);
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          editable
          multiline
          maxLength={40}
          onChangeText={(text) => onChangeText(text)}
          value={value}
          style={{ padding: 10 }}
        />
      </View>
      <FlatList
        data={listContact}
        contentContainerStyle={{}}
        ListFooterComponent={
          <View style={{ height: verticalScale(50), width }}>
            <Text>Fin de List </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={{ height: verticalScale(5), width }}>
            <Text>Contact </Text>
          </View>
        }
        keyExtractor={(item, index) => item.id}
        renderItem={({ item: contact }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: verticalScale(10),
              gap: 5,
              marginLeft: horizontalScale(15),
            }}
          >
            <Image
              style={{ width: moderateScale(40), aspectRatio: 1 }}
              source={require("../assets/images/user.png")}
            />
            <View>
              <Text
                style={{
                  fontWeight: "900",
                  fontSize: moderateScale(18),
                  width: width - horizontalScale(90),
                }}
              >
                {contact.name}
              </Text>
              <Text>{contact.phoneNumbers[0].number}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
