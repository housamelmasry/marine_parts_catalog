import { Alert, Share, Linking, Platform } from 'react-native';
import { Product } from '../../database/db';
import { Part } from '../../constants/mockData';
import { imageService } from '../image';

export const ShareService = {
  async shareProduct(product: Product): Promise<void> {
    const text = `
⚓ *Marine Part Quote*
---------------------------------------
*Product*: ${product.title}
*Price*: ${product.price} EGP
*Tags*: ${product.tags}
${product.notes ? `*Notes*: ${product.notes}\n` : ''}
Generated via Marine Parts App.
`.trim();

    const images = imageService.getProductImages(product.image_path);
    const primaryImage = images[0] || '';
    const hasCustomImage = primaryImage && primaryImage.startsWith('file://');

    const shareTextOnly = async () => {
      try {
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          await Share.share({
            title: product.title,
            message: text,
          });
        }
      } catch (e: any) {
        try {
          await Share.share({
            title: product.title,
            message: text,
          });
        } catch (err: any) {
          Alert.alert('Sharing Error', err.message);
        }
      }
    };

    const shareWithImage = async () => {
      try {
        await Share.share({
          title: product.title,
          message: text,
          url: Platform.OS === 'ios' ? primaryImage : undefined,
        });
      } catch (e: any) {
        Alert.alert('Sharing Error', e.message);
      }
    };

    if (hasCustomImage) {
      Alert.alert(
        'Share Product Quote',
        'How would you like to share this quote?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'WhatsApp Text Only', onPress: shareTextOnly },
          { text: 'Share Sheet with Image', onPress: shareWithImage },
        ]
      );
    } else {
      await shareTextOnly();
    }
  },

  async sharePartDetails(part: Part): Promise<void> {
    const text = `
⚓ *Marine Part Quote*
---------------------------------------
*Part*: ${part.name}
*Part Number*: ${part.partNumber}
*Price*: $${part.price.toFixed(2)}
*Description*: ${part.description}
*Compatibility*: ${part.compatibleModels.join(', ')}
Generated via Marine Parts App.
`.trim();

    try {
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Share.share({
          title: part.name,
          message: text,
        });
      }
    } catch (e: any) {
      try {
        await Share.share({
          title: part.name,
          message: text,
        });
      } catch (err: any) {
        Alert.alert('Sharing Error', err.message);
      }
    }
  },

  async shareCart(cart: { part: Part; quantity: number }[]): Promise<void> {
    let itemsText = '';
    let total = 0;
    cart.forEach((item, index) => {
      const itemTotal = item.part.price * item.quantity;
      total += itemTotal;
      itemsText += `${index + 1}. [${item.part.partNumber}] ${item.part.name} x${item.quantity} - $${itemTotal.toFixed(2)}\n`;
    });

    const text = `
⚓ *Marine Parts Cart Quotation*
---------------------------------------
${itemsText}
---------------------------------------
*Total Estimated Price*: $${total.toFixed(2)}
Generated via Marine Parts App.
`.trim();

    try {
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Share.share({
          title: 'Parts Quote',
          message: text,
        });
      }
    } catch (e: any) {
      try {
        await Share.share({
          title: 'Parts Quote',
          message: text,
        });
      } catch (err: any) {
        Alert.alert('Sharing Error', err.message);
      }
    }
  },
};
export default ShareService;
