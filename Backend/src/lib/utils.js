import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // Create a JWT token with userId as the payload
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token expires in 7 days
    });

    // Set the JWT token as a cookie in the response
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (security feature)
        sameSite: 'strict', // Helps prevent CSRF attacks by restricting cookie sharing
        secure: process.env.NODE_ENV !== 'development', // Only send cookie over HTTPS in production
    });

    return token; // Return the generated token
};
