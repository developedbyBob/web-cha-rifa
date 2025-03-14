# Chá de Bebê do Benjamin

Um aplicativo web para gerenciar um chá de bebê, onde os participantes podem escolher um número de 1 a 100 e contribuir com fraldas ou PIX para celebrar a chegada do bebê Benjamin.

**Site ao vivo:** [https://web-cha-rifa.vercel.app/](https://web-cha-rifa.vercel.app/)

## 📋 Sobre o Projeto

Este aplicativo permite que amigos e familiares participem de um chá de bebê especial, escolhendo números de 1 a 100. Ao selecionar um número, os participantes podem optar por contribuir com um pacote de fraldas ou realizar um pagamento via PIX. O projeto inclui um painel administrativo para gerenciar as reservas e realizar um sorteio entre os participantes.

### ✨ Funcionalidades

- **Escolha de Números**: Interface intuitiva para selecionar números de 1 a 100
- **Opções de Contribuição**: Fraldas em diferentes tamanhos ou valores equivalentes via PIX
- **Chaves PIX Automáticas**: Geração automática de chaves PIX para copiar e colar
- **Painel Administrativo**: Gerenciamento de reservas e realização de sorteios
- **Design Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop
- **PWA (Progressive Web App)**: Pode ser instalado como um aplicativo nativo

## 🚀 Tecnologias Utilizadas

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Fontes do Google (Cookie, Hachi Maru Pop, Poppins)
- Service Worker para recursos offline

### Backend
- Node.js
- Express.js
- MongoDB com Mongoose
- JSON Web Tokens (JWT) para autenticação
- Express Validator para validação de dados

### DevOps
- Vercel para hospedagem
- MongoDB Atlas para banco de dados na nuvem

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js (v14+)
- MongoDB (local ou Atlas)
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/chaDeBEBE.git
   cd chaDeBEBE
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```
   PORT=3000
   MONGODB_URI=sua_string_de_conexao_mongodb
   ADMIN_PASSWORD=senha_para_acessar_painel_admin
   JWT_SECRET=uma_chave_secreta_para_jwt
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse o aplicativo**
   
   Abra seu navegador e acesse `http://localhost:3000`

## 📖 Uso

### Para Participantes

1. Acesse o site e visualize a grade com números de 1 a 100
2. Clique em um número disponível (os reservados estarão destacados)
3. Preencha seu nome e telefone
4. Escolha entre contribuir com um pacote de fraldas ou PIX
5. Se escolher PIX, copie a chave gerada para fazer o pagamento
6. Confirme sua participação!

### Para Administradores

1. Clique no botão "Para os Papais" no rodapé da página
2. Digite a senha administrativa configurada
3. Acesse o painel administrativo para:
   - Ver todos os participantes
   - Buscar participantes por nome ou número
   - Remover reservas se necessário
   - Realizar o sorteio do prêmio

## 🎨 Estrutura do Projeto

```
chaDeBEBE/
├── backend/              # Código do servidor
│   ├── config/           # Configurações (banco de dados, variáveis de ambiente)
│   ├── controllers/      # Controladores das rotas
│   ├── middleware/       # Middlewares (auth, validação)
│   ├── models/           # Modelos Mongoose
│   ├── routes/           # Definição de rotas
│   └── services/         # Serviços e lógica de negócios
├── frontend/             # Código do cliente
│   ├── assets/           # Recursos estáticos (imagens, favicon)
│   ├── components/       # Componentes JavaScript
│   ├── css/              # Estilos CSS
│   │   └── components/   # CSS específico para componentes
│   ├── js/               # Scripts JavaScript
│   └── index.html        # Página principal
├── public/               # Arquivos servidos estaticamente
│   ├── manifest.json     # Configuração PWA
│   ├── sw.js             # Service Worker
│   └── offline.html      # Página offline
├── server.js             # Ponto de entrada do servidor
├── package.json          # Dependências e scripts
├── vercel.json           # Configuração para deploy na Vercel
└── README.md             # Documentação
```

## 📱 Recursos da PWA

O aplicativo possui recursos de Progressive Web App (PWA):

- **Instalável**: Pode ser adicionado à tela inicial em dispositivos móveis
- **Funciona Offline**: Recursos básicos funcionam mesmo sem conexão à internet
- **Responsivo**: Adaptado para todos os tamanhos de tela
- **Rápido**: Carregamento otimizado com cache de recursos

## 🔒 Segurança

- **Validação de Dados**: Todos os dados de entrada são validados no servidor
- **Autenticação JWT**: O painel administrativo é protegido por tokens JWT
- **Sanitização de Entrada**: Prevenção contra injeção de código e XSS
- **Proteção CSRF**: Implementação de proteção contra CSRF
- **Rate Limiting**: Limite de requisições para prevenir ataques de força bruta

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📜 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 👋 Contato

Para questões, sugestões ou problema, por favor abra uma issue no GitHub ou entre em contato:

- **Email**: esdrassantos41@gmail.com
- **GitHub**: [Bob](https://github.com/developedbyBob)

---

Desenvolvido com ❤️ para o pequeno Benjamin.
