import { useState, useEffect, useCallback } from 'react';
import { productRepository } from '../repository/ProductRepository';
import { Product } from '../../../database/db';

export function useProducts(searchQuery: string, selectedTag: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch matching parts
      const list = await productRepository.search(searchQuery);
      
      // Filter by tag if selected
      let filtered = list;
      if (selectedTag && selectedTag !== 'All') {
        filtered = list.filter(p => 
          p.tags.toLowerCase().includes(selectedTag.toLowerCase())
        );
      }
      
      setProducts(filtered);

      // Extract all unique tags for filter chips across the whole database
      const allDB = await productRepository.getAll();
      const tagsSet = new Set<string>();
      allDB.forEach(p => {
        // Match hashtag words like #yamaha #pump
        const matches = p.tags.match(/#[a-zA-Z0-9]+/g);
        if (matches) {
          matches.forEach(tag => tagsSet.add(tag));
        }
      });
      setAllTags(Array.from(tagsSet));
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTag]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    allTags,
    refresh: loadProducts,
  };
}
export default useProducts;
