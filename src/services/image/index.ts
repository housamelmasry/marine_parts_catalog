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

  /**
   * Copy an image picked from local storage into the app's private documents folder.
   * This makes the path permanent and independent of Android's ephemeral content:// URIs.
   *
   * How it works:
   *  1. The user picks an image → react-native-image-picker returns a URI like:
   *       Android:  content://media/external/images/media/123
   *       iOS:      file:///var/mobile/Media/DCIM/...
   *  2. We copy the file to:
   *       <DocumentsDir>/img_<timestamp>.jpg
   *  3. We store ONLY this permanent file:// path in the database.
   *     On next app start, the image loads from the private folder — no permission needed.
   */
  async copyToAppStorage(uri: string): Promise<string> {
    // Keep seeded placeholder keys unchanged
    if (this.placeholderImages[uri]) return uri;
    if (!uri) return '';

    if (!RNFS || !RNFS.DocumentDirectoryPath) {
      console.warn('ImageService: react-native-fs not available, storing raw URI (may not persist).');
      return uri;
    }

    try {
      const fileName = `img_${Date.now()}.jpg`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // RNFS.copyFile handles both content:// (Android) and file:// (iOS/Android)
      await RNFS.copyFile(uri, destPath);

      const permanentUri = `file://${destPath}`;
      console.log(`ImageService: Image copied to permanent storage → ${permanentUri}`);
      return permanentUri;
    } catch (e: any) {
      console.error('ImageService: Failed to copy image to app storage.', e?.message || e);
      // Return the raw URI as fallback — it will display but may not survive restarts
      return uri;
    }
  }

  async generateThumbnail(uri: string): Promise<string> {
    // Reuse the same permanent path as the full image (no resizing needed for now)
    return uri;
  }

  async deleteImage(path: string): Promise<boolean> {
    if (this.placeholderImages[path]) return true; // Don't delete seed data
    if (!RNFS) return true;
    try {
      if (path && path.startsWith('file://')) {
        const purePath = path.replace('file://', '');
        const exists = await RNFS.exists(purePath);
        if (exists) {
          await RNFS.unlink(purePath);
          console.log(`ImageService: Deleted image at ${purePath}`);
        }
      }
      return true;
    } catch (e) {
      console.error('ImageService: Failed to delete image', e);
      return false;
    }
  }

  getProductImages(path: string | undefined): string[] {
    if (!path) return [];
    // If it is a seed asset placeholder or single path
    if (this.placeholderImages[path]) return [path];
    return path.split(',').map(s => s.trim()).filter(Boolean);
  }

  async deleteProductImages(paths: string | undefined): Promise<void> {
    const list = this.getProductImages(paths);
    for (const p of list) {
      await this.deleteImage(p);
    }
  }
}

export const imageService = new ImageService();
export default imageService;

