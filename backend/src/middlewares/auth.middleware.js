import { clerkClient, getAuth } from "@clerk/express";

// Protect routes: allow only logged-in users
export const protectRoute = (req, res, next) => {
  const auth = getAuth(req);     // 👈 Extract Clerk token info
  if (!auth.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.auth = auth;               // 👈 Attach it for later middleware
  next();
};

// Allow only admin users
export const requiredAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);

    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next(); // IMPORTANT: Call next() if admin check passed
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
