// packages
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// utils
import clientPromise from '@/utils/database';
import { send200, send400, send401, send500 } from '@/utils/api-responses';
import { comparePasswords } from '@/utils/password';

// types
import { User } from '@/types/user';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) throw 400;

        const client = await clientPromise;
        const database = client.db(process.env.DATABASE_NAME);

        const user = await database.collection<User>('users').findOne({ email });

        if (!user) throw 401;
        if (!(await comparePasswords(password, user.password))) throw 401;

        if (!process.env.JWT_SECRET) {
            throw new Error(
                'JWT_SECRET is not defined in environment variables'
            );
        }

        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '20m' }
        );

        return send200({ token: token }, 'Users fetched successfully');
    } catch (error) {
        if (error === 400) {
            return send400('Email and password are required');
        } else if (error === 401) {
            return send401('Email and password are incorrect');
        } else {
            console.error('Error in login:', error);
            return send500();
        }
    }
}
