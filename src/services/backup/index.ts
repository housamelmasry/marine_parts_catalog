import { storage } from '../../utils/storage';

export interface BackupPayload {
  version: string;
  timestamp: string;
  theme: string;
  preferredWarehouse: string;
  cart: string;
}

export const BackupService = {
  async createBackup(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payload: BackupPayload = {
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          theme: storage.getItem('theme') || 'dark',
          preferredWarehouse: storage.getItem('preferred_warehouse') || 'Miami',
          cart: storage.getItem('cart') || '[]',
        };
        resolve(JSON.stringify(payload, null, 2));
      }, 1500); // Simulate disk or server delay
    });
  },

  async restoreBackup(backupJson: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const parsed = JSON.parse(backupJson) as BackupPayload;
          if (parsed.version && parsed.timestamp) {
            if (parsed.theme) storage.setItem('theme', parsed.theme);
            if (parsed.preferredWarehouse) storage.setItem('preferred_warehouse', parsed.preferredWarehouse);
            if (parsed.cart) storage.setItem('cart', parsed.cart);
            resolve(true);
          } else {
            reject(new Error('Invalid backup structure'));
          }
        } catch (e) {
          reject(new Error('Corrupted or invalid JSON backup file.'));
        }
      }, 1500);
    });
  },
};
export default BackupService;
