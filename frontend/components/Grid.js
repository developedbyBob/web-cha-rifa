// frontend/components/Grid.js
class Grid {
    constructor(element, reservations = []) {
      this.element = element;
      this.reservations = reservations;
      this.totalNumbers = 100;
      this.onCellClick = null;
    }
    
    setOnCellClick(callback) {
      this.onCellClick = callback;
    }
    
    render() {
      this.element.innerHTML = '';
      
      for (let i = 1; i <= this.totalNumbers; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = i;
        
        const reservation = this.reservations.find(r => r.number === i);
        if (reservation) {
          cell.classList.add('reserved');
          cell.title = `Reservado por: ${reservation.name}`;
          // Guardar dados para uso no admin panel
          cell.dataset.name = reservation.name;
          cell.dataset.phone = reservation.phone;
          cell.dataset.gift = reservation.gift;
        } else {
          cell.classList.add('available');
          
          // Adicionar efeito hover apenas para células disponíveis
          cell.addEventListener('click', () => {
            if (this.onCellClick) {
              this.onCellClick(i);
            }
          });
        }
        
        this.element.appendChild(cell);
      }
    }
    
    updateReservations(reservations) {
      this.reservations = reservations;
      this.render();
    }
    
    showLoading() {
      this.element.innerHTML = '<div class="loading-grid">Carregando números...</div>';
    }
  }