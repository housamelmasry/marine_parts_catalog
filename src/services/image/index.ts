let RNFS: any = null;
try {
  const fs = require('react-native-fs');
  RNFS = fs.default || fs;
} catch (e) {
  console.warn('react-native-fs failed to load, falling back to memory/uri only mode', e);
}

export class ImageService {
  // Offline product images seed placeholders
  private placeholderImages: { [key: string]: string } = {
    part_pump: '🌊',
    part_prop: '🌀',
    part_filter: '⛽',
    part_spark: '⚡',
    default: '⚙️',
  };

  getPlaceholderSymbol(path: string): string {
    return this.placeholderImages[path] || this.placeholderImages.default;
  }

  async copyToAppStorage(uri: string): Promise<string> {
    if (this.placeholderImages[uri]) return uri; // keep seed values
    
    if (!uri) return '';
    if (!RNFS || !RNFS.DocumentDirectoryPath) {
      console.warn('react-native-fs is not available. Using raw URI.');
      return uri;
    }
    try {
      const fileName = `img_${Date.now()}.jpg`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.copyFile(uri, destPath);
      return `file://${destPath}`;
    } catch (e) {
      console.error('Failed to copy image to app storage', e);
      return uri; // fallback
    }
  }

  async generateThumbnail(uri: string): Promise<string> {
    return uri; // For simplicity, we just use original image URI
  }

  async deleteImage(path: string): Promise<boolean> {
    if (this.placeholderImages[path]) return true; // Don't delete seeds
    if (!RNFS) return true;
    try {
      if (path && path.startsWith('file://')) {
        const purePath = path.replace('file://', '');
        const exists = await RNFS.exists(purePath);
        if (exists) {
          await RNFS.unlink(purePath);
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to delete image', e);
      return false;
    }
  }
}

export const imageService = new ImageService();
export default imageService;
