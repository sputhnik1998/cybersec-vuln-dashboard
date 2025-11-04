const mongoose = require('mongoose');
const Vulnerability = require('../models/Vulnerability');
require('dotenv').config();

const populateKaiStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const kaiStatusOptions = ['invalid - norisk', 'ai-invalid-norisk', null];

    // Count total vulnerabilities without kaiStatus
    const totalCount = await Vulnerability.countDocuments({ $or: [{ kaiStatus: { $exists: false } }, { kaiStatus: null }] });
    console.log(`Found ${totalCount} vulnerabilities without kaiStatus`);

    const batchSize = 1000;
    let updated = 0;

    // Process in batches to avoid memory issues
    for (let skip = 0; skip < totalCount; skip += batchSize) {
      const batch = await Vulnerability.find({ $or: [{ kaiStatus: { $exists: false } }, { kaiStatus: null }] })
        .select('_id')
        .limit(batchSize)
        .lean();

      // Update each in the batch
      const bulkOps = batch.map(vuln => ({
        updateOne: {
          filter: { _id: vuln._id },
          update: {
            $set: { kaiStatus: kaiStatusOptions[Math.floor(Math.random() * kaiStatusOptions.length)] }
          }
        }
      }));

      if (bulkOps.length > 0) {
        await Vulnerability.bulkWrite(bulkOps);
        updated += bulkOps.length;
        console.log(`Updated ${updated}/${totalCount} vulnerabilities...`);
      }
    }

    console.log(`\n✅ Successfully updated ${updated} vulnerabilities with random kaiStatus values`);

    // Show distribution
    const distribution = await Vulnerability.aggregate([
      { $group: { _id: '$kaiStatus', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log('\nKaiStatus distribution:');
    distribution.forEach(item => {
      console.log(`  ${item._id || 'null'}: ${item.count}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done! Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

populateKaiStatus();
