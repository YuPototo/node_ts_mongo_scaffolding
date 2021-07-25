import bcrypt from "bcrypt";
import { Schema, Document, model, Model } from "mongoose";

interface IUserDocument extends Document {
    password: string;
    username: string;
    createdAt: Date;
}

export interface IUser extends IUserDocument {
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    password: { type: String, required: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}).index({ username: 1 }, { unique: true });

userSchema.pre<IUserDocument>("save", async function (next): Promise<void> {
    if (!this.isModified("password")) next();

    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    const { password } = this;
    try {
        return await bcrypt.compare(candidatePassword, password);
    } catch (err) {
        throw err;
    }
};

// 我不太确定下面的 transform functon 该怎么 type，教程里没有给 type
userSchema.set("toJSON", {
    transform: function (doc: any, ret: any) {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
    },
});

export interface IUserModel extends Model<IUser> {
    // collection/docouments level operations (fetch one or many, update, save back to db)
}

export const User: IUserModel = model<IUser, IUserModel>("User", userSchema);

export default User;
