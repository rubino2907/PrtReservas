import { Component, EventEmitter, Output } from '@angular/core';
import { Pending } from '../../../models/pending';
import { CookieService } from 'ngx-cookie-service';
import { TypeVehicleService } from '../../../services/vehicles/typeVehicle.service';
import { VehicleService } from '../../../services/vehicles/vehicle.service';
import { PendantService } from '../../../services/pedidosService/pending.service';
import { Vehicle } from '../../../models/VehicleModels/vehicle';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import * as nodemailer from 'nodemailer';
import { EmailSenderService } from '../../../services/extraServices/email-sender.service';
@Component({
  selector: 'app-reports-pendings',
  templateUrl: './reports-pendings.component.html',
  styleUrl: './reports-pendings.component.css'
})
export class ReportsPendingsComponent {
    pendings: Pending[] = [];
    sortColumn: string = 'aproved';
    sortDirection: string = 'desc'; // 'asc' para ascendente, 'desc' para descendente
    @Output() pendingsUpdated: EventEmitter<any> = new EventEmitter();
    
    isDeleteConfirmationVisible: boolean = false;

    matriculations: string[] = []; // Array para armazenar as matrículas

    filteredPendings: any[] = []; // Lista filtrada para exibição
    selectedMatricula: string = '';
    startDate: string = '';
    endDate: string = '';

    selectedVehicleType: string = ''; // Armazena o tipo de viatura selecionado

    isEmailPopupVisible: boolean = false;
    isSuccessPopupVisible: boolean = false;
    emailToSend: string = ''; // Variável para armazenar o e-mail digitado pelo usuário

    vehicleType: string[] = []; // Array para armazenar os tipos

    constructor(private cookieService: CookieService, 
      private typeVehicleService: TypeVehicleService, 
      private vehicleService: VehicleService, 
      private pendantService: PendantService,
      private http: HttpClient,
      private emailSenderService: EmailSenderService) { }

    ngOnInit(): void {
      this.loadTypeOfVehicles();
    }

    clearDate(field: string) {
      if (field === 'startDate') {
          this.startDate = ''; // Alteração aqui
      } else if (field === 'endDate') {
          this.endDate = ''; // Alteração aqui
      }
      this.applyFilters(); // Você pode chamar applyFilters() para aplicar os filtros imediatamente após limpar a data, se necessário.
    }

    loadTypeOfVehicles(): void {
      this.typeVehicleService.getTypeOfVehicle().subscribe(
          (vehicleType: string[]) => {
              // Você pode usar as matriculas diretamente aqui
              this.vehicleType = vehicleType;
          },
          (error) => {
              console.error("Erro ao carregar matrículas por tipo:", error);
              // Lide com os erros adequadamente
          }
      );
    }

    
    loadMatriculations(vehicleType: string): void {
      if (!vehicleType) {
          this.matriculations = [];
          return;
      }

      this.vehicleService.getVehiclesByType(vehicleType).subscribe(
          (vehicles: Vehicle[]) => {
              // Ensure only non-undefined matriculations are included
              this.matriculations = vehicles.map(vehicle => vehicle.matriculation).filter((matriculation): matriculation is string => matriculation !== null && matriculation !== undefined);
          },
          (error) => {
              console.error("Erro ao carregar matrículas por tipo:", error);
          }
      );
    }

    applyFilters(): void {
      // Converta as strings de data para objetos Date para comparação
      let startDate = this.startDate ? new Date(this.startDate) : null;
      let endDate = this.endDate ? new Date(this.endDate) : null;
    
      // Chame o serviço para obter os pendentes com os filtros aplicados
      this.pendantService.getPendings().subscribe(
        (pendings: Pending[]) => {
          this.filteredPendings = pendings.filter(pending => {
            const matchMatricula = this.selectedMatricula ? pending.matriculation === this.selectedMatricula : true;
            const pendingStartDate = pending.dateStart ? new Date(pending.dateStart) : new Date();
            const pendingEndDate = pending.dateEnd ? new Date(pending.dateEnd) : new Date();
            const matchStartDate = startDate ? pendingStartDate >= startDate : true;
            const matchEndDate = endDate ? pendingEndDate <= endDate : true;
            return matchMatricula && matchStartDate && matchEndDate;
          });
        },
        error => {
          console.error('Erro ao carregar pendentes:', error);
        }
      );
    }

    cleanTable() {
      this.filteredPendings = [];
      this.selectedMatricula = '';
      this.selectedVehicleType = '';
      this.startDate = '';
      this.endDate = '';
    }

