import { createContext } from 'react';

export const CollectionCategoriesContext = createContext({ data: [], refresh: () => {} });
CollectionCategoriesContext.displayName = 'CollectionCategoriesContext';
