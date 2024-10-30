# Rede Social com Inteligência Artificial - Wad.IA

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Google Generative AI](https://img.shields.io/badge/Google_Generative_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

## Índice

- [Sobre](#sobre)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Configuração e Execução](#configuração-e-execução)
- [Licença](#licença)

## Sobre

A **Rede Social com IA - Wad.IA** é uma aplicação moderna que integra funcionalidades de rede social com inteligência artificial. Desenvolvida para oferecer uma experiência única aos usuários, esta plataforma permite chat em tempo real, feed de notícias, e uma assistente virtual baseada na API Gemini da Google.

## 🔥 Tecnologias Utilizadas

Este projeto foi desenvolvido com um conjunto robusto de tecnologias para garantir desempenho, escalabilidade e uma UX intuitiva.

### Frontend
- **React**: Framework de interface para construção de componentes reativos.
- **React Router**: Navegação eficiente e sem recarregamento para uma experiência de SPA.
- **Tailwind CSS**: Estilização moderna e responsiva para um design visualmente atraente.
- **Socket.IO Client**: Permite chat em tempo real, oferecendo uma experiência de conversação contínua.

### Backend
- **Node.js**: Plataforma de execução JavaScript para o servidor.
- **Express.js**: Framework para criação de APIs RESTful.
- **MongoDB com Mongoose**: Banco de dados NoSQL para armazenamento de dados de usuários e postagens.
- **Socket.IO**: Implementação de WebSockets para comunicação em tempo real.


### Integração com IA
- **Google Generative AI (Gemini)**: Integração com o modelo Gemini para um chatbot com respostas contextuais e contínuas.

## 📲 Funcionalidades Principais

- **Feed de Notícias**: Exibição das postagens mais recentes e recomendadas.
- **Chat em Tempo Real**: Comunicação direta e instantânea com outros usuários.
- **Assistente Virtual Wad.IA**: Um chatbot inteligente que responde perguntas e interage com os usuários.
- **Criação de Perfil**: Interação com outros perfis cadastrados na plataforma.

## ⚙️ Configuração e Execução

- Rodar Remotamente

O servidor está disponível em https://rede-social-p1fh.onrender.com/ 
(Servidor hiberna após um tempo inativo, espere 1 minuto apos clicar no link)

- Rodar Localmente

1. **Clone o Repositório**:
   ```sh
   
   git clone https://github.com/VlaadX/rede-social.git
   cd rede-social    
   
2. **Configurar Variáveis de Ambiente**:
   Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:
   ```sh
   
    MONGO_URI=sua_mongodb_uri
    GEMINI_API_KEY=sua_chave_api_gemini
    PORT=sua_porta
    JWT_SECRET=sua_chave_jwt
    CLOUDINARY_CLOUD_NAME=seu_cloudinary_nome
    CLOUDINARY_API_KEY=sua_cloudinary_chave
    CLOUDINARY_API_SECRET=sua_cloudinary_secreta
   
3. **Instale as Dependências**:
    ```sh
    npm install
    
4. **Execute o Servidor**:
   ```sh
   npm start

- O servidor estará disponível em http://localhost:8000
   

