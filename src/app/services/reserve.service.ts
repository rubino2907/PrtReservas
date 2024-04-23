import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Reserve } from "../models/reserve";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Vehicle } from "../models/VehicleModels/vehicle";

@Injectable({
    providedIn: 'root'
})
export class ReserveService {

    private url = "Reserve";

    constructor(private http: HttpClient) {}

    public getReserves(): Observable<Reserve[]> {
        return this.http.get<Reserve[]>(`${environment.apiUrl}/${this.url}`);
    }

    public createReserve(reserve: Reserve): Observable<Reserve[]> {
        return this.http.post<Reserve[]>(
            `${environment.apiUrl}/${this.url}/CreateReservation`,
            reserve
        );
    }

    public updateReserves(reserve: Reserve): Observable<Reserve[]> {
        return this.http.put<Reserve[]>(
            `${environment.apiUrl}/${this.url}`,
            reserve
        );
    }

    public deleteReserves(reserve: Reserve): Observable<Reserve[]> {
        return this.http.delete<Reserve[]>(`${environment.apiUrl}/${this.url}/${reserve.reserveID}`);
    }

    public getReservesByMatriculation(matriculation: string): Observable<Reserve[]> {
        return this.http.get<Reserve[]>(`${environment.apiUrl}/${this.url}/GetReservesByMatriculation?matriculation=${matriculation}`);
    }

    public getAvailableDays(matriculation: string, startDate: Date, endDate: Date): Observable<Date[]> {
        return this.http.get<Date[]>(
            `${environment.apiUrl}/${this.url}/GetAvailableDays?matriculation=${matriculation}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
    }

    public getReservesByCreatedBy(createdBy: string): Observable<Reserve[]> {
        return this.http.get<Reserve[]>(`${environment.apiUrl}/${this.url}/GetReservesByCreatedBy/${createdBy}`);
    }

    public getReservesByMatriculationess(matriculations: string[]): Observable<Reserve[]> {
        const params = new HttpParams().set('matriculations', matriculations.join(','));
        return this.http.get<Reserve[]>(`${environment.apiUrl}/${this.url}/GetReservesByMatriculations`, { params });
    }

    public getAverageReservationTime(): Observable<number> {
        return this.http.get<number>(`${environment.apiUrl}/${this.url}/AverageReservationTime`);
    }

    public getMostAndLeastUsedVehicles(): Observable<{ mostUsed: Vehicle[], leastUsed: Vehicle[] }> {
        return this.http.get<{ mostUsed: Vehicle[], leastUsed: Vehicle[] }>(`${environment.apiUrl}/${this.url}/MostAndLeastUsedVehicles`);
    }

    public getUserWithMostOrders(): Observable<string> {
        return this.http.get(`${environment.apiUrl}/${this.url}/UserWithMostOrders`, { responseType: 'text' });
    }
    // public GetReservesByType
    
}
