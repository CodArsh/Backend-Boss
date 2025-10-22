// seed.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Country, State, City } from '../model/place.model.js'
import { countries, states, cities } from '../constants/Location.js';
dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/tasker', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("ALL COUNTRIES NOW IN MONGODB");

        // Clear old data
        await Country.deleteMany({});
        await State.deleteMany({});
        await City.deleteMany({});

        // Insert new data
        await Country.insertMany(countries);
        await State.insertMany(states);
        await City.insertMany(cities);

        console.log("Database seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedDatabase();
