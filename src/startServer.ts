import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import path from "path";
import { resolvers } from "./resolvers";
import { createTypeORMConnection } from "./utils/createTypeORMConnection";
const typeDefs = importSchema(path.resolve("./src/schema.graphql"));

export const startServer = async () => {
  const server = new GraphQLServer({ typeDefs, resolvers });
  await createTypeORMConnection();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000,
  });
  console.log("Server is running on localhost:4000");
  return app;
};
