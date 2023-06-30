export interface Roles {
  admi?: boolean;
  estudiante: boolean;
}
export interface UserInterface {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  roles: Roles;
}
