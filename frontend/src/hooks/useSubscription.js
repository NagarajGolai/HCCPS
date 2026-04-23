import { useState, useEffect } from 'react';
import client from '../api/client';

export const useSubscription = () => {
    const [subscription, setSubscription] = useState({
        plan: 'free',
        is_active: false,
        expires_at: null,
        loading: true
    });

    const fetchStatus = async () => {
        try {
            const token = localStorage.getItem('propverse_access_token');
            if (!token) {
                setSubscription(prev => ({ ...prev, loading: false }));
                return;
            }
            const response = await client.get('/payments/subscription-status/');
            setSubscription({
                ...response.data,
                loading: false
            });
        } catch (error) {
            console.error("Error fetching subscription status:", error);
            setSubscription(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return { ...subscription, refresh: fetchStatus };
};
