import { Alert } from 'react-native';
import Share from 'react-native-share';
import { Product } from '../../database/db';
import { imageService } from '../image';

export interface ShareOptions {
  includeTitle: boolean;
  includePrice: boolean;
  includeTags: boolean;
  includeNotes: boolean;
  selectedImages: string[];
}

const defaultOptions: ShareOptions = {
  includeTitle: true,
  includePrice: true,
  includeTags: true,
  includeNotes: false,
  selectedImages: [],
};

function buildMessage(product: Product, options: ShareOptions): string {
  const parts: string[] = [];
  if (options.includeTitle) parts.push(product.title);
  if (options.includePrice) parts.push(`Price: ${product.price} EGP`);
  if (options.includeTags && product.tags) parts.push(`Tags: ${product.tags}`);
  if (options.includeNotes && product.notes)
    parts.push(`Notes: ${product.notes}`);
  return parts.join('\n');
}

function getMimeTypeFromPath(path: string): string {
  const normalized = path.toLowerCase();
  if (normalized.endsWith('.png')) return 'image/png';
  if (normalized.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

function getProductImageUrls(product: Product): string[] {
  // Get all images from image_path (can be comma-separated)
  const imageUris = imageService.getProductImages(product.image_path);
  if (imageUris.length > 0) {
    return imageUris;
  }

  // Fallback to thumbnail_path if no main images
  const thumbnailUris = imageService.getProductImages(product.thumbnail_path);
  return thumbnailUris;
}

export class ShareService {
  static async shareProduct(
    product: Product,
    options: ShareOptions = defaultOptions,
    app?: 'whatsapp' | 'telegram' | 'messenger' | 'facebook' | 'system',
  ): Promise<void> {
    const message = buildMessage(product, options);
    const selectedImages =
      options.selectedImages && options.selectedImages.length > 0
        ? options.selectedImages
        : [];

    const shareOptions: any = {
      title: product.title,
      subject: product.title,
      message,
      failOnCancel: false,
    };

    // Handle multiple images
    if (selectedImages.length > 0) {
      if (selectedImages.length === 1) {
        // Single image
        shareOptions.url = selectedImages[0];
        shareOptions.type = getMimeTypeFromPath(selectedImages[0]);
      } else {
        // Multiple images - use urls array
        shareOptions.urls = selectedImages;
        shareOptions.type = 'image/*';
      }
    }

    try {
      if (app === 'whatsapp') {
        await Share.shareSingle({
          ...shareOptions,
          social: Share.Social.WHATSAPP,
        });
      } else if (app === 'telegram') {
        await Share.shareSingle({
          ...shareOptions,
          social: Share.Social.TELEGRAM,
        });
      } else if (app === 'messenger') {
        await Share.shareSingle({
          ...shareOptions,
          social: Share.Social.MESSENGER,
        });
      } else if (app === 'facebook') {
        await Share.shareSingle({
          ...shareOptions,
          social: Share.Social.FACEBOOK,
        });
      } else {
        await Share.open(shareOptions);
      }
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        console.warn('Share failed:', error);
        Alert.alert('Share Error', 'Could not share the product.');
      }
    }
  }

  static getProductImageUrls(product: Product): string[] {
    return getProductImageUrls(product);
  }
}
export default ShareService;
