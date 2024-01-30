export interface IUser {
    uid: string,
    email: string | null,
    displayName: string | null,
    phoneNumber: string | null,
    emailVerified: boolean,
}