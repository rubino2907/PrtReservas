export class Vehicle 
{
    vehicleID?: number;
    creationDateTime: string = '';
    createdBy: string = '';
    changeDateTime: string = '';
    vehicleChanged: string = '';
    vehicleCode: number | null = null;
    matriculation?: string;
    descVehicle?: string;
    mark?: string;
    model?: string;
    topology?: string;
    year?: number;
    places?: number;
    fuel?: number;
    defaultLocation?: string;
    defaultCoords?: string;
    color?: string;
    icon?: string;
    obs?: string;
    typeVehicle?: string;
}
