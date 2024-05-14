import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra/migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pg_migrations",
  };

  if (request.method === "GET") {
    const pengingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClient.end();
    return response.status(200).json(pengingMigrations);
  }
  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }
  response.status(405);
}
