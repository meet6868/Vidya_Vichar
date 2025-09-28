const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vidya_vichar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dropIndexes = async () => {
  try {
    console.log('🔧 Connecting to database...');
    
    // Wait for connection
    await new Promise((resolve, reject) => {
      mongoose.connection.on('connected', resolve);
      mongoose.connection.on('error', reject);
      // If already connected
      if (mongoose.connection.readyState === 1) resolve();
    });
    
    const db = mongoose.connection.db;
    
    // Drop the incorrect unique indexes from lectures collection
    const indexesToDrop = ['course_id_1', 'query_id_1', 'joined_students_1'];
    
    for (const indexName of indexesToDrop) {
      try {
        await db.collection('lectures').dropIndex(indexName);
        console.log(`✅ Dropped ${indexName} index from lectures collection`);
      } catch (error) {
        if (error.message.includes('index not found')) {
          console.log(`ℹ️  ${indexName} index not found (already dropped or never existed)`);
        } else {
          console.log(`⚠️  Error dropping ${indexName} index:`, error.message);
        }
      }
    }

    // Also check and drop any other problematic indexes
    try {
      const indexes = await db.collection('lectures').indexes();
      console.log('📋 Current indexes on lectures collection:');
      indexes.forEach(index => {
        console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
      });
    } catch (error) {
      console.log('⚠️  Error listing indexes:', error.message);
    }

    console.log('🎉 Index cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during index cleanup:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the cleanup
dropIndexes();
