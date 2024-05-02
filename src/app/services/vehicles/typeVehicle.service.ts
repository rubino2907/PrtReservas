import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { TypeVehicle } from "../../models/VehicleModels/typeVehicle";

@Injectable({
    providedIn: 'root'
})
export class TypeVehicleService {

    private url = "TypeVehicle";

    constructor(private http: HttpClient) {}

    public getTypeVehicles(): Observable<TypeVehicle[]> {
        return this.http.get<TypeVehicle[]>(`${environment.apiUrl}/${this.url}`);
    }

    public createTypeVehicle(typeVehicle: TypeVehicle): Observable<TypeVehicle[]> {
        return this.http.post<TypeVehicle[]>
        (`${environment.apiUrl}/${this.url}/TypeVehicles`,
        typeVehicle
        );
    }

    public getTypeOfVehicle(): Observable<string[]> {
        return this.http.get<string[]>(`${environment.apiUrl}/${this.url}/TypeOfVehicles`);
    }

    public updateTypeVehicle(typeVehicle: TypeVehicle): Observable<TypeVehicle[]> {
        return this.http.put<TypeVehicle[]>(`${environment.apiUrl}/${this.url}`, typeVehicle);
    }

    public deleteTypeVehicle(typeVehicle: TypeVehicle): Observable<TypeVehicle[]> {
        return this.http.delete<TypeVehicle[]>(`${environment.apiUrl}/${this.url}/${typeVehicle.groupId}`);
    }
    
}
