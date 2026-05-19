# Marine Parts Catalog App — Reference Design

## Project Goal

Offline-first mobile application for organizing marine spare part images locally on the device.

The app should:

- Work fully offline
- Store data locally using SQLite
- Store images locally on device storage
- Provide fast search
- Allow quick WhatsApp sharing
- Be simple enough for non-technical users

---

# Tech Stack

## Mobile

- React Native CLI
- TypeScript
- Zustand
- SQLite

## Recommended Libraries

### Database

```bash
npm install react-native-quick-sqlite
```

### Image Picker

```bash
npm install react-native-image-picker
```

### File System

```bash
npm install react-native-fs
```

### Navigation

```bash
npm install @react-navigation/native
```

### State Management

```bash
npm install zustand
```

---

# Suggested Folder Structure

```txt
src/
│
├── app/
│   ├── providers/
│   ├── store/
│   ├── theme/
│   └── App.tsx
│
├── database/
│   ├── db.ts
│   ├── migrations/
│   ├── repositories/
│   └── queries/
│
├── navigation/
│   ├── RootNavigator.tsx
│   └── types.ts
│
├── services/
│   ├── image/
│   ├── backup/
│   ├── share/
│   └── search/
│
├── shared/
│   ├── components/
│   ├── ui/
│   └── modals/
│
├── features/
│   ├── products/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── repository/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── search/
│   ├── settings/
│   └── backup/
│
├── hooks/
├── constants/
├── utils/
├── types/
└── assets/
```

---

# Database Design

## products table

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  price REAL,
  tags TEXT,
  notes TEXT,
  image_path TEXT NOT NULL,
  thumbnail_path TEXT,
  created_at TEXT,
  updated_at TEXT
);
```

---

# Recommended Architecture Flow

```txt
Screen
 ↓
Hook
 ↓
Service
 ↓
Repository
 ↓
SQLite
```

---

# UI Reference Design

# 1. Home Screen

## Goal

Fast search and image browsing.

## Layout

```txt
-------------------------------------------------
| Search products...                            |
-------------------------------------------------

[ Filters ]

-------------------------------------------------
|   IMG    |   IMG    |
| Yamaha   | Mercury  |
| 2500 EGP | 3200 EGP |
-------------------------------------------------
|   IMG    |   IMG    |
| Pump     | Filter   |
| 1800 EGP | 900 EGP  |
-------------------------------------------------

                     (+)
```

## Features

- Instant search
- Grid layout
- Floating Add button
- Fast scrolling
- Lazy image loading

---

# 2. Add Product Screen

## Goal

Fastest possible product creation.

## Layout

```txt
---------------------------------
|        Product Image          |
|         [ Select ]            |
---------------------------------

Title
[________________________]

Price
[________________________]

Tags
[________________________]

Notes
[________________________]

[ SAVE PRODUCT ]
```

## Important UX Notes

- Keep form minimal
- Avoid too many fields
- Large buttons
- One-handed usage

---

# 3. Product Details Screen

## Layout

```txt
---------------------------------
|                               |
|         LARGE IMAGE           |
|                               |
---------------------------------

Yamaha Water Pump

2500 EGP

Tags:
#yamaha #pump #40hp

Notes:
Original Japanese

[ SHARE ]
[ EDIT ]
[ DELETE ]
```

---

# Image Storage Strategy

## Recommended Flow

1. User selects image
2. Copy image into app storage
3. Generate thumbnail
4. Save paths into SQLite

---

# Suggested App Storage Structure

```txt
/storage/app/
│
├── products/
│   ├── original/
│   └── thumbnails/
│
└── backup/
```

---

# Product Repository Example

```ts
class ProductRepository {
  async create(product) {}

  async update(id, data) {}

  async delete(id) {}

  async search(query) {}

  async getAll() {}
}
```

---

# Image Service Example

```ts
class ImageService {
  async copyToAppStorage(uri) {}

  async generateThumbnail(uri) {}

  async deleteImage(path) {}
}
```

---

# Suggested Search Strategy

## Phase 1

Use SQLite LIKE search.

```sql
SELECT * FROM products
WHERE title LIKE '%yamaha%'
OR tags LIKE '%yamaha%';
```

---

## Phase 2

Use SQLite FTS5 for full text search.

Benefits:

- Faster search
- Better matching
- Scales better with thousands of products

---

# Suggested Zustand Store

## Keep only UI state in store

Do NOT store all products in memory.

Good store usage:

```ts
-searchQuery - selectedProduct - filters - uiState;
```

Bad usage:

```ts
- thousands of images
- full product database
```

---

# Suggested Future Features

## Phase 2

- Backup & Restore
- QR code generation
- Product categories
- Favorites
- Recently viewed

---

## Phase 3

- OCR for extracting part numbers
- AI-generated tags
- Smart search
- Voice search
- Optional cloud sync

---

# Performance Recommendations

## Important

- Never store base64 images in SQLite
- Store image paths only
- Use FlatList
- Use thumbnails for grid display
- Lazy load large images

---

# Security Recommendations

## Optional

- App lock PIN
- Encrypted SQLite
- Backup encryption

---

# MVP Scope Recommendation

## Build ONLY these features first:

- Add product
- Search products
- View details
- Share image + price
- Delete/Edit product

Avoid adding:

- Accounts
- Online sync
- Complex analytics
- Multi-user support
- Dashboard

until the app is used in real life for a few weeks.

---

# Final Recommendation

The most important success factor is:

## Speed of usage

The user should be able to:

1. Open app
2. Search product
3. Send image to customer

within seconds.

Everything else is secondary.
