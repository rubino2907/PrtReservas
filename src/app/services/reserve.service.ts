import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Reserve } from "../models/reserve";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ReserveService {

    private url = "Reserve";

    constructor(private http: HttpClient) {}

    public getReserves() : Observable<Reserve[]>{
        return this.http.get<Reserve[]>(`${environment.apiUrl}/${this.url}`);
    }

    public createReserve(reserve: Reserve) : Observable<Reserve[]>{
        return this.http.post<Reserve[]>
        (`${environment.apiUrl}/${this.url}/CreateReservation`,
        reserve
        );
    }

    updateReserves(reserve: Reserve): Observable<Reserve[]>{
        return this.http.put<Reserve[]>
        (`${environment.apiUrl}/${this.url}`,
        reserve
        );
    }

    public deleteReserves(reserve: Reserve) : Observable<Reserve[]>{
        return this.http.delete<Reserve[]>(`${environment.apiUrl}/${this.url}/${reserve.reserveID}`);
    }
    
}