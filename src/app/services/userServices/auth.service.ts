import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDto } from '../../models/UserModels/userDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "User";

  private usernameSubject = new BehaviorSubject<string>('');
  username$: Observable<string> = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) { }

  public login(userDto: UserDto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.url}/Auth/Login`, userDto);
  }
}
