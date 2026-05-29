import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vanigan-app-automation-5il0.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const businessService = {
    // Get all businesses
    getAll: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.subCategory) params.append('subCategory', filters.subCategory);
            if (filters.district) params.append('district', filters.district);
            if (filters.assembly) params.append('assembly', filters.assembly);
            if (filters.search) params.append('search', filters.search);
            if (filters.page) params.append('page', filters.page);
            params.append('limit', '12'); // Perfect for 3-col grid

            const response = await api.get(`/api/public/businesses?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching businesses:', error);
            throw error;
        }
    },

    // Get a specific business by ID
    getById: async (id) => {
        try {
            const response = await api.get(`/api/public/businesses/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching business by ID:', error);
            throw error;
        }
    },

    // Register a new business (Public endpoint)
    add: async (businessData) => {
        try {
            const response = await api.post('/public/register', businessData);
            return response.data;
        } catch (error) {
            console.error('Error registering business:', error);
            throw error;
        }
    },

    // Search business by phone number (backwards parallel batches for speed)
    getByPhone: async (phone, onProgress) => {
        try {
            // First, get total count
            const initial = await axios.get(
                `${API_BASE_URL}/api/public/businesses?limit=1&page=1`,
                { timeout: 60000 }
            );
            const total = initial.data.total || 0;
            if (total === 0) return [];

            const batchSize = 60; // Backend max limit is 60
            const totalPages = Math.ceil(total / batchSize);

            // Process in parallel waves of 10 pages at a time, searching FORWARDS (Page 1 first)
            let allMatches = [];
            const concurrency = 10;

            for (let waveStart = 1; waveStart <= totalPages; waveStart += concurrency) {
                const promises = [];
                for (let i = waveStart; i < Math.min(totalPages + 1, waveStart + concurrency); i++) {
                    promises.push(
                        axios.get(
                            `${API_BASE_URL}/api/public/businesses?limit=${batchSize}&page=${i}`,
                            { timeout: 30000 }
                        ).catch(() => ({ data: { businesses: [] } }))
                    );
                }

                if (onProgress) {
                    onProgress(Math.min(Math.round((waveStart / totalPages) * 100), 100));
                }

                const results = await Promise.all(promises);
                for (const res of results) {
                    const list = res.data.businesses || [];
                    const matches = list.filter(b => {
                        const bPhone = (b.phone || '').replace(/\D/g, '').slice(-10);
                        const bPhone2 = (b.phone2 || '').replace(/\D/g, '').slice(-10);
                        const bWhatsapp = (b.whatsappNo || '').replace(/\D/g, '').slice(-10);
                        const bLandline = (b.landline || '').replace(/\D/g, '').slice(-10);

                        const isMatch = bPhone === phone || bPhone2 === phone || bWhatsapp === phone || bLandline === phone;

                        // Filter out nonsense/test data like 'jhvQDJHWFQBKJ' or purely random garbage
                        const name = b.name || '';
                        const isNonsense = name.length > 8 && /^[A-Z]{5,}/.test(name) && !name.includes(' ');
                        const isSpecificTest = name === 'jhvQDJHWFQBKJ' || b.listingCode === 'LIST24106';

                        return isMatch && !isNonsense && !isSpecificTest;
                    });
                    allMatches = [...allMatches, ...matches];
                }

                // If we found matches in this wave, we can still continue to check if there are others, 
                // but usually, if sorted by Date Desc, Page 1 has the newest.
                // We'll collect ALL matches across ALL pages to be safe, but you could break here if you only want the most recent.
                // For now, let's collect all to resolve the "duplicate blocking" issue.
            }
            return allMatches;
        } catch (error) {
            console.error('Error searching by phone:', error);
            throw error;
        }
    },

    // Get category-wise statistics
    getStats: async () => {
        try {
            // NEVER fetch 100,000 records in one go. It crashes the server.
            // We just fetch 1 record to get the 'total' count from pagination metadata.
            const response = await api.get('/api/public/businesses?limit=1');
            const total = response.data.total || 0;

            // If the backend doesn't provide a category breakdown, we return the total.
            // In a production app, you should have a dedicated /stats endpoint.
            return { total, categories: {} };
        } catch (error) {
            console.error('Error fetching stats:', error);
            return { total: 0, categories: {} };
        }
    }
};

export default api;
