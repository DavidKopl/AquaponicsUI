const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // Přizpůsobte podle potřeby
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB👌:', process.env.MONGO_URI);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Ukončení, pokud připojení selže
  }
};

module.exports = connectDB;
