import { request } from "graphql-request";
import { User } from "../../entity/User";
import { startServer } from "../../startServer";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as any;
  getHost = () => `http://localhost:${port}`;
});

const email = "duca@example.com";
const password = "abc123";

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}"){
      path
      message
    }
  }
`;

test("Register", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
  const response2 = await request(getHost(), mutation);
  expect(response2).toEqual([
    {
      path: "email",
      message: "Email taken",
    },
  ]);
});
