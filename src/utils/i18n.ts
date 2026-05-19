import { useUIStore } from '../app/store';

export const translations = {
  en: {
    // Tab bar / Navigation
    home: 'Home',
    add: 'Add',
    settings: 'Settings',

    // Home / Catalog Screen
    appTitle: 'Loay Marine Parts',
    appSubtitle: 'Catalog',
    searchPlaceholder: 'Search parts...',
    allProducts: 'All Products',
    recent: 'Recent',
    seeAll: 'See all',
    allParts: 'All Parts ({count})',
    noItemsFound: 'No Catalog Items Found',
    emptyCatalogDesc: 'Tap the floating (+) button below to create your first offline part worksheet.',
    recentWorksheetAlert: 'No new spares worksheet updates.',
    notificationsTitle: 'Notifications',

    // Settings Screen
    appConfigMaintenance: 'APP CONFIGURATION & MAINTENANCE',
    backupData: 'Backup Data',
    restoreBackup: 'Restore Backup',
    exportCatalog: 'Export Catalog',
    darkMode: 'Dark Mode',
    language: 'Language',
    aboutApp: 'About App',
    offlineStorageMetrics: 'OFFLINE STORAGE METRICS',
    activeDbEngine: 'Active Database Engine',
    sqliteOfflineCore: 'SQLite Offline Core',
    productsRegistered: 'Products Registered',
    softwareEdition: 'Software Edition',
    catalogAdmin: 'CATALOG ADMINISTRATION',
    resetAppDb: 'Reset App Database',
    resetDbDesc: 'Erase custom products and reseed default spares worksheets',
    resetBtn: 'Reset',
    resetAlertTitle: 'Reset Offline Database',
    resetAlertConfirm: 'This will erase all catalog items and restore the initial seeding. Are you sure?',
    cancel: 'Cancel',
    dbResetAlertDone: 'Please restart the app to seed clean data.',
    dbResetSuccessTitle: 'Database Reset',
    exportAlertTitle: 'Export Catalog',
    exportAlertDesc: 'Your spare parts offline catalog worksheet has been successfully compiled and copied to system backup registry.',

    // Add Product Screen
    addNewProduct: 'Add New Product',
    selectCategoryIcon: 'SELECT PRODUCT CATEGORY ICON',
    productTitleLabel: 'Product Title *',
    categoryLabel: 'Category',
    priceLabel: 'Price (EGP)',
    productPhotoLabel: 'PRODUCT PHOTO',
    noPhotoSelected: 'No photo selected. Using category icon by default.',
    changePhoto: 'CHANGE PHOTO',
    selectFromGallery: 'SELECT FROM GALLERY',
    tagsLabel: 'Tags (comma or space separated, e.g. #yamaha #pump)',
    notesLabel: 'Technical Notes / Notes',
    saveProductBtn: 'SAVE PRODUCT',
    validationErr: 'Validation Error',
    titleRequired: 'Product title is required.',
    catalogSuccess: 'Catalog Success',
    productAddedSuccess: '"{title}" has been successfully added to offline SQLite.',

    // General / Common
    activeDb: 'SQLite Offline Core',
    itemsCount: '{count} items',
    mvpEdition: 'MVP v1.0.0',
    details: 'Product Details',
    edit: 'Edit Product',
    share: 'Share',
    delete: 'Delete',
    back: 'Back',

    // Product Category options
    part_pump: 'Pump',
    part_prop: 'Propeller',
    part_filter: 'Fuel Filter',
    part_spark: 'Spark Plug',
    defaultIcon: 'Anchor',
  },
  ar: {
    // Tab bar / Navigation
    home: 'الرئيسية',
    add: 'إضافة',
    settings: 'الإعدادات',

    // Home / Catalog Screen
    appTitle: 'لؤي لقطع الغيار البحرية',
    appSubtitle: 'الكتالوج',
    searchPlaceholder: 'ابحث عن قطع الغيار...',
    allProducts: 'كل المنتجات',
    recent: 'الأخيرة',
    seeAll: 'عرض الكل',
    allParts: 'كل قطع الغيار ({count})',
    noItemsFound: 'لم يتم العثور على قطع غيار',
    emptyCatalogDesc: 'اضغط على الزر العائم (+) في الأسفل لإضافة أول قطعة غيار في الكتالوج.',
    recentWorksheetAlert: 'لا توجد تحديثات جديدة لقطع الغيار.',
    notificationsTitle: 'الإشعارات',

    // Settings Screen
    appConfigMaintenance: 'تهيئة وصيانة التطبيق',
    backupData: 'نسخ البيانات احتياطيًا',
    restoreBackup: 'استعادة النسخ الاحتياطي',
    exportCatalog: 'تصدير الكتالوج',
    darkMode: 'الوضع الداكن',
    language: 'اللغة',
    aboutApp: 'حول التطبيق',
    offlineStorageMetrics: 'مقاييس التخزين المحلي',
    activeDbEngine: 'محرك قاعدة البيانات النشط',
    sqliteOfflineCore: 'نواة SQLite المحلية',
    productsRegistered: 'قطع الغيار المسجلة',
    softwareEdition: 'نسخة البرنامج',
    catalogAdmin: 'إدارة الكتالوج',
    resetAppDb: 'إعادة تعيين قاعدة البيانات',
    resetDbDesc: 'مسح كافة قطع الغيار المخصصة وإعادة تعيين البيانات الافتراضية',
    resetBtn: 'إعادة تعيين',
    resetAlertTitle: 'إعادة تعيين قاعدة البيانات المحلية',
    resetAlertConfirm: 'سيؤدي هذا إلى مسح كافة عناصر الكتالوج واستعادة البيانات الافتراضية. هل أنت متأكد؟',
    cancel: 'إلغاء',
    dbResetAlertDone: 'يرجى إعادة تشغيل التطبيق لتهيئة بيانات نظيفة.',
    dbResetSuccessTitle: 'إعادة تعيين قاعدة البيانات',
    exportAlertTitle: 'تصدير الكتالوج',
    exportAlertDesc: 'تم تصدير كتالوج قطع الغيار بنجاح ونسخه إلى سجل النسخ الاحتياطي للنظام.',

    // Add Product Screen
    addNewProduct: 'إضافة منتج جديد',
    selectCategoryIcon: 'اختر أيقونة فئة المنتج',
    productTitleLabel: 'عنوان المنتج *',
    categoryLabel: 'الفئة',
    priceLabel: 'السعر (جنيه مصري)',
    productPhotoLabel: 'صورة المنتج',
    noPhotoSelected: 'لم يتم تحديد صورة. سيتم استخدام أيقونة الفئة افتراضيًا.',
    changePhoto: 'تغيير الصورة',
    selectFromGallery: 'اختر من معرض الصور',
    tagsLabel: 'الوسوم (مفصولة بفاصلة أو مسافة، مثال: #ياماها #طلمبة)',
    notesLabel: 'ملاحظات فنية / ملاحظات',
    saveProductBtn: 'حفظ المنتج',
    validationErr: 'خطأ في التحقق',
    titleRequired: 'عنوان المنتج مطلوب.',
    catalogSuccess: 'تم بنجاح',
    productAddedSuccess: 'تم إضافة "${title}" بنجاح إلى قاعدة بيانات SQLite المحلية.',

    // General / Common
    activeDb: 'نواة SQLite المحلية',
    itemsCount: '{count} عناصر',
    mvpEdition: 'MVP v1.0.0',
    details: 'تفاصيل المنتج',
    edit: 'تعديل المنتج',
    share: 'مشاركة',
    delete: 'حذف',
    back: 'رجوع',

    // Product Category options
    part_pump: 'طلمبة',
    part_prop: 'رفاص (بروبيلر)',
    part_filter: 'فلتر وقود',
    part_spark: 'بوجيه (شمعة احتراق)',
    defaultIcon: 'مخطاف (هلب)',
  },
};

export type Language = 'ar' | 'en';

export function useTranslation() {
  const language = useUIStore((state) => state.language || 'ar');
  const setLanguage = useUIStore((state) => state.setLanguage);

  const t = (key: keyof typeof translations['en'], params?: { [key: string] : any }) => {
    const activeLang = language === 'ar' ? 'ar' : 'en';
    let text = translations[activeLang][key] || translations['en'][key] || String(key);
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return text;
  };

  const isRTL = language === 'ar';

  return { t, language, setLanguage, isRTL };
}
