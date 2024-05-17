import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname= $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;
  //version
  /*
  let query = await database.query("SELECT version();");
  const versionDb = query.rows[0].version;

  //max_connections
  query = await database.query("SHOW max_connections");
  const maxConnectionsDb = query.rows[0].max_connections;

  //used_connections
  query = await database.query(
    "SELECT count(*) AS used FROM pg_stat_activity WHERE state = 'active';",
  );
  const usedConnectionsDB = query.rows[0].used;

  response.status(200).json({
    update_at: updatedAt,
    version_db: versionDb,
    max_connections_db: maxConnectionsDb,
    used_connections_db: usedConnectionsDB,
  });*/
  response.status(200).json({
    update_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: parseInt(databaseOpenedConnectionsValue),
      },
    },
  });
}

export default status;
