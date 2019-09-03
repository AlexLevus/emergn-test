export interface User {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface UserUpdate {
  idToken: string;
  email?: string;
  password?: string;
}

export interface UserInfo extends User {
  id?: string;
  login: string;
  name: string;
}

export interface FbAuthResponse {
  idToken: string;
  email?: string;
  expiresIn?: string;
}

export interface FbCreateResponse {
  name: string;
}
