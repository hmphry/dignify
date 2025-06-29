// packages
import { NextResponse } from 'next/server';

// utils
import clientPromise from '@/utils/database';
import { hashPassword, isValidPassword } from '@/utils/password';
import { send200, send400, send409, send500 } from '@/utils/api-responses';

// types
import { User } from '@/types/user';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { email, name, password, confirmPassword } = body;

        if (!email || !password || !name || !confirmPassword)
            throw {
                code: 400,
                message: 'Email, name, and password are required fields',
            };
        if (password !== confirmPassword)
            throw { code: 400, message: 'Passwords do not match' };

        if (isValidPassword(password) !== true)
            throw {
                code: 400,
                message: 'Passwords does not meet the requirements.',
            };

        const client = await clientPromise;
        const database = client.db(process.env.DATABASE_NAME);

        const checkEmail = await database
            .collection<User>('users')
            .findOne({ email });
        if (checkEmail)
            throw {
                code: 409,
                message: 'An account for that email already exists',
            };

        const user: User = {
            email,
            name,
            password: await hashPassword(password),
            createdAt: new Date(),
            role: 'user',
        };

        const result = await database.collection<User>('users').insertOne(user);

        return send200(
            {
                _id: result.insertedId.toString(),
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            'User created successfully'
        );
    } catch (error) {
        if (error.code === 400) {
            return send400(error.message);
        } else if (error.code === 409) {
            return send409(error.message);
        } else {
            console.error('Error', error);
            return send500();
        }
    }
}

export async function GET(): Promise<NextResponse> {
    return NextResponse.json({ message: 'Not implemented' }, { status: 500 });
}
