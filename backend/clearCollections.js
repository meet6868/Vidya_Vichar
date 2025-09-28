const mongoose = require('mongoose');
const Lecture = require('./src/models/Lecture');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vidya_vichar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clearCollections = async () => {
  try {
    console.log('🧹 Clearing existing data...');
    
    // Wait for connection
    await new Promise((resolve, reject) => {
      mongoose.connection.on('connected', resolve);
      mongoose.connection.on('error', reject);
      if (mongoose.connection.readyState === 1) resolve();
    });
    
    // Drop the entire lectures collection to remove all indexes
    try {
      await mongoose.connection.db.collection('lectures').drop();
      console.log('✅ Dropped lectures collection');
    } catch (error) {
      if (error.message.includes('ns not found')) {
        console.log('ℹ️  lectures collection does not exist');
      } else {
        console.log('⚠️  Error dropping lectures collection:', error.message);
      }
    }

    // Also clear other collections to start fresh
    const collections = ['courses', 'questions', 'answers', 'resources'];
    for (const collectionName of collections) {
      try {
        await mongoose.connection.db.collection(collectionName).deleteMany({});
        console.log(`✅ Cleared ${collectionName} collection`);
      } catch (error) {
        console.log(`⚠️  Error clearing ${collectionName}:`, error.message);
      }
    }

    console.log('🎉 Collections cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the cleanup
clearCollections();
