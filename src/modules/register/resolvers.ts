import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, { email, password }) => {
      const userAlreadyExists = User.findOne({
        where: { email },
        select: ["id"],
      });
      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: "Email taken",
          },
        ];
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
      });
      await user.save();
      return null;
    },
  },
};
