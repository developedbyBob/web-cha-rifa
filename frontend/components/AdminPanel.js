// frontend/components/AdminPanel.js
class AdminPanel {
    constructor(element) {
      this.element = element;
      this.onDraw = null;
      this.onDelete = null;
      this.reservations = []; 
      
      // Garantir que o painel começa oculto
      this.element.classList.add('hidden');
      
      this.setupEventListeners();
    }
    
    setupEventListeners() {
      const drawButton = this.element.querySelector('#draw-button');
      const tabButtons = this.element.querySelectorAll('.tab-button');
      const closeAdmin = this.element.querySelector('#close-admin');
      
      // Adicionar eventos para as abas
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Remover classe ativa de todos os botões
          tabButtons.forEach(btn => btn.classList.remove('active'));
          
          // Adicionar classe ativa ao botão clicado
          button.classList.add('active');
          
          // Esconder todos os conteúdos de abas
          const tabContents = this.element.querySelectorAll('.tab-content');
          tabContents.forEach(content => content.classList.add('hidden'));
          
          // Mostrar conteúdo correspondente
          const tabId = button.getAttribute('data-tab');
          this.element.querySelector(`#${tabId}-tab`).classList.remove('hidden');
        });
      });
      
      // Botão de fechar o painel
      if (closeAdmin) {
        closeAdmin.addEventListener('click', () => {
          this.hide();
        });
      }
      
      if (drawButton) {
        drawButton.addEventListener('click', () => {
          if (this.onDraw) {
            this.onDraw();
          }
        });
      }
  
      const searchInput = this.element.querySelector('#search-participants');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const searchText = e.target.value.toLowerCase();
          const items = this.element.querySelectorAll('.participants-list li');
          
          items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchText)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      }
    }
    
    setOnDraw(callback) {
      this.onDraw = callback;
    }
    
    setOnDelete(callback) {
      this.onDelete = callback;
    }
    
    show() {
      this.element.classList.remove('hidden');
    }
    
    hide() {
      this.element.classList.add('hidden');
    }
    
    updateParticipantsList(reservations) {
      const list = this.element.querySelector('#participants-list');
      if (!list) return; // Proteção contra elementos não encontrados
      
      list.innerHTML = '';
      
      if (reservations.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Nenhuma reserva encontrada.';
        list.appendChild(emptyMessage);
        return;
      }
      
      // Ordenar por número
      const sortedReservations = [...reservations].sort((a, b) => a.number - b.number);
      
      sortedReservations.forEach(reservation => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="participant-info">
            <span class="number">${reservation.number}</span>
            <span class="name">${reservation.name}</span>
            <span class="phone">${reservation.phone}</span>
            <span class="gift">${reservation.gift}</span>
          </div>
        `;
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Remover';
        deleteButton.addEventListener('click', () => {
          if (this.onDelete) {
            this.onDelete(reservation.number);
          }
        });
        
        li.appendChild(deleteButton);
        list.appendChild(li);
      });
    }
  
    updateReservations(reservations) {
      this.reservations = reservations;
      this.updateParticipantsList(reservations);
    }
  
    showWinner(winner) {
      const winnerDisplay = this.element.querySelector('#winner-display');
      if (!winnerDisplay) return; // Proteção contra elemento não encontrado
      
      // Efeito de "embaralhamento" antes de mostrar o vencedor
      let count = 0;
      const totalIterations = 20;
      const interval = setInterval(() => {
        count++;
        
        if (this.reservations.length === 0) {
          clearInterval(interval);
          winnerDisplay.textContent = 'Não há participantes para sortear';
          return;
        }
        
        const randomIndex = Math.floor(Math.random() * this.reservations.length);
        const randomWinner = this.reservations[randomIndex];
        
        winnerDisplay.textContent = `Sorteando... ${randomWinner.number} - ${randomWinner.name}`;
        winnerDisplay.classList.add('draw-animation');
        
        if (count >= totalIterations) {
          clearInterval(interval);
          
          // Mostrar o vencedor real
          winnerDisplay.textContent = `🎉 Vencedor: Número ${winner.number} - ${winner.name} 🎉`;
          winnerDisplay.classList.remove('draw-animation');
          winnerDisplay.classList.add('winner-announcement');
          
          // Opcional: adicionar confetes ou outro efeito visual
          this.showConfetti();
        }
      }, 100);
    }
    
    showConfetti() {
      // Implementação simples de confete usando CSS
      const confettiContainer = document.createElement('div');
      confettiContainer.className = 'confetti-container';
      
      // Criar múltiplos elementos de confete
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        
        confettiContainer.appendChild(confetti);
      }
      
      document.body.appendChild(confettiContainer);
      
      // Remover após a animação
      setTimeout(() => {
        confettiContainer.remove();
      }, 5000);
    }
  }