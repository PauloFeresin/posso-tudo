import database from "infra/database.js";

async function status(req, res) {
  const databaseName = process.env.POSTGRES_DB;

  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseConnectionsValue = databaseConnections.rows[0].count;
  const maxConnections = await database.query("SHOW max_connections;");
  const maxConnectionValues = maxConnections.rows[0].max_connections;

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(maxConnectionValues),
        current_connections: databaseConnectionsValue,
      },
    },
  });
}

export default status;
