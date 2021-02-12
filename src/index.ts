import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import path from "path";
const typeDefs = importSchema(path.resolve("./src/schema.graphql"));
import { resolvers } from "./resolvers";
import { createConnection } from "typeorm";

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(connection => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
