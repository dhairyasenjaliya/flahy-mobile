import api from './api';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    amount?: number;
    product_amount?: string;
    tax_percent?: string;
    tax_amount?: string;
    currency?: string;
}

export const productService = {
    getAllProducts: async () => {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },

    getProductBySlug: async (slug: string) => {
        const response = await api.get<Product>(`/product/${slug}`);
        return response.data;
    }
};
