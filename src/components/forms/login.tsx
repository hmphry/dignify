'use client';

// packages
import { useEffect, useState } from 'react';

// components
import Input, {PasswordInput} from '@/components/ui/input';

// hooks
import {useFetch} from '@/hooks/fetch';

interface LoginCredentials {
    email?: string;
    password?: string;
}

export default function Home() {
    const { handleLogin, updateCredentials } = useLogin();

    return (
        <div>
            <form className='grid grid-cols-1 gap-4 p-4' onSubmit={handleLogin}>
                <h2 className='font-display text-4xl text-foreground'>Log In</h2>
                <Input 
                    type="email" 
                    placeholder="Email" 
                    label="Email"
                    onChange={(event) => updateCredentials({ email: event.target.value })}
                />
                <PasswordInput 
                    type="password" 
                    placeholder="Password" 
                    label="Password"
                    onChange={(event) => updateCredentials({ password: event.target.value })}
                />
                <button>Log In</button>
            </form>
        </div>
    );
}


// login hook
function useLogin() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const { fetchData, data, loading, error } = useFetch(["login"], {
        method: 'POST',
        body: credentials,
    });

    const handleLogin = async (event: Event) => {
        event.preventDefault();
        const response = await fetchData();
        console.log(response);
    }

    const updateCredentials = (data: LoginCredentials) => {
        setCredentials((previous) => ({
            ...previous,
            ...data,
        }));
    }

    useEffect(() => {
        console.log(credentials)
    }, [credentials]);

    useEffect(() => {
        console.log("loading:",loading)
        console.log("data:",data)
        console.log("error:",error)
    }, [data, loading, error]);

    return {
        handleLogin,
        updateCredentials
    }
}
