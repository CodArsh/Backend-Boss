import { Country, State, City } from '../model/place.model.js';
import { CatchError } from '../utils/errors.js';

const getCountries = async (req, res) => {
    try {
        const countries = await Country.find();
        res.status(200).json(countries);
    } catch (err) {
        console.error(err);
        CatchError(err, res, "Failed to fetch countries");
    }
};

const getStates = async (req, res) => {
    try {
        const { countryId } = req.params;
        const states = await State.find({ countryId: Number(countryId) });
        res.status(200).json(states);
    } catch (err) {
        console.error(err);
        CatchError(err, res, "Failed to fetch states");
    }
};

const getCities = async (req, res) => {
    try {
        const { stateId } = req.params;
        const cities = await City.find({ stateId: Number(stateId) });
        res.status(200).json(cities);
    } catch (err) {
        console.error(err);
        CatchError(err, res, "Failed to fetch cities");
    }
};


export {
    getCountries,
    getStates,
    getCities
}