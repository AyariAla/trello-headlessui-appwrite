import { Client, Account, ID, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  //   .setProject('64e4e8dd264e47b2cb5c');
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
export { client, account, databases, storage, ID };
