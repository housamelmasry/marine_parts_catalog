import { Alert } from 'react-native';
import Share from 'react-native-share';
import { Product } from '../../database/db';
import { imageService } from '../image';

export interface ShareOptions {
  includeTitle: boolean;
  includePrice: boolean;
  includeTags: boolean;
  includeNotes: boolean;
  includeImage: boolean;
}

const defaultOptions: ShareOptions = {
  includeTitle: true,
  includePrice: true,
  includeTags: true,
  includeNotes: false,
  includeImage: true,
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

function getImageUrl(product: Product): string | null {
  const imageUris = imageService.getProductImages(product.image_path);
  const imageUri = imageUris.find(uri => uri?.startsWith('file://'));
  if (imageUri) return imageUri;

  const thumbnailUris = imageService.getProductImages(product.thumbnail_path);
  return thumbnailUris.find(uri => uri?.startsWith('file://')) || null;
}

export class ShareService {
  static async shareProduct(
    product: Product,
    options: ShareOptions = defaultOptions,
    app?: 'whatsapp' | 'system',
  ): Promise<void> {
    const message = buildMessage(product, options);
    const imageUrl = options.includeImage ? getImageUrl(product) : null;

    const shareOptions: any = {
      title: product.title,
      subject: product.title,
      message,
      failOnCancel: false,
    };

    if (imageUrl) {
      shareOptions.url = imageUrl;
      shareOptions.type = getMimeTypeFromPath(imageUrl);
    }

    try {
      if (app === 'whatsapp') {
        await Share.shareSingle({
          ...shareOptions,
          social: Share.Social.WHATSAPP,
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
}
export default ShareService;
