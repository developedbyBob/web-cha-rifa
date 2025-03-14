// frontend/js/api.js
let reservationsCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 segundos

// Configuração comum para requisições
const requestOptions = (method = 'GET', body = null, needsAuth = false) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  if (needsAuth) {
    const token = localStorage.getItem('adminToken');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return options;
};

// Função auxiliar para lidar com respostas
const handleResponse = async (response) => {
  // Se a resposta não estiver no intervalo 200-299
  if (!response.ok) {
    // Tenta obter os detalhes do erro do corpo da resposta
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    } catch (e) {
      // Se não conseguir analisar o JSON, usa o erro da resposta
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
  }
  
  // Se a resposta estiver vazia
  if (response.status === 204) {
    return null;
  }
  
  // Retorna os dados JSON
  return await response.json();
};

class API {
  static async getReservations(forceRefresh = false) {
    try {
      const now = Date.now();
      
      // Usar cache se disponível e não muito antigo
      if (!forceRefresh && reservationsCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
        return reservationsCache;
      }
      
      // Se chegarmos aqui, precisamos buscar dados novos
      console.log('Buscando reservas do servidor...');
      
      const response = await fetch('/api/reservations', requestOptions());
      const data = await handleResponse(response);
      
      // Atualizar o cache
      reservationsCache = data;
      lastFetchTime = now;
      
      return data;
    } catch (error) {
      console.error('Erro ao obter reservas:', error);
      throw error;
    }
  }
  
  static async createReservation(data) {
    try {
      const response = await fetch('/api/reservations', requestOptions('POST', data));
      const result = await handleResponse(response);
      
      // Invalidar o cache para garantir dados atualizados
      lastFetchTime = 0;
      
      return result;
    } catch (error) {
      console.error('Erro ao adicionar reserva:', error);
      throw error;
    }
  }
  
  static async deleteReservation(number) {
    try {
      const response = await fetch(`/api/reservations/${number}`, requestOptions('DELETE', null, true));
      const result = await handleResponse(response);
      
      // Invalidar o cache para garantir dados atualizados
      lastFetchTime = 0;
      
      return result;
    } catch (error) {
      console.error('Erro ao remover reserva:', error);
      throw error;
    }
  }
  
  static async adminLogin(password) {
    try {
      const response = await fetch('/api/admin/login', requestOptions('POST', { password }));
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }
  
  static async drawWinner() {
    try {
      const response = await fetch('/api/admin/draw', requestOptions('POST', null, true));
      return await handleResponse(response);
    } catch (error) {
      console.error('Erro no sorteio:', error);
      throw error;
    }
  }
  
  // Método para verificar a conexão com a API
  static async checkConnection() {
    try {
      const response = await fetch('/api/status', requestOptions());
      const data = await handleResponse(response);
      console.log('Status da API:', data);
      return data;
    } catch (error) {
      console.error('Erro ao verificar conexão com a API:', error);
      throw error;
    }
  }
}