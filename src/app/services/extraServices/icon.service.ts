import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor() { }

  getIconList(): Observable<string[]> {
    // Aqui você pode retornar a lista de ícones disponíveis
    // Por exemplo, você pode listar os nomes dos arquivos de ícone no seu diretório de ícones
    // Substitua este exemplo pelo seu método real de obter a lista de ícones
    const iconList: string[] = ['carroAzul.png', 'carro_vermelho.png','carrinhaAzul.png', 'CarrinhaVermelha.png', 'camiaoVerde.png'];
    return of(iconList);
  }
}
