import { parse } from "cookie";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cookies = parse(req.headers.cookie || ""); // ✅ Undefined handle ho gaya
  const token = cookies.token || null;
  const role = cookies.role || null;

  if (!token || !role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ role });
}
