export interface IMessageResponse {
  message: string;
  status: number;
}
export interface ILoginMessageResponse {
  message: string;
  status: number;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface IUserDataResponse {
  id: string;
  email: string;
  username: string;
  profileImage: string;
  bio: string;
}
