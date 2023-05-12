import { AnyAction, Dispatch, EmptyObject } from "@reduxjs/toolkit";
import * as Contacts from "expo-contacts";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { ContactShema } from "../../app/modal";
import { addContact } from "./contactSlice";

export async function fetchContacts(
  listContact: EmptyObject & {
    contact: ContactShema[];
  } & PersistPartial,
  dispatch: Dispatch<AnyAction>
) {
  if (listContact.contact.length === 0) {
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

        dispatch(addContact(mappedContacts));
      }
    }
  }
}
