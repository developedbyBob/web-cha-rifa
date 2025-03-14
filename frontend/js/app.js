// frontend/js/app.js
// Registrar o Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado com sucesso:', registration.scope);
        })
        .catch(error => {
          console.error('Erro ao registrar Service Worker:', error);
        });
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    const loadingElement = document.getElementById('loading');
    const modalElement = document.getElementById('modal');
    const adminButtonElement = document.getElementById('admin-button');
    const adminPanelElement = document.getElementById('admin-panel');
    
    // Inicializar componentes
    const grid = new Grid(gridElement);
    const modal = new ReservationModal(modalElement);
    const adminPanel = new AdminPanel(adminPanelElement);
    
    // Esconder o painel de admin logo no início
    adminPanelElement.classList.add('hidden');
    
    // Feedback visual durante carregamentos
    const ui = {
      showLoading: () => {
        loadingElement.classList.remove('hidden');
        gridElement.classList.add('hidden');
      },
      hideLoading: () => {
        loadingElement.classList.add('hidden');
        gridElement.classList.remove('hidden');
      },
      showNotification: (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('fade-out');
          setTimeout(() => {
            notification.remove();
          }, 500);
        }, 3000);
      }
    };
    
    // Funções principais do aplicativo
    const app = {
      reservations: [],
      
      init: async function() {
        try {
          ui.showLoading();
          
          // Configurar eventos
          grid.setOnCellClick(this.handleCellClick.bind(this));
          modal.setOnSubmit(this.handleReservationSubmit.bind(this));
          adminPanel.setOnDraw(this.handleDraw.bind(this));
          adminPanel.setOnDelete(this.handleDelete.bind(this));
          
          // Configurar botão de admin
          adminButtonElement.addEventListener('click', this.handleAdminLogin.bind(this));
          
          // Carregar dados iniciais
          await this.loadReservations();
          
          // Aplicar estilos iniciais
          document.body.classList.add('fade-in');
        } catch (error) {
          console.error('Erro ao inicializar aplicativo:', error);
          ui.showNotification('Erro ao carregar dados. Tente novamente.', 'error');
        }
      },
      
      loadReservations: async function() {
        try {
          const data = await API.getReservations();
          this.reservations = data;
          grid.updateReservations(this.reservations);
          
          if (localStorage.getItem('adminToken')) {
            adminPanel.updateReservations(this.reservations);
          }
          
          setTimeout(() => {
            ui.hideLoading();
          }, 500);
        } catch (error) {
          ui.hideLoading();
          ui.showNotification('Erro ao carregar reservas. Verifique sua conexão.', 'error');
          console.error('Detalhes do erro:', error);
        }
      },
      
      handleCellClick: function(number) {
        modal.open(number);
      },
      
      handleReservationSubmit: async function(data) {
        try {
          ui.showLoading();
          const result = await API.createReservation(data);
          
          modal.close();
          await this.loadReservations();
          
          ui.showNotification(`Número ${data.number} reservado com sucesso!`);
        } catch (error) {
          ui.hideLoading();
          modal.showError(error.message || 'Erro ao processar reserva');
        }
      },
      
      handleAdminLogin: async function() {
        const password = prompt('Digite a senha de administrador:');
        if (!password) return;
        
        try {
          ui.showLoading();
          const result = await API.adminLogin(password);
          localStorage.setItem('adminToken', result.token);
          
          // Atualizar painel admin com os dados atuais
          adminPanel.updateReservations(this.reservations);
          
          // Mostrar o painel admin
          adminPanel.show();
          
          ui.hideLoading();
          ui.showNotification('Login de administrador realizado com sucesso.');
        } catch (error) {
          ui.hideLoading();
          ui.showNotification('Senha incorreta ou erro de conexão!', 'error');
        }
      },
      
      handleDraw: async function() {
        try {
          const result = await API.drawWinner();
          adminPanel.showWinner(result.winner);
          
          ui.showNotification('Sorteio realizado com sucesso!');
        } catch (error) {
          ui.showNotification('Erro ao realizar sorteio.', 'error');
        }
      },
      
      handleDelete: async function(number) {
        try {
          await API.deleteReservation(number);
          await this.loadReservations();
          
          ui.showNotification(`Reserva do número ${number} removida.`);
        } catch (error) {
          ui.showNotification('Erro ao remover reserva.', 'error');
        }
      }
    };
    
    // Iniciar aplicativo
    app.init();
  });