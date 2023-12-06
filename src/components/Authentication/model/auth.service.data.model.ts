export interface AuthResponse<T> {
  success: boolean;
  message?: string;
  data?: SignInDataResponse;
}

export interface SignInDataResponse {
  _id: string;
  role?: string;
  reportsTo? :string;
  token:string
}

export interface setCookiesData {
    name : string,
    value : string,
    days : number
}

export interface LoginCheckData {
    data:boolean
}

