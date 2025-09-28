#!/bin/bash

echo "🚀 Starting backend integration setup..."

# Navigate to backend directory
cd backend

# Install dependencies if needed
echo "📦 Checking dependencies..."
npm install

# Run the test data seeder
echo "🌱 Seeding test data..."
node seedTestData.js

echo "✅ Backend integration setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start your MongoDB server"
echo "2. Start the backend server: npm start"
echo "3. Start the frontend server: npm run dev"
echo "4. Test the attended courses flow in the frontend"
echo ""
echo "📝 Test data created:"
echo "   - 3 courses (CS101, DS202, WEB301)"
echo "   - 5 lectures with topics"
echo "   - 4 resources"
echo "   - 5 questions with 3 answers"
echo ""
echo "🔍 You can now test the attended courses → lectures → doubts flow!"
