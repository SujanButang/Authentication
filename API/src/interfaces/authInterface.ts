export interface IUserRegister {
  body: { email: string; username: string; password: string };
}

export interface IVerifyEmail {
  body: {
    email: string;
  };
}

export interface IVerifyOTP {
  body: {
    email: string;
    otp: number;
  };
}

export interface IUserLogin {
  body: { email: string; password: string };
}
