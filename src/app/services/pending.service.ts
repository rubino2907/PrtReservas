import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Pending } from "../models/pending";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class PendantService {

    private url = "Pending"

    constructor(private http: HttpClient) {}

    public getPendings() : Observable<Pending[]>{
        return this.http.get<Pending[]>(`${environment.apiUrl}/${this.url}`);
    }

    public createPending(pending: Pending) : Observable<Pending[]>{
        return this.http.post<Pending[]>
        (`${environment.apiUrl}/${this.url}/CreatePending`,
        pending
        );
    }

    public updatePendings(pending: Pending): Observable<Pending[]>{
        return this.http.put<Pending[]>
        (`${environment.apiUrl}/${this.url}`,
        pending
        );
    }

    public deletePendings(pending: Pending) : Observable<Pending[]>{
        return this.http.delete<Pending[]>(`${environment.apiUrl}/${this.url}/${pending.pendingID}`);
    }


}