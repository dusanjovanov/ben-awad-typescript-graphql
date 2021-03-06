import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import path from "path";
import { createTypeORMConnection } from "./utils/createTypeORMConnection";
import fs from "fs";
import { mergeSchemas, makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "modules"));
  folders.forEach(folder => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = importSchema(
      path.join(__dirname, `./modules/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ typeDefs, resolvers }));
  });
  const server = new GraphQLServer({ schema: mergeSchemas({ schemas }) });
  await createTypeORMConnection();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000,
  });
  console.log("Server is running on localhost:4000");
  return app;
};
