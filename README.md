# Chá de Bebê do Benjamin

Este é um projeto para gerenciar um chá de bebê, onde os participantes podem escolher um número de 1 a 100 e contribuir com um pacote de fraldas ou um valor equivalente via PIX.

## Funcionalidades

- Escolha de números de 1 a 100
- Opção de contribuição com fraldas ou PIX
- Painel administrativo para gerenciar reservas e realizar sorteios
- Copiar chave PIX para área de transferência

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML, CSS, JavaScript

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/chaDeBEBE.git
   cd chaDeBEBE
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure a conexão com o MongoDB no arquivo `database.js`.

4. Inicie o servidor:
   ```bash
   npm start
   ```

5. Acesse a aplicação em `http://localhost:3000`.

## Estrutura do Projeto

```
chaDeBEBE/
├── database.js
├── models/
│   └── reservation.js
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   └── assets/
│       └── images/
├── routes/
│   ├── index.js
│   └── reservations.js
├── views/
│   └── index.html
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Faça o push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT.
