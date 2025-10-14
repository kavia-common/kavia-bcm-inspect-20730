export interface ICognitoUserAttributes {
  email: string;
  // Add other Cognito user attributes as needed
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  challengeName?: string;
  session?: string;
  data?: {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    userAttributes?: ICognitoUserAttributes;
  };
  error?: any;
}

export type UserRole = "admin" | "user";
