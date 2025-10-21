import jwt from "jsonwebtoken"
import { TryError, CatchError } from "../utils/errors.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader)
        throw TryError("Authorization header missing", 401);

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            CatchError(error, res, "Session expired, please login again");
        }
        CatchError(error, res, "Invalid token");
    }
}
