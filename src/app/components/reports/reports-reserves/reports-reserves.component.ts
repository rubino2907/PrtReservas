import { Component } from '@angular/core';
import { VehicleService } from '../../../services/vehicles/vehicle.service';
import { Vehicle } from '../../../models/VehicleModels/vehicle';
import { ReserveService } from '../../../services/reservesService/reserve.service';
import { Reserve } from '../../../models/reserve';
import { TypeVehicleService } from '../../../services/vehicles/typeVehicle.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { EmailSenderService } from '../../../services/extraServices/email-sender.service';

@Component({
  selector: 'app-reports-reserves',
  templateUrl: './reports-reserves.component.html',
  styleUrl: './reports-reserves.component.css'
})
export class ReportsReservesComponent {

  selectedVehicleType: string = ''; // Armazena o tipo de viatura selecionado

  filteredPendings: any[] = []; // Lista filtrada para exibição
    selectedMatricula: string = '';
    startDate: string = '';
    endDate: string = '';

  matriculations: string[] = []; // Array para armazenar as matrículas
  vehicleType: string[] = []; // Array para armazenar os tipos

  isEmailPopupVisible: boolean = false;
  isSuccessPopupVisible: boolean = false;
  emailToSend: string = ''; // Variável para armazenar o e-mail digitado pelo usuário

  sortDirection: string = 'desc';

  constructor( private vehicleService: VehicleService,
    private reserveService: ReserveService,
    private typeVehicleService: TypeVehicleService,
    private http: HttpClient,
    private emailSenderService: EmailSenderService
  ){}

  
  ngOnInit(): void {
    this.loadTypeOfVehicles();
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

    cleanTable() {
      this.filteredPendings = [];
      this.selectedMatricula = '';
      this.selectedVehicleType = '';
      this.startDate = '';
      this.endDate = '';
    }

    applyFilters(): void {
      // Converta as strings de data para objetos Date para comparação
      let startDate = this.startDate ? new Date(this.startDate) : null;
      let endDate = this.endDate ? new Date(this.endDate) : null;
    
      // Chame o serviço para obter os pendentes com os filtros aplicados
      this.reserveService.getReserves().subscribe(
        (reserves: Reserve[]) => {
          this.filteredPendings = reserves.filter(reserve => {
            const matchMatricula = this.selectedMatricula ? reserve.matriculation === this.selectedMatricula : true;
            const pendingStartDate = reserve.dateStart ? new Date(reserve.dateStart) : new Date();
            const pendingEndDate = reserve.dateEnd ? new Date(reserve.dateEnd) : new Date();
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

    clearDate(field: string) {
      if (field === 'startDate') {
          this.startDate = ''; // Alteração aqui
      } else if (field === 'endDate') {
          this.endDate = ''; // Alteração aqui
      }
      this.applyFilters(); // Você pode chamar applyFilters() para aplicar os filtros imediatamente após limpar a data, se necessário.
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
    doc.text('Relatório de Reservas', 80, 22);

    // Definir o tamanho da fonte para a data de emissão
    doc.setFontSize(12);
    // Adicionar a data de emissão
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Data de Emissão: ${currentDate}`, 80, 30);

    const columns = [
        { header: 'Matrícula', dataKey: 'matriculation' },
        { header: 'Data de Início', dataKey: 'dateStart' },
        { header: 'Data de Fim', dataKey: 'dateEnd' },
        { header: 'Estado', dataKey: 'state' },
        { header: 'Dono da Reserva', dataKey: 'createdBy' }
    ];

    const data = this.filteredPendings.map(reserve => ({
        matriculation: reserve.matriculation,
        dateStart: reserve.dateStart,
        dateEnd: reserve.dateEnd,
        state: reserve.state,
        createdBy: reserve.createdBy
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

    doc.save('relatorio_reservas.pdf');
  }

  async criarCSV() {
    // Verificar se há dados para exportar
    if (this.filteredPendings.length === 0) {
        console.error('Não há dados para exportar.');
        return;
    }

    // Criar o cabeçalho do CSV
    let csvContent = 'Matrícula,Data de Início,Data de Fim,Estado,Dono da Reserva\n';

    // Iterar sobre os dados filtrados e adicionar linhas ao CSV
    this.filteredPendings.forEach(reserve => {
        // Formatando a linha com os dados do pendente
        const row = `${reserve.matriculation},${reserve.dateStart},${reserve.dateEnd},${reserve.aproved},${reserve.aprovedBy}\n`;
        csvContent += row;
    });

    // Criar um objeto Blob com o conteúdo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Criar um URL temporário para o Blob
    const url = window.URL.createObjectURL(blob);

    // Criar um link <a> para download do arquivo
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorio_reservas.csv');
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
      { header: 'Estado', dataKey: 'state' },
      { header: 'Dono da Reserva', dataKey: 'createdBy' }
  ];

  const data = this.filteredPendings.map(reserve => ({
      matriculation: reserve.matriculation,
      dateStart: reserve.dateStart,
      dateEnd: reserve.dateEnd,
      state: reserve.state,
      createdBy: reserve.createdBy
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

   // Função para abrir a popup de e-mail
   openEmailPopup() {
    this.isEmailPopupVisible = true;
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
}
