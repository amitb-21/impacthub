import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://amitkumarbehera2104_db_user:<db_password>@impacthub.ag4rzvt.mongodb.net/?retryWrites=true&w=majority&appName=impacthub");
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};
