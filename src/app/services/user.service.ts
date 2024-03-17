import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { environment } from "../../environments/environment";

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
}