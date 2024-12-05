export interface ILoginDto extends IUser {
  message: any;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