    // Método para ordenar a tabela com base no estado de aprovação
    sortTableByApproval(): void {
      // Alterne a direção da ordenação
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

      // Atualize a coluna de ordenação para 'aproved'
      this.sortColumn = 'aproved';

      // Defina a ordem desejada dos estados
      const order = ['EM ESPERA', 'APROVADO', 'RECUSADO'];

      // Classifique os pendentes com base no estado de aprovação e na direção da ordenação
      this.filteredPendings.sort((a, b) => {
          // Verifique se 'a.aproved' e 'b.aproved' estão definidos
          if (a.aproved !== undefined && b.aproved !== undefined) {
              const indexA = order.indexOf(a.aproved);
              const indexB = order.indexOf(b.aproved);
              
              // Se ambos os estados estiverem na ordem, classifique com base nessa ordem
              if (indexA !== -1 && indexB !== -1) {
                  if (this.sortDirection === 'asc') {
                      return indexA - indexB;
                  } else {
                      return indexB - indexA;
                  }
              }
              // Se apenas um estado estiver na ordem, coloque-o antes
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
          }
          // Se 'a.aproved' ou 'b.aproved' não forem definidos ou não estiverem na ordem, mantenha a ordem atual
          return 0;
      });
    }

    // Função para retornar a classe com base no estado do pedido
    getPendingStatusClass(status: string | undefined): string {
      if (status === 'APROVADO') {
        return 'approved';
      } else if (status === 'EM ESPERA') {
        return 'pending';
      } else if (status === 'RECUSADO') {
        return 'not-approved';
      } else {
        return ''; // Retorna uma string vazia se o status for undefined
      }
    }

    // No seu componente TypeScript
    sortTableByStartDateIcon() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

