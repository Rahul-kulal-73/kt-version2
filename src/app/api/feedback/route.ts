import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import Feedback from '@/models/Feedback';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as any;
        } catch (err) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        if (!decoded.userId) {
            return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
        }

        await connectToDatabase();

        const data = await req.json();
        const { sentiment, message } = data;

        if (!sentiment) {
            return NextResponse.json({ message: 'Sentiment is required' }, { status: 400 });
        }

        const newFeedback = await Feedback.create({
            userId: decoded.userId,
            sentiment,
            message
        });

        return NextResponse.json(newFeedback, { status: 201 });
    } catch (error: any) {
        console.error('Error submitting feedback:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
