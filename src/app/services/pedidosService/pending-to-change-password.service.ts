import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PendingToPasswordChange } from '../../models/pendingToPasswordChange';

@Injectable({
  providedIn: 'root'
})
export class PendingToChangePasswordService {

  private url = "PendingToChangePassword"

  constructor(private http: HttpClient) {}

  public getPendingsToChangePassword() : Observable<PendingToPasswordChange[]>{
    return this.http.get<PendingToPasswordChange[]>(`${environment.apiUrl}/${this.url}`);
  }

  public createPendingToChangePassword(pendingToPasswordChange: PendingToPasswordChange) : Observable<PendingToPasswordChange[]>{
    return this.http.post<PendingToPasswordChange[]>
    (`${environment.apiUrl}/${this.url}/CreatePendingToPasswordChange`,
    pendingToPasswordChange
    );
  }
  
}
