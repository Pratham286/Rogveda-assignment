import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db/connection.js';

import Hospital from './models/hospital.model.js';
import Doctor from './models/doctor.model.js';
import Pricing from './models/pricing.model.js';
import Patient from './models/patient.model.js';

const seed = async () => {
  await connectDB();

  // Clear all collections
  await Hospital.deleteMany();
  await Doctor.deleteMany();
  await Pricing.deleteMany();
  await Patient.deleteMany();

  console.log('Cleared existing data...');

  // ── Hospital 1: Apollo Spectra ──────────────────────────
  const apollo = await Hospital.create({
    name: 'Apollo Spectra',
    location: 'Delhi',
    procedure: 'Total Knee Replacement',
    image: '',
  });

  const ramesh = await Doctor.create({ name: 'Dr. Ramesh Kumar', experience: 16, hospitalId: apollo._id });
  const priya = await Doctor.create({ name: 'Dr. Priya Sharma', experience: 12, hospitalId: apollo._id });

  await Pricing.insertMany([
    { hospitalId: apollo._id, doctorId: ramesh._id, roomType: 'General Ward',  priceUSD: 3200 },
    { hospitalId: apollo._id, doctorId: ramesh._id, roomType: 'Semi-Private',  priceUSD: 3800 },
    { hospitalId: apollo._id, doctorId: ramesh._id, roomType: 'Private',       priceUSD: 4500 },
    { hospitalId: apollo._id, doctorId: priya._id,  roomType: 'General Ward',  priceUSD: 3000 },
    { hospitalId: apollo._id, doctorId: priya._id,  roomType: 'Semi-Private',  priceUSD: 3600 },
    { hospitalId: apollo._id, doctorId: priya._id,  roomType: 'Private',       priceUSD: 4200 },
  ]);

  // ── Hospital 2: Max Saket ───────────────────────────────
  const max = await Hospital.create({
    name: 'Max Saket',
    location: 'Delhi',
    procedure: 'Total Knee Replacement',
    image: '',
  });

  const vikram = await Doctor.create({ name: 'Dr. Vikram Singh', experience: 18, hospitalId: max._id });
  const anita  = await Doctor.create({ name: 'Dr. Anita Desai',  experience: 15, hospitalId: max._id });
  const mohit  = await Doctor.create({ name: 'Dr. Mohit Verma',  experience: 10, hospitalId: max._id });

  await Pricing.insertMany([
    { hospitalId: max._id, doctorId: vikram._id, roomType: 'General Ward',  priceUSD: 3500 },
    { hospitalId: max._id, doctorId: vikram._id, roomType: 'Semi-Private',  priceUSD: 4200 },
    { hospitalId: max._id, doctorId: vikram._id, roomType: 'Private',       priceUSD: 5000 },
    { hospitalId: max._id, doctorId: vikram._id, roomType: 'Suite',         priceUSD: 6500 },
    { hospitalId: max._id, doctorId: anita._id,  roomType: 'General Ward',  priceUSD: 3400 },
    { hospitalId: max._id, doctorId: anita._id,  roomType: 'Semi-Private',  priceUSD: 4000 },
    { hospitalId: max._id, doctorId: anita._id,  roomType: 'Private',       priceUSD: 4800 },
    { hospitalId: max._id, doctorId: anita._id,  roomType: 'Suite',         priceUSD: 6200 },
    { hospitalId: max._id, doctorId: mohit._id,  roomType: 'General Ward',  priceUSD: 3100 },
    { hospitalId: max._id, doctorId: mohit._id,  roomType: 'Semi-Private',  priceUSD: 3700 },
    { hospitalId: max._id, doctorId: mohit._id,  roomType: 'Private',       priceUSD: 4400 },
    { hospitalId: max._id, doctorId: mohit._id,  roomType: 'Suite',         priceUSD: 5800 },
  ]);

  // ── Hospital 3: Fortis Gurgaon ──────────────────────────
  const fortis = await Hospital.create({
    name: 'Fortis Gurgaon',
    location: 'Gurgaon',
    procedure: 'Total Knee Replacement',
    image: '',
  });

  const sunil = await Doctor.create({ name: 'Dr. Sunil Mehta', experience: 20, hospitalId: fortis._id });

  await Pricing.insertMany([
    { hospitalId: fortis._id, doctorId: sunil._id, roomType: 'Semi-Private', priceUSD: 3900 },
    { hospitalId: fortis._id, doctorId: sunil._id, roomType: 'Private',      priceUSD: 4600 },
  ]);

  // ── Dummy Patient ───────────────────────────────────────
  await Patient.create({
    name: 'John Mensah',
    email: 'john@example.com',
    phone: '+2348012345678',
    country: 'Nigeria',
    walletBalance: 0,
  });

  console.log('Seeded successfully!');
  console.log(`  Hospitals : 3`);
  console.log(`  Doctors   : 6`);
  console.log(`  Pricing   : 18 records`);
  console.log(`  Patients  : 1`);

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});