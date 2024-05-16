import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Vehicle } from "../../models/VehicleModels/vehicle";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    private url = "Vehicle";

    constructor(private http: HttpClient) {}

    public getVehicles() : Observable<Vehicle[]>{
        return this.http.get<Vehicle[]>(`${environment.apiUrl}/${this.url}`);
    }

    public createVehicles(vehicle: Vehicle) : Observable<Vehicle[]>{
        return this.http.post<Vehicle[]>
        (`${environment.apiUrl}/${this.url}/CreateVehicle`,
        vehicle
        );
    }

    public updateVehicles(vehicle: Vehicle) : Observable<Vehicle[]>{
        return this.http.put<Vehicle[]>
        (`${environment.apiUrl}/${this.url}`,
        vehicle
        );
    }

    public deleteVehicles(vehicle: Vehicle) : Observable<Vehicle[]>{
        return this.http.delete<Vehicle[]>(`${environment.apiUrl}/${this.url}/${vehicle.vehicleID}`);
    }

    public getMatriculations(): Observable<string[]> {
        return this.http.get<string[]>(`${environment.apiUrl}/${this.url}/Matriculations`);
    }

    public getVehiclesByType(vehicleType: string): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(`${environment.apiUrl}/${this.url}/ByVehicleType/${vehicleType}`);
    }
    
    public getVehicleByMatriculation(matriculation: string): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${environment.apiUrl}/${this.url}/ByMatriculation/${matriculation}`);
    }
    
}