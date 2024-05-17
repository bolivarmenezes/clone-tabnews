import database from "infra/database.js";
import axios from "axios";

test("GET to /api/v1/status return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  const parserUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toEqual(parserUpdateAt);

  expect(responseBody.dependencies.database.version).toEqual("16.3");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});

test("Verifica se fechou as conexões com o banco de dados", async () => {
  const executaHTTPUpdate = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "DELETE",
    },
  );

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname= $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;
  console.log(databaseOpenedConnectionsValue);
  expect(databaseOpenedConnectionsValue).toBe(1);
});

/*const version_db = responseBody.version_db;
  expect(version_db).toBeDefined();
  expect(version_db).toContain("Postgre");

  const max_connections_db = responseBody.max_connections_db;
  expect(max_connections_db).toBeDefined();

  const used_connections_db = responseBody.used_connections_db;
  expect(used_connections_db).toBeDefined();*/
