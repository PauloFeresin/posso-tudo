import { Client } from "pg";

async function query(queryInput) {
  let client;

  try {
    client = await getNewClient();

    const result = await client.query(queryInput);

    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

function getProcessSSLValue() {
  return process.env.NODE_ENV === "production" ? true : false;
}
async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getProcessSSLValue(),
  });

  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
};
