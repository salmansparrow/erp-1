import { serialize } from "cookie";

export default function handler(req, res) {
  // Set cookie expiration date to the past (immediate expiration)
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "Strict",
      path: "/", // Ensures cookie is deleted across all paths
      maxAge: 0, // Immediately expires cookie
    })
  );

  // Set the role cookie to expire
  res.setHeader(
    "Set-Cookie",
    serialize("role", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "Strict",
      path: "/", // Ensures cookie is deleted across all paths
      maxAge: 0, // Immediately expires cookie
    })
  );

  // Respond with success message
  return res.status(200).json({ message: "Logged out successfully" });
}
