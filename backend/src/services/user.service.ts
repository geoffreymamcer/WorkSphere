import { userRepository } from "../repositories/user.repository";
import { UpdateProfileInput } from "../validators/user.schema";
import { AppError } from "../utils/AppError";

export const userService = {
  getProfile: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    // Return sanitized profile
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      jobTitle: user.jobTitle,
      avatarUrl: user.avatarUrl,
    };
  },

  updateProfile: async (userId: string, data: UpdateProfileInput) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    return userRepository.update(userId, {
      name: data.name,
      jobTitle: data.jobTitle,
    });
  },

  // Mock Avatar Upload (In prod, use S3/Cloudinary)
  updateAvatar: async (userId: string, fileUrl: string) => {
    return userRepository.update(userId, {
      avatarUrl: fileUrl,
    });
  },
};
