// Script to drop the unique index on lecture_id in the questions collection
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vidya_vichar', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // List all collections
    console.log('\n📋 Available collections:');
    const collections = await db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Check if questions collection exists
    const questionsCollection = collections.find(col => col.name === 'questions');
    if (!questionsCollection) {
      console.log('\n⚠️ Questions collection does not exist yet.');
      console.log('This is normal if no questions have been created.');
      console.log('The unique index issue will be resolved when the collection is created with the updated schema.');
      process.exit(0);
    }

    const collection = db.collection('questions');

    // List current indexes
    console.log('\n📋 Current indexes on questions collection:');
    const indexes = await collection.indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, index.key);
      if (index.unique) {
        console.log(`   🔒 UNIQUE: ${index.unique}`);
      }
    });

    // Check if lecture_id_1 index exists
    const lectureIdIndex = indexes.find(index => index.name === 'lecture_id_1');
    if (lectureIdIndex) {
      console.log('\n🚨 Found problematic unique index: lecture_id_1');
      console.log('This index prevents multiple questions per lecture.');
      
      // Drop the index
      console.log('\n🔧 Dropping lecture_id_1 index...');
      await collection.dropIndex('lecture_id_1');
      console.log('✅ Successfully dropped lecture_id_1 index');
      
      // Verify it's gone
      console.log('\n📋 Updated indexes on questions collection:');
      const updatedIndexes = await collection.indexes();
      updatedIndexes.forEach((index, i) => {
        console.log(`${i + 1}. ${index.name}:`, index.key);
      });
    } else {
      console.log('\n✅ No lecture_id_1 index found. No action needed.');
    }

    // Check for any unique indexes on lecture_id
    const uniqueIndexOnLectureId = indexes.find(index => 
      index.key && index.key.lecture_id && index.unique
    );
    
    if (uniqueIndexOnLectureId) {
      console.log(`\n🚨 Found unique index on lecture_id: ${uniqueIndexOnLectureId.name}`);
      console.log('🔧 Dropping this index...');
      await collection.dropIndex(uniqueIndexOnLectureId.name);
      console.log('✅ Successfully dropped unique index on lecture_id');
    }

    console.log('\n🎉 Index cleanup completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

connectDB();