      // Aqui você deve implementar a lógica para ordenar o array 'filteredPendings' com base na data de início
      // Você pode usar a função de ordenação do JavaScript, por exemplo:
      this.filteredPendings.sort((a, b) => {
          const dateA = new Date(a.dateStart).getTime();
          const dateB = new Date(b.dateStart).getTime();
          
          if (this.sortDirection === 'asc') {
              return dateA - dateB;
          } else {
              return dateA - dateB;
          }
      });
    }

    // Função loadImage atualizada
  async loadImage(filePath: string): Promise<string> {
    try {
        // Use o HttpClient para carregar o arquivo como uma string
        const imgBlob = await this.http.get(filePath, { responseType: 'blob' }).toPromise();
        if (!imgBlob) {
            throw new Error('Imagem não encontrada ou inválida');
        }
        const reader = new FileReader();
        reader.readAsDataURL(imgBlob);
        return new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
        });
    } catch (error) {
        console.error('Erro ao carregar a imagem:', error);
        return ''; // Retorne uma string vazia em caso de erro
    }
  }
  
  async criarPDF() {
    const doc = new jsPDF();
    const headerFilePath = 'assets/redLogoWaveMaps.png';
    const footerFilePath = 'assets/logoMapsRodape.png';

    const headerImg = await this.loadImage(headerFilePath);
    const footerImg = await this.loadImage(footerFilePath);

    // Adicionar o logo no cabeçalho
    doc.addImage(headerImg, 'PNG', 15, 10, 50, 15);

    // Definir o tamanho da fonte para o título
    doc.setFontSize(18);
    // Adicionar o título "Relatório de Pedidos"
    doc.text('Relatório de Pedidos', 80, 22);

    // Definir o tamanho da fonte para a data de emissão
    doc.setFontSize(12);
    // Adicionar a data de emissão
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Data de Emissão: ${currentDate}`, 80, 30);

    const columns = [
        { header: 'Matrícula', dataKey: 'matriculation' },
        { header: 'Data de Início', dataKey: 'dateStart' },
        { header: 'Data de Fim', dataKey: 'dateEnd' },
        { header: 'Aprovado', dataKey: 'aproved' },
        { header: 'Aprovado Por', dataKey: 'aprovedBy' }
    ];

    const data = this.filteredPendings.map(pending => ({
        matriculation: pending.matriculation,
        dateStart: pending.dateStart,
        dateEnd: pending.dateEnd,
        aproved: pending.aproved,
        aprovedBy: pending.aprovedBy
    }));

    autoTable(doc, {
        startY: 40,
        columns: columns,
        body: data,
        margin: { top: 30, right: 14, bottom: 20, left: 14 },
        didDrawPage: function (data) {
            // Adicionar o rodapé em cada página
            doc.addImage(footerImg, 'PNG', 15, doc.internal.pageSize.height - 30, 50, 15);
            doc.setFontSize(10);
        }
    });

    doc.save('lista_pedidos.pdf');
  }

  async criarCSV() {
    // Verificar se há dados para exportar
    if (this.filteredPendings.length === 0) {
        console.error('Não há dados para exportar.');
        return;
    }

    // Criar o cabeçalho do CSV
    let csvContent = 'Matrícula,Data de Início,Data de Fim,Aprovado,Aprovado Por\n';

    // Iterar sobre os dados filtrados e adicionar linhas ao CSV
    this.filteredPendings.forEach(pending => {
        // Formatando a linha com os dados do pendente
        const row = `${pending.matriculation},${pending.dateStart},${pending.dateEnd},${pending.aproved},${pending.aprovedBy}\n`;
        csvContent += row;
    });

    // Criar um objeto Blob com o conteúdo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Criar um URL temporário para o Blob
    const url = window.URL.createObjectURL(blob);

    // Criar um link <a> para download do arquivo
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'lista_pedidos.csv');
    document.body.appendChild(link);

    // Simular um clique no link para iniciar o download
    link.click();

    // Remover o link do corpo do documento
    document.body.removeChild(link);
  }

  async enviarEmailComPdf(email: string) {
    const pdfBlob = await this.gerarPdfBlob();
  
    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', 'Relatório de Pedidos');
    formData.append('message', 'Segue em anexo o relatório de pedidos.');
    formData.append('attachment', pdfBlob, 'relatorio_pedidos.pdf');
  
    this.emailSenderService.sendEmail(formData).subscribe(
      response => {
        console.log('E-mail enviado com sucesso!', response);
      },
      error => console.error('Erro ao enviar e-mail', error)
    );

    this.closeEmailPopup();
    this.openSuccessPopup('O pdf foi enviado para o email fornecido com sucesso.');
  }

  // Método para gerar o PDF e retornar como Blob
  async gerarPdfBlob(): Promise<Blob> {
    const doc = new jsPDF();

    // Configurações do PDF (adicionar imagens, texto, tabelas, etc.)
    // Por exemplo, adicionar uma imagem
    const headerImg = await this.loadImage('assets/redLogoWaveMaps.png');
    const footerFilePath = 'assets/logoMapsRodape.png';
    const footerImg = await this.loadImage(footerFilePath);
    doc.addImage(headerImg, 'PNG', 15, 10, 50, 15);

    // Adicionar texto
    doc.text('Relatório de Pedidos', 80, 22);

    const columns = [
      { header: 'Matrícula', dataKey: 'matriculation' },
      { header: 'Data de Início', dataKey: 'dateStart' },
      { header: 'Data de Fim', dataKey: 'dateEnd' },
      { header: 'Aprovado', dataKey: 'aproved' },
      { header: 'Aprovado Por', dataKey: 'aprovedBy' }
  ];

    const data = this.filteredPendings.map(pending => ({
      matriculation: pending.matriculation,
      dateStart: pending.dateStart,
      dateEnd: pending.dateEnd,
      aproved: pending.aproved,
      aprovedBy: pending.aprovedBy
  }));

    autoTable(doc, {
      startY: 40,
      columns: columns,
      body: data,
      margin: { top: 30, right: 14, bottom: 20, left: 14 },
      didDrawPage: function (data) {
          // Adicionar o rodapé em cada página
          doc.addImage(footerImg, 'PNG', 15, doc.internal.pageSize.height - 30, 50, 15);
          doc.setFontSize(10);
      }
  });

    // Retornar o Blob do documento
    return doc.output('blob');
  }



  // Método para carregar imagens
  async loadImagem(filePath: string): Promise<string> {
    try {
      // Use o HttpClient para carregar a imagem como uma string
      const imgBlob = await this.http.get(filePath, { responseType: 'blob' }).toPromise();
      if (!imgBlob) {
        throw new Error('Imagem não encontrada ou inválida');
      }
      const reader = new FileReader();
      reader.readAsDataURL(imgBlob);
      return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
      });
    } catch (error) {
      console.error('Erro ao carregar a imagem:', error);
      return ''; // Retorne uma string vazia em caso de erro
    }
  }

  openEmailPopup(): void {
    // Verifica se a lista de reservas filtradas está vazia
    if (this.filteredPendings.length > 0) {
      this.isEmailPopupVisible = true;
    } else {
      // Se estiver vazia, exiba uma mensagem ou tome outra ação, como atualizar os filtros ou notificar o usuário
      console.log('A lista de reservas está vazia. Não é possível enviar e-mail.');
      // Ou, se preferir, você pode limpar os campos de e-mail e ocultar a popup
      this.emailToSend = '';
      this.isEmailPopupVisible = false;
      this.openTableEmptyPopup();
    }
  }
  

  // Função para fechar a popup de e-mail
  closeEmailPopup() {
    this.isEmailPopupVisible = false;
  }

  openSuccessPopup(message: string): void {
    this.isSuccessPopupVisible = true;
  }

  closeSuccessPopup(): void {
    this.isSuccessPopupVisible = false;
  }

  isTableEmptyPopupVisible: boolean = false;

  openTableEmptyPopup(): void {
      this.isTableEmptyPopupVisible = true;
  }

  closeTableEmptyPopup(): void {
      this.isTableEmptyPopupVisible = false;
  }

}




