// frontend/components/AdminPanel.js
class AdminPanel {
    constructor(element) {
      this.element = element;
      this.onDraw = null;
      this.onDelete = null;
      this.setupEventListeners();
    }
    
    setupEventListeners() {
      const drawButton = this.element.querySelector('#draw-button');
      
      drawButton.addEventListener('click', () => {
        if (this.onDraw) {
          this.onDraw();
        }
      });
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
    
    showWinner(winner) {
      // Animação do sorteio
      const winnerDisplay = this.element.querySelector('#winner-display');
      
      // Efeito de "embaralhamento" antes de mostrar o vencedor
      let count = 0;
      const totalIterations = 20;
      const interval = setInterval(() => {
        count++;
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