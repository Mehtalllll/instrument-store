interface IUser {
  status: string;
  data: {
    user: {
      _id: string;
      firstname: string;
      lastname: string;
      username: string;
      phoneNumber: number;
      address: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  };
}
