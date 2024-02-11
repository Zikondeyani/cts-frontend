import Dexie from 'dexie';

export const db = new Dexie(process.env.VUE_APP_DB);
db.version(1).stores({
    friends: '++id, name, age', // Primary key and indexed props
});
