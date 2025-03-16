import mongoose, { ObjectId } from "mongoose";

const userScheme = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
});

export const UserModel = mongoose.model("User", userScheme);

export const getUsers = async () => {
    return UserModel.find();
};

export const getUserByEmail = async (email: string, selectFields?: string) => {
    const query = UserModel.findOne({ email });
    if (selectFields) {
        query.select(selectFields);
    }
    return query.exec();
};

export const getUserBySessionToken = (sessionToken: string) => {
    return UserModel.findOne({ "authentication.sessionToken": sessionToken });
};

export const getUserByID = (id: string) => {
    return UserModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
};

export const createUser = (values: Record<string, any>) => {
    return new UserModel(values)
        .save()
        .then((user) => user.toObject());
};

export const deleteUserByID = (id: string) => {
    // Return the deletion query result
    return UserModel.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
};

export const updateUserByID = (id: string, values: Record<string, any>) => {
    // Return the updated user; { new: true } returns the document AFTER the update
    return UserModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        values,
        { new: true }
    );
};
