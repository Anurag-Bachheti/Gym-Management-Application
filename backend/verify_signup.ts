import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import Member from './src/models/Member';

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'testmember@example.com' });
        if (user) {
            console.log('User found:', user);
            const member = await Member.findOne({ user: user._id });
            if (member) {
                console.log('Member found:', member);
            } else {
                console.log('Member NOT found for user');
            }
        } else {
            console.log('User NOT found');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

verify();
