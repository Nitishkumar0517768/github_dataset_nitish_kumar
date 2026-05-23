const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Dataset = require('../models/dataset');

// Load environment variables
dotenv.config({ path: './.env' });

async function verify() {
  console.log('[Script] Connecting to MongoDB...');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Script] Connected successfully!');
    
    // Count docs
    const count = await Dataset.countDocuments({});
    console.log(`[Script] Total Documents in datasets: ${count}`);

    // Fetch one doc
    const sample = await Dataset.findOne({});
    console.log('[Script] Sample Document loaded successfully:');
    console.log(JSON.stringify(sample, null, 2));

  } catch (error) {
    console.error('[Script] Connection failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[Script] Disconnected.');
  }
}

verify();
