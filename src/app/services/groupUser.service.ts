import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { UserGroup } from "../models/UserModels/groupUsers";

@Injectable({
    providedIn: 'root'
})
export class UserGroupService {

    private url = "GroupUser";

    constructor(private http: HttpClient) {}

    public getUserGroups(): Observable<UserGroup[]> {
        return this.http.get<UserGroup[]>(`${environment.apiUrl}/${this.url}`);
    }

    public createUserGroup(userGroup: UserGroup): Observable<UserGroup[]> {
        return this.http.post<UserGroup[]>(`${environment.apiUrl}/${this.url}`, userGroup);
    }

    public updateUserGroup(userGroup: UserGroup): Observable<UserGroup[]> {
        return this.http.put<UserGroup[]>(`${environment.apiUrl}/${this.url}`, userGroup);
    }

    public deleteUserGroup(id: number): Observable<UserGroup[]> {
        return this.http.delete<UserGroup[]>(`${environment.apiUrl}/${this.url}/${id}`);
    }
    
}
