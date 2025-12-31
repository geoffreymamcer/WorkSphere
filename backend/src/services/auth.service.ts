import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";
import { SignupInput, LoginInput } from "../validators/auth.schema";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const authService = {
  signup: async (input: SignupInput) => {
    const { email, password, name } = input;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("Email is already in use", 409);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userRepository.create({
      email,
      password: hashedPassword,
      name: name || null,
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };

    return { user: userResponse, token };
  },

  login: async (input: LoginInput) => {
    const { email, password } = input;

    const user = await userRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    return { user: userResponse, token };
  },

  getMe: async (userId: string) => {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Return sanitized user object
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },
};
