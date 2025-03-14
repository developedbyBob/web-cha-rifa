// frontend/js/api.js
let reservationsCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 segundos

class API {
    
static async getReservations(forceRefresh = false) {
  try {
    const now = Date.now();
    
    // Usar cache se disponível e não muito antigo
    if (!forceRefresh && reservationsCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      return reservationsCache;
    }
    
    const response = await fetch('/api/reservations');
    if (!response.ok) {
      throw new Error('Erro ao obter reservas');
    }
    
    const data = await response.json();
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
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao adicionar reserva');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro ao adicionar reserva:', error);
        throw error;
      }
    }
    
    static async deleteReservation(number) {
      try {
        const response = await fetch(`/api/reservations/${number}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erro ao remover reserva');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro ao remover reserva:', error);
        throw error;
      }
    }
    
    static async adminLogin(password) {
        try {
          const response = await fetch('/api/admin/login', { // Está correto, já que usamos o prefixo /api nas rotas
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
          });
          
          if (!response.ok) {
            throw new Error('Senha incorreta');
          }
          
          return await response.json();
        } catch (error) {
          console.error('Erro no login:', error);
          throw error;
        }
      }
    
    static async drawWinner() {
      try {
        const response = await fetch('/api/admin/draw', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erro ao realizar sorteio');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro no sorteio:', error);
        throw error;
      }
    }
  }