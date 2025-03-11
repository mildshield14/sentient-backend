import * as mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("User", userScheme);

export const getUsers = async () => UserModel.find();

export const getUserByEmail = async (email: string, selectFields?: string) => {
    // Initialize the query without executing it
    const query = UserModel.findOne({ email });

    // If select fields are provided, apply them to the query
    if (selectFields) {
        query.select(selectFields);
    }

    // Execute the query and return the result
    return await query.exec();
};
export const getUserBySessionToken = (sessionToken: String) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const getUserByID = (id: String) => UserModel.findOne({ id });

export const createUser = (values: Record<string, any>) =>
  new UserModel(values)
    .save()
    .then((user: { toObject: () => any }) => user.toObject());

export const deleteUserByID = (id: String) => {
  UserModel.findOneAndDelete({ _id: id });
};

export const updateUserByID = (id: String, values: Record<string, any>) => {
  UserModel.findByIdAndUpdate(id, values, { new: true });
};