// let me open a connection with SQLite
import { open } from "sqlite";
import driver from "sqlite3";

export async function getDB() {
  try {
    const db = await open({
      // name of file where all my data will be saved.
      filename: "db.sqlite",
      driver: driver.Database,
    });

    if (!db) {
      // if there is an UNDEFINED result, we return a error
      // and what is contained in it
      throw new TypeError(`DB Connection expected, got: ${db}`);
    }

    return db;
  } catch (error) {
    console.error(
      `There was an error trying to connect to the DMBS: ${error.message}`
    );
  }
}

export async function initializeDB() {
  try {
    const db = await getDB();

    await db.exec(`
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY,
                title TEXT,
                description TEXT,
                is_done INTEGER DEFAULT 0
            )
        `);

    await db.close();
  } catch (error) {
    console.error(
      `There was an error trying to connect to the DB: ${error.message}`,
      error
    );
  }
}
