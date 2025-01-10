document.addEventListener('DOMContentLoaded', () => {
  fetchReservations();
});

async function fetchReservations() {
  try {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('grid');
    loading.classList.remove('hidden');
    grid.classList.add('hidden');
    
    const response = await fetch('/reservations');
    if (!response.ok) {
      throw new Error('Erro ao obter reservas');
    }
    reservations = await response.json(); // Atualizar a variável reservations
    
    // Adicionar um tempo de 2 segundos antes de exibir os números
    setTimeout(() => {
      renderGrid(reservations);
      renderParticipantsList(); // Atualizar a lista de participantes
      
      loading.classList.add('hidden');
      grid.classList.remove('hidden');
    }, 2000);
  } catch (error) {
    console.error('Erro ao obter reservas:', error);
  }
}

function renderGrid(reservations) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  for (let i = 1; i <= 100; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = i;
    cell.addEventListener('click', () => openModal(i)); // Adicionar evento de clique
    const reservation = reservations.find(r => r.number === i);
    if (reservation) {
      cell.classList.add('reserved');
      cell.dataset.name = reservation.name;
      cell.dataset.phone = reservation.phone;
      cell.dataset.gift = reservation.gift;
    }
    grid.appendChild(cell);
  }
}

const totalNumbers = 100;
const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const selectedNumberSpan = document.getElementById("selected-number");
const reservationForm = document.getElementById("reservation-form");
const giftOptions = document.getElementById("gift-options");
const pixDetails = document.getElementById("pix-details");
const pixKey = document.getElementById("pix-key");

let reservations = [];

// Configuração dos presentes por grupo de números
const giftGroups = [
  { range: [1, 10], gifts: ["Fralda RN", "Pix R$30"], pixKey: "00020126460014br.gov.bcb.pix0111173690564300209Fralda RN520400005303986540530.005802BR5925GISELLE DA SILVA GONCALVE6009SAO PAULO62580520SAN2025011015261745950300017br.gov.bcb.brcode01051.0.063045488" },
  { range: [11, 40], gifts: ["Fralda P", "Pix R$35"], pixKey: "00020126450014br.gov.bcb.pix0111173690564300208Fralda P520400005303986540535.005802BR5925GISELLE DA SILVA GONCALVE6009SAO PAULO62580520SAN2025011015265452550300017br.gov.bcb.brcode01051.0.06304981A" },
  { range: [41, 70], gifts: ["Fralda M", "Pix R$40"], pixKey: "00020126450014br.gov.bcb.pix0111173690564300208Fralda M520400005303986540540.005802BR5925GISELLE DA SILVA GONCALVE6009SAO PAULO62580520SAN2025011015271660250300017br.gov.bcb.brcode01051.0.063040E73" },
  { range: [71, 100], gifts: ["Fralda G", "Pix R$45"], pixKey: "00020126450014br.gov.bcb.pix0111173690564300208Fralda G520400005303986540545.005802BR5925GISELLE DA SILVA GONCALVE6009SAO PAULO62580520SAN2025011015273878850300017br.gov.bcb.brcode01051.0.06304846C" }
];

// Verificar o estado inicial do modal
console.log("Estado inicial do modal:", modal.classList.contains("hidden"));

// Adicionar evento para fechar o modal e limpar os campos do formulário
document.getElementById("close-modal").onclick = () => {
  console.log("Fechar modal clicado");
  modal.classList.add("hidden");
  modal.setAttribute("inert", "");
  reservationForm.reset();
  giftOptions.innerHTML = "";
  pixDetails.classList.add("hidden");
  console.log("Modal deve estar fechado:", modal.classList.contains("hidden"));
};

// Abrir modal
function openModal(number) {
  console.log("Abrir modal para o número:", number);
  if (reservations.find(r => r.number === number)) return;

  selectedNumberSpan.textContent = number;

  // Identificar grupo do número
  const group = giftGroups.find(g => number >= g.range[0] && number <= g.range[1]);
  
  // Gerar opções de presente
  giftOptions.innerHTML = "";
  group.gifts.forEach(gift => {
    const option = document.createElement("div");
    option.textContent = gift;
    option.className = "gift-option";
    option.onclick = () => {
      document.querySelectorAll(".gift-option").forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");
      if (gift.startsWith("Pix")) {
        pixDetails.classList.remove("hidden");
        pixKey.value = group.pixKey;
      } else {
        pixDetails.classList.add("hidden");
      }
    };
    giftOptions.appendChild(option);
  });

  modal.classList.remove("hidden");
  modal.removeAttribute("inert");
  console.log("Modal deve estar aberto:", !modal.classList.contains("hidden"));
}

// Reservar número
reservationForm.onsubmit = function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const selectedGiftOption = document.querySelector(".gift-option.selected");
  if (!selectedGiftOption) {
    alert("Por favor, selecione um presente.");
    return;
  }
  const gift = selectedGiftOption.textContent;
  const number = parseInt(selectedNumberSpan.textContent);

  fetch('/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ number, name, phone, gift })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Reserva adicionada:', data);
    fetchReservations();
    modal.classList.add("hidden");
    modal.setAttribute("inert", "");
    reservationForm.reset();
    giftOptions.innerHTML = "";
    pixDetails.classList.add("hidden");
    console.log("Modal deve estar fechado após reservar:", modal.classList.contains("hidden"));
  })
  .catch(error => console.error('Erro ao adicionar reserva:', error));
};

// Adicionar funcionalidades para o painel administrativo
const adminButton = document.getElementById("admin-button");
const adminPanel = document.getElementById("admin-panel");
const participantsList = document.getElementById("participants-list");
const drawButton = document.getElementById("draw-button");
const winnerDisplay = document.getElementById("winner-display");
const adminPassword = "584020"; // Defina sua senha aqui

// Solicitar senha para abrir painel administrativo
adminButton.onclick = () => {
  const password = prompt("Digite a senha de administrador:");
  if (password === adminPassword) {
    adminPanel.classList.toggle("hidden");
    renderParticipantsList();
  } else {
    alert("Senha incorreta!");
  }
};

// Renderizar lista de participantes
function renderParticipantsList() {
  participantsList.innerHTML = "";
  reservations.forEach(reservation => {
    const li = document.createElement("li");
    li.textContent = `Número: ${reservation.number}, Nome: ${reservation.name}, Telefone: ${reservation.phone}, Presente: ${reservation.gift}`;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.onclick = () => removeReservation(reservation.number);
    li.appendChild(removeButton);
    participantsList.appendChild(li);
  });
}

// Função para remover uma reserva
function removeReservation(number) {
  fetch(`/reservations/${number}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log('Reserva removida:', data);
    fetchReservations();
    renderParticipantsList();
  })
  .catch(error => console.error('Erro ao remover reserva:', error));
}

// Função para selecionar um vencedor aleatório
function selectRandomWinner(participants) {
  const randomIndex = Math.floor(Math.random() * participants.length);
  return participants[randomIndex];
}

// Realizar sorteio com animação
drawButton.onclick = () => {
  if (reservations.length === 0) {
    alert("Nenhum participante para sortear.");
    return;
  }

  let shuffleCount = 0;
  const shuffleInterval = setInterval(() => {
    const randomParticipant = selectRandomWinner(reservations);
    winnerDisplay.textContent = `Embaralhando... Número ${randomParticipant.number}, Nome: ${randomParticipant.name}`;
    shuffleCount++;

    // Parar a animação após 2 segundos (ajuste conforme necessário)
    if (shuffleCount > 20) {
      clearInterval(shuffleInterval);
      const winner = selectRandomWinner(reservations);
      winnerDisplay.textContent = `Vencedor: Número ${winner.number}, Nome: ${winner.name}`;
    }
  }, 100); // Atualiza a cada 100ms
};

// Adicionar evento para copiar a chave Pix
document.getElementById("copy-pix-key").onclick = () => {
  const pixKey = document.getElementById("pix-key");
  pixKey.select();
  pixKey.setSelectionRange(0, 99999); // Para dispositivos móveis

  try {
    document.execCommand('copy');
    const copySuccess = document.getElementById("copy-success");
    copySuccess.classList.remove("hidden");
    setTimeout(() => {
      copySuccess.classList.add("hidden");
    }, 2000);
  } catch (err) {
    console.error('Erro ao copiar a chave Pix: ', err);
  }
};
