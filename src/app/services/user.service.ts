import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { User } from "../models/UserModels/user";
import { UserDetails } from "../models/UserModels/userDetails";

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private url = "User";

    constructor(private http: HttpClient) {}

    public getUsers() : Observable<User[]>{
        return this.http.get<User[]>(`${environment.apiUrl}/${this.url}`);
    }

    public updateUsers(user: User) : Observable<User[]>{
        return this.http.put<User[]>
        (`${environment.apiUrl}/${this.url}`,
        user
        );
    }

    public createUsers(user: User) : Observable<User[]>{
        return this.http.post<User[]>
        (`${environment.apiUrl}/${this.url}`,
        user
        );
    }

    public deleteUsers(user: User) : Observable<User[]>{
        return this.http.delete<User[]>(`${environment.apiUrl}/${this.url}/${user.userID}`);
    }

    public getCountUsers() : Observable<User[]>{
        return this.http.delete<User[]>(`${environment.apiUrl}/${this.url}/count`);
    }

    public getUserDetailsByCreatedBy(createdBy: string): Observable<UserDetails> {
        return this.http.get<UserDetails>(`${environment.apiUrl}/${this.url}/Email&PhoneDetails?createdBy=${createdBy}`);
    }

    public getUserByUsername(username: string): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/${this.url}/${username}`);
    }

    public updateUserByUsername(username: string, user: User): Observable<User[]> {
        return this.http.put<User[]>(`${environment.apiUrl}/${this.url}/Update/${username}`, user);
    }
}