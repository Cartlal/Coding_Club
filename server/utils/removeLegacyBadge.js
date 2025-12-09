import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Remove the legacy "ArcStack Newbie" badge (👶) from all users
 */
const removeLegacyBadge = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const legacyBadge = '👶';
    
    // Find all users with the legacy badge
    const usersWithLegacyBadge = await User.find({ badges: legacyBadge });
    
    console.log(`Found ${usersWithLegacyBadge.length} users with legacy badge`);

    if (usersWithLegacyBadge.length === 0) {
      console.log('No users found with legacy badge. Migration complete!');
      process.exit(0);
    }

    // Remove the legacy badge from all users
    for (const user of usersWithLegacyBadge) {
      user.badges = user.badges.filter(badge => badge !== legacyBadge);
      await user.save();
      console.log(`Removed legacy badge from user: ${user.fullName} (${user.email})`);
    }

    console.log('\n✅ Migration complete! Legacy badge removed from all users.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

removeLegacyBadge();
