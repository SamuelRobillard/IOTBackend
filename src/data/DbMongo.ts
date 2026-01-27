import config from "../config/config";


const mongoose = require('mongoose');
const connectDB = async () => {
  console.log(config.mongoUri)
    const uri = config.mongoUri


   
    
    
      try {
        await mongoose.connect(uri); 
       
        console.log('MongoDB connected successfully!');
      } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the application on connection failure
      }
    
}
export default connectDB;