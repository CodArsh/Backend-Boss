import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getCities, getCountries, getStates } from "../controller/place.controller.js";

const PlaceRouter = Router()

PlaceRouter.get('/countries', verifyToken, getCountries)
PlaceRouter.get('/states/:countryId', verifyToken, getStates)
PlaceRouter.get('/cities/:stateId', verifyToken, getCities)

export default PlaceRouter