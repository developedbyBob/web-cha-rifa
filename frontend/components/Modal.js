// frontend/components/Modal.js
class ReservationModal {
    constructor(element) {
      this.element = element;
      this.currentNumber = null;
      this.giftGroups = [
        { range: [1, 10], gifts: ["Fralda RN", "Pix R$30"], pixKey: "00020126460014br.gov.bcb.pix0111173690564300209Fralda RN520400005303986540530.005802BR5925GISELLE DA SILVA GONCALVE6009SAO PAULO62580520SAN2025011015261745950300017br.gov.bcb.brcode01051.0.063045488" },
        { range: [11, 40], gifts: ["Fralda P", "Pix R$35"], pixKey: "00020126450014br.gov.bcb.pix0111173690564300208Fralda P520400005303986540535.005802BR5925GISELLE DA SILVA GONCALVE6009SAO PAULO62580520SAN2025011015265452550300017br.gov.bcb.brcode01051.0.06304981A" },
        { range: [41, 70], gifts: ["Fralda M", "Pix R$40"], pixKey: "00020126450014br.gov.bcb.pix0111173690564300208Fralda M520400005303986540540.005802BR5925GISELLE DA SILVA GONCALVE6009SAO PAULO62580520SAN2025011015271660250300017br.gov.bcb.brcode01051.0.063040E73" },
        { range: [71, 100], gifts: ["Fralda G", "Pix R$45"], pixKey: "00020126450014br.gov.bcb.pix0111173690564300208Fralda G520400005303986540545.005802BR5925GISELLE DA SILVA GONCALVE6009SAO PAULO62580520SAN2025011015273878850300017br.gov.bcb.brcode01051.0.06304846C" }
      ];
      
      this.onSubmit = null;
      this.setupEventListeners();
    }
    
    setupEventListeners() {
      const closeButton = this.element.querySelector('#close-modal');
      const form = this.element.querySelector('#reservation-form');
      
      closeButton.addEventListener('click', () => this.close());
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.onSubmit) {
          const formData = new FormData(form);
          const selectedGift = this.element.querySelector('.gift-option.selected');
          
          if (!selectedGift) {
            alert('Por favor, selecione um presente.');
            return;
          }
          
          const data = {
            number: this.currentNumber,
            name: formData.get('name'),
            phone: formData.get('phone'),
            gift: selectedGift.textContent
          };
          
          this.onSubmit(data);
        }
      });
      
      const copyPixButton = this.element.querySelector('#copy-pix-key');
      copyPixButton.addEventListener('click', () => {
        const pixKey = this.element.querySelector('#pix-key');
        pixKey.select();
        document.execCommand('copy');
        
        const copySuccess = this.element.querySelector('#copy-success');
        copySuccess.classList.remove('hidden');
        setTimeout(() => {
          copySuccess.classList.add('hidden');
        }, 2000);
      });
    }
    
    setOnSubmit(callback) {
      this.onSubmit = callback;
    }
    
    open(number) {
      this.currentNumber = number;
      const selectedNumberSpan = this.element.querySelector('#selected-number');
      selectedNumberSpan.textContent = number;
      
      // Identificar grupo do número
      const group = this.giftGroups.find(g => number >= g.range[0] && number <= g.range[1]);
      
      // Gerar opções de presente
      const giftOptions = this.element.querySelector('#gift-options');
      const pixDetails = this.element.querySelector('#pix-details');
      const pixKey = this.element.querySelector('#pix-key');
      
      giftOptions.innerHTML = '';
      pixDetails.classList.add('hidden');
      
      group.gifts.forEach(gift => {
        const option = document.createElement('div');
        option.textContent = gift;
        option.className = 'gift-option';
        option.addEventListener('click', () => {
          document.querySelectorAll('.gift-option').forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');
          
          if (gift.startsWith('Pix')) {
            pixDetails.classList.remove('hidden');
            pixKey.value = group.pixKey;
          } else {
            pixDetails.classList.add('hidden');
          }
        });
        
        giftOptions.appendChild(option);
      });
      
      // Limpar campos do formulário
      this.element.querySelector('#name').value = '';
      this.element.querySelector('#phone').value = '';
      
      this.element.classList.remove('hidden');
      this.element.removeAttribute('inert');
    }
    
    close() {
      this.element.classList.add('hidden');
      this.element.setAttribute('inert', '');
      const form = this.element.querySelector('#reservation-form');
      form.reset();
      const giftOptions = this.element.querySelector('#gift-options');
      giftOptions.innerHTML = '';
      const pixDetails = this.element.querySelector('#pix-details');
      pixDetails.classList.add('hidden');
    }
    
    showError(message) {
      // Adicionar mensagem de erro ao modal
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      
      const form = this.element.querySelector('#reservation-form');
      form.insertBefore(errorDiv, form.firstChild);
      
      setTimeout(() => {
        errorDiv.remove();
      }, 3000);
    }
  }