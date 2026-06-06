import cron from 'node-cron';
import prisma from '../config/db.js';

let cleanupJobStarted = false;

export const startSensorCleanupJob = () => {
  if (cleanupJobStarted) return;
  cleanupJobStarted = true;

  cron.schedule('0 3 * * *', async () => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - 1);

      const result = await prisma.sensorReading.deleteMany({
        where: { readingDate: { lt: cutoffDate } }
      });
      console.log(`Cleaned up ${result.count} old sensor readings`);
    } catch (error) {
      console.error('Error cleaning sensor readings:', error);
    }
  });
};