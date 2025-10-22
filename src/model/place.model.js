import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true }
});
export const Country = mongoose.model('Country', countrySchema);

const stateSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  countryId: { type: Number, ref: 'Country', required: true },
  name: { type: String, required: true }
});
export const State = mongoose.model('State', stateSchema);

const citySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  stateId: { type: Number, ref: 'State', required: true },
  name: { type: String, required: true }
});
export const City = mongoose.model('City', citySchema);