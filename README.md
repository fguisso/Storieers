## PeerTube Stories (SPA React)

Uma aplicação React + TypeScript que reproduz vídeos do PeerTube em uma interface estilo stories do Instagram, com página inicial atrativa e avatar personalizado via Gravatar.

### Setup

1. Create `.env` at the project root (already provided):

```
VITE_INSTANCE=https://peertube.lhc.net.br
VITE_START_VIDEO=https://peertube.lhc.net.br/w/u1B3VoNay6dLgsGVnCfPbb
VITE_MAX_DURATION=120
VITE_PAGE_COUNT=20
VITE_USER_EMAIL=seu-email@exemplo.com
```

2. Install deps and run dev server:

```
npm install
npm run dev
```

Open the printed URL in a mobile browser or emulator.

### ✨ Features

#### Página Inicial
- **Avatar personalizado** com Gravatar baseado no email do usuário
- **Border gradiente** estilo Instagram (rosa → vermelho → amarelo)
- **Descrição completa** do projeto com características destacadas
- **Design responsivo** com gradientes modernos
- **Animações suaves** e efeitos hover

#### Stories Player
- **Reprodução automática** de vídeos HLS com fallback MP4
- **Navegação por gestos** (swipe esquerda/direita e tap)
- **Barra de progresso** segmentada e visual
- **Controles de áudio** (mute/unmute)
- **Informações do vídeo** (título, autor, instância)
- **Link "Ver no PeerTube"** para o vídeo original
- **Retorno automático** à página inicial ao final dos stories
- **Botão de fechar** no canto superior direito

### 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Crypto-JS** para hash MD5 do Gravatar
- **HLS.js** para streaming de vídeo
- **React Swipeable** para gestos de navegação

### 📱 Como usar

1. **Configure seu email** no arquivo `.env`:
   ```
   VITE_USER_EMAIL=seu-email@exemplo.com
   ```

2. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acesse a aplicação** no navegador e clique no avatar para iniciar os stories

### Limitations

- Frontend-only; no backend or login
- Single instance (`VITE_INSTANCE`) and single user/channel (resolved from `VITE_START_VIDEO`)
- No WebTorrent/P2P; no iframes/embed API
