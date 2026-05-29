import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    firstName?: string;
    lastName?: string;
    email: string;
    passwordHash: string;
    role: 'user' | 'admin';
    matchPassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
    {
        first_name: { type: String, trim: true },
        last_name:  { type: String, trim: true },
        email: { type: String,
                 required: [true, 'Please add email'],
                 unique: true,
                 trim: true,
                 match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'] },
        passwordHash: { type: String, required: [true, 'Please add secure password'] },
        role: { type: String, enum: ['user', 'admin'], default: 'user', required: true }
    },
    { timestamps: true }
);

userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('passwordHash')) { return; }

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export default mongoose.model<IUser>('User', userSchema);