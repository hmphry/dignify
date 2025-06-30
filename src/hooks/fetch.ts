import { useState, useEffect, useCallback } from 'react';

type FetchState<T> = {
    data: T | undefined;
    loading: boolean;
    error: string | undefined;
};

type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: Record<string, unknown> | string;
    autoFetch?: boolean;
};

export function useFetch<Data = unknown>(
    url: string[] | undefined,
    options: FetchOptions = {}
): FetchState<Data> & { fetchData: () => Promise<Data | undefined>; refetch: () => Promise<void> } {
    const [state, setState] = useState<FetchState<Data>>({
        data: undefined,
        loading: false,
        error: undefined,
    });

    const {
        method = 'GET',
        headers = {},
        body,
        autoFetch = false,
    } = options;

    const fetchData = useCallback(async (): Promise<Data | undefined> => {
        if (!url) {
            setState(previous => ({ ...previous, loading: false, error: 'URL is required' }));
            return;
        }

        setState(previous => ({ ...previous, loading: true, error: undefined }));

        try {
            // Get token from globalstate if available
            // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

            const config: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    // ...(token && { Authorization: `Bearer ${token}` }),
                    ...headers,
                },
            };

            // Only add body for non-GET requests
            if (body && method !== 'GET') {
                config.body = typeof body === 'string' ? body : JSON.stringify(body);
            }

            const response = await fetch("/" + ["api", ...url].join("/"), config);

            // TODO: handle errors here
            if (!response.ok) {
                setState({ data: undefined, loading: false, error: response.statusText });
            }
            
            const data = await response.json() as Data;
            console.log('Response data:', data);
            
            // Update state with successful data
            setState({ data, loading: false, error: undefined });
            return data;
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            console.error('Fetch error:', error);
            
            // Update state with error
            setState({
                data: undefined,
                loading: false,
                error: errorMessage,
            });
            
            throw error; // Re-throw so caller can handle it
        }
    }, [url, method, headers, body]);

    const refetch = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch, fetchData]);

    return {
        ...state,
        fetchData,
        refetch,
    };
}