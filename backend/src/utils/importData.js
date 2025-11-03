require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Vulnerability = require('../models/Vulnerability');
const connectDB = require('../config/database');

const extractVulnerabilities = (data) => {
  const vulnerabilities = [];

  // Navigate through the nested structure
  if (data.groups) {
    for (const groupKey in data.groups) {
      const group = data.groups[groupKey];
      if (group.repos) {
        for (const repoKey in group.repos) {
          const repo = group.repos[repoKey];
          if (repo.images) {
            for (const imageKey in repo.images) {
              const image = repo.images[imageKey];
              if (image.vulnerabilities && Array.isArray(image.vulnerabilities)) {
                vulnerabilities.push(...image.vulnerabilities);
              }
            }
          }
        }
      }
    }
  } else if (Array.isArray(data)) {
    // If it's already an array of vulnerabilities
    vulnerabilities.push(...data);
  }

  return vulnerabilities;
};

const importData = async (filePath) => {
  try {
    console.log('Reading JSON file...');
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log('Extracting vulnerabilities from nested structure...');
    const data = extractVulnerabilities(rawData);

    console.log(`Found ${data.length} vulnerability records`);
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing data...');
    await Vulnerability.deleteMany({});

    console.log('Importing data in batches...');
    const batchSize = 1000;
    let imported = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      // Transform data to match schema
      const transformedBatch = batch.map((item) => ({
        ...item,
        severity: item.severity?.toLowerCase(),
        published: item.published ? new Date(item.published) : null,
        fixDate: item.fixDate ? new Date(item.fixDate) : null,
        layerTime: item.layerTime ? new Date(item.layerTime) : null,
        riskFactors: item.riskFactors ? new Map(Object.entries(item.riskFactors)) : new Map(),
      }));

      await Vulnerability.insertMany(transformedBatch, { ordered: false });
      imported += batch.length;
      console.log(`Imported ${imported} / ${data.length} records`);
    }

    console.log('Data import completed successfully!');
    console.log(`Total records imported: ${imported}`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Get file path from command line argument
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the path to your JSON file');
  console.error('Usage: node importData.js <path-to-json-file>');
  process.exit(1);
}

importData(filePath);
