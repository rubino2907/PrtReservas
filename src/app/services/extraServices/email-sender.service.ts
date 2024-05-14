import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailSenderService {

  private url = "SendEmail"

  constructor(private http: HttpClient) { }

  sendEmail(formData: FormData) {
    // Faça uma solicitação POST para o seu backend para enviar o e-mail
    // Certifique-se de configurar o backend para lidar com esta solicitação
    return this.http.post<any>(`${environment.apiUrl}/${this.url}/send-with-attachment`, formData);
  }

}
