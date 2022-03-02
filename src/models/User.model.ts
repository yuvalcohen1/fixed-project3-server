export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  encryptedPassword: string;
  isAdmin: 0 | 1;
}
