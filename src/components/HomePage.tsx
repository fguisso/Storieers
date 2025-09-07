
import { getGravatarUrl } from '../utils/gravatar';

interface HomePageProps {
  onAvatarClick: () => void;
}

export default function HomePage({ onAvatarClick }: HomePageProps) {
  // Pega o email do usuário da variável de ambiente
  const userEmail = import.meta.env.VITE_USER_EMAIL || 'default@example.com';
  const gravatarUrl = getGravatarUrl(userEmail, 128);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      {/* Avatar Circular com Border Gradiente */}
      <div className="mb-8 flex flex-col items-center">
        <div 
          className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50"
          onClick={onAvatarClick}
        >
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
            <img 
              src={gravatarUrl} 
              alt="Avatar do usuário" 
              className="w-28 h-28 rounded-full object-cover"
              onError={(e) => {
                // Fallback para emoji se a imagem do Gravatar falhar
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"><span class="text-4xl font-bold text-white animate-pulse">📱</span></div>';
                }
              }}
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-white/80 text-sm">Clique para ver os stories</p>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
        Storieers
      </h1>

      {/* História Pessoal */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
          Por que saí do Instagram e criei meu próprio sistema de stories?
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-8">
          <div className="space-y-6 text-left">
            <p className="text-lg text-gray-200 leading-relaxed">
              Depois de anos usando o Instagram, percebi que estava perdendo o controle sobre minhas próprias histórias. 
              Os algoritmos decidiam quem via meus posts, as plataformas comerciais limitavam minha criatividade, 
              e eu queria algo mais autêntico para compartilhar minhas ideias e viagens com minha família.
            </p>
            
            <p className="text-lg text-gray-200 leading-relaxed">
              Então criei o <strong className="text-white">Storieers</strong> - um sistema de stories próprio, 
              onde eu tenho controle total sobre meu conteúdo, sem algoritmos, sem limitações comerciais, 
              e com a liberdade de compartilhar o que realmente importa para mim e para quem eu escolher.
            </p>
            
            <p className="text-lg text-gray-200 leading-relaxed">
              Agora posso compartilhar minhas aventuras, reflexões e momentos especiais de forma genuína, 
              sabendo que cada pessoa que vê meus stories está lá porque realmente se importa.
            </p>
          </div>
        </div>

        {/* Accordion com Informações Técnicas */}
        <div className="mt-8">
          <details className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <summary className="cursor-pointer text-xl font-semibold text-white hover:text-gray-300 transition-colors duration-200 flex items-center justify-between">
              <span>🔧 Informações Técnicas</span>
              <span className="transform group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            
            <div className="mt-6 space-y-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Por que PeerTube?</h3>
                <p className="text-gray-200 leading-relaxed">
                  Escolhi o PeerTube como base porque é uma plataforma descentralizada e de código aberto. 
                  Isso me dá total controle sobre meu conteúdo, sem depender de grandes corporações. 
                  O PeerTube também oferece streaming de vídeo de alta qualidade com suporte a HLS, 
                  perfeito para uma experiência de stories fluida.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tecnologias Utilizadas</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">⚛️</span>
                      <span className="text-gray-200">React 18 + TypeScript</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">⚡</span>
                      <span className="text-gray-200">Vite (build tool)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-400">🎨</span>
                      <span className="text-gray-200">Tailwind CSS</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400">🔐</span>
                      <span className="text-gray-200">Crypto-JS (Gravatar)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-400">📺</span>
                      <span className="text-gray-200">HLS.js (streaming)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-400">👆</span>
                      <span className="text-gray-200">React Swipeable</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-400">🌐</span>
                      <span className="text-gray-200">PeerTube API</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-pink-400">📱</span>
                      <span className="text-gray-200">PWA Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Deploy e Contribuição</h3>
                <p className="text-gray-200 leading-relaxed mb-4">
                  O projeto é deployado automaticamente usando <strong className="text-white">GitHub Actions</strong> 
                  e hospedado no <strong className="text-white">GitHub Pages</strong>. 
                  Qualquer pessoa pode fazer fork do projeto, alterar as variáveis de ambiente 
                  e criar seu próprio sistema de stories personalizado.
                </p>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-300 mb-2">Para usar seu próprio PeerTube:</p>
                  <code className="text-green-400 text-sm block">
                    VITE_INSTANCE=https://sua-instancia-peertube.com<br/>
                    VITE_START_VIDEO=https://sua-instancia-peertube.com/w/seu-video<br/>
                    VITE_USER_EMAIL=seu-email@exemplo.com
                  </code>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <a 
                  href="https://github.com/fguisso/storieers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Ver no GitHub</span>
                </a>
              </div>
            </div>
          </details>
        </div>

        <div className="mt-8">
          <p className="text-lg text-gray-300">
            Clique no avatar acima para começar a experiência!
          </p>
        </div>
      </div>
    </div>
  );
}