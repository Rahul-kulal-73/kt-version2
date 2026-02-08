import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import Feedback from '@/models/Feedback';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
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

        await connectToDatabase();

        // Check if admin
        const requestingUser = await User.findById(decoded.userId);
        if (!requestingUser || requestingUser.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { userId } = await params;

        const feedbacks = await Feedback.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json(feedbacks, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching feedback:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
