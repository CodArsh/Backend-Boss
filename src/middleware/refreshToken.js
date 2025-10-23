import jwt from "jsonwebtoken";
import { TryError, CatchError } from "../utils/errors.js";

export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    throw TryError("Refresh token missing", 401);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1m" }
    );

    res.json({
      message: "New access token generated",
      accessToken: newAccessToken,
    });
  } catch (error) {
    CatchError(error, res, "Invalid or expired refresh token");
  }
};
