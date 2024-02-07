import { ReactNode, createContext, useState } from "react";

type Props = {
  children?: ReactNode;
};

type IAuthContext = {
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialValue = {
  authenticated: localStorage.getItem("accessToken") ? true : false,
  setAuthenticated: () => {},
  login: async () => {},
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState<boolean>(
    initialValue.authenticated
  );

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
