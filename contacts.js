import fs from "fs/promises";
import path from "path";
import shortID from "shortid";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);

    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function getContactById(contactId) {
  try {
    contactId = Number(contactId);
    const data = await listContacts().then((data) =>
      data.filter((contact) => contact.id === contactId)
    );

    return data;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function removeContact(contactId) {
  try {
    contactId = Number(contactId);

    const allContacts = await listContacts().then((data) => data);

    const contacts = allContacts.filter((contact) => contact.id !== contactId);

    if (allContacts.length > contacts.length) {
      fs.writeFile(contactsPath, JSON.stringify(contacts));
      console.log(`contact with id "${contactId}" removed`);
    } else {
      console.log(`contact with id "${contactId}" doesn't exist`);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function addContact(name, email, phone) {
  try {
    const id = shortID.generate();

    const newContact = { id, name, email, phone };

    const allContacts = await listContacts().then((data) => data);

    await fs.writeFile(
      contactsPath,
      JSON.stringify([...allContacts, newContact])
    );

    console.log(`contact with id "${id}" added`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export { listContacts, getContactById, removeContact, addContact };
