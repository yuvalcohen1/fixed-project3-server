export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  encryptedPassword: string;
  isAdmin: 0 | 1;
}
