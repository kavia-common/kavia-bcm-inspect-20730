export interface UserProfile {
  firstName: string;
  lastName: string;
  phone_number: string;
  email: string;
  role: string;
  clientProfileId: string;
  gender: string;
}

export interface UserProfileFormData extends UserProfile {
  id?: string;
  picture?: string;
}

export interface UserProfileResponse extends UserProfileFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsers {
  Attributes: {
    Name: string;
    Value: string;
  }[];
  Enabled: boolean;
  UserCreateDate: string;
  UserLastModifiedDate: string;
  UserStatus: string;
  Username: string;
}
