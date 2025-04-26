import { clerkClient } from "@clerk/express";

export const protectRoute = (req, res, next) => {
  if (!req.auth.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
};

export const requiredAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL.split ===
      currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error("Error checking admin status", error);
    next(error);
  }
};
