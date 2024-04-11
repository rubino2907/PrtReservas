export class User {

    userID?: number;
    creationDateTime: string = '';
    createdBy: string = 'admin';
    changeDateTime?: string = '';
    userChanged: string = 'admin';
    userCode: number | null = null;
    userName: string = '';
    userInitials: string = '';
    password: string = '';
    isAdmin: boolean = false;
    canApproveReservations: boolean = false;
    fullName: string = '';
    email: string = '';
    phone: number | null = null; // Permitindo valor nulo
    address: string = '';
    postalCode: string = '';
    group: string = '';
    notes: string = '';
    token: string = '';
}
