import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {

  constructor(private http: HttpClient) { }

  sendEmail(toEmail: string, subject: string, body: string) {
    const emailData = {
      toEmail: toEmail,
      subject: subject,
      body: body
    };

    return this.http.post<any>( `${environment.apiUrl}/email/send`, emailData);
  }
}
