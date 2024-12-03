const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://kopldavid22:123456Ab@cluster-aquaponics-data.9cwcv.mongodb.net/data'; // Přizpůsobte podle potřeby
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB👌');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Ukončení, pokud připojení selže
  }
};

module.exports = connectDB;
