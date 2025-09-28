const mongoose = require('mongoose');
const Teacher = require('./src/models/Teachers');

async function getTeacherId() {
  try {
    await mongoose.connect('mongodb://localhost:27017/vidya_vichar');
    const teacher = await Teacher.findOne({});
    if (teacher) {
      console.log('Teacher ID:', teacher._id.toString());
    } else {
      console.log('No teachers found');
    }
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

getTeacherId();
