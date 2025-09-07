
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
		Saí do Instagram porque não queria mais ficar preso só às redes das grandes empresas, que controlam quase tudo e usam algoritmos para decidir o que a gente vê e até nos manipular prendendo nossa atenção. Também não gosto de como nossos dados viram produto para eles. Hoje uso serviços federados: em vez de uma única rede centralizada, são várias comunidades menores, como pequenas cooperatvas que se conectam entre si. Às vezes até uso meu próprio servidor caseiro, com mais liberdade e controle sobre meus dados.
            </p>
            <p className="text-lg text-white/60 leading-relaxed">
		<i>Aviso: ainda não consegui fugir totalmente das grandes empresas, mas aos poucos vamos nos concientizando e voltando ao controle dos nossos dados e nossa vida.</i>
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
            
            <div className="mt-6 space-y-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🌐 O que são Redes Federadas?</h3>
                <p className="text-gray-200 leading-relaxed mb-4">
                  Imagine se cada cidade tivesse sua própria rede social, mas todas pudessem se comunicar entre si. 
                  É assim que funcionam as redes federadas! Diferente do Instagram ou YouTube, onde tudo é controlado 
                  por uma empresa, as redes federadas são como uma federação de servidores independentes que conversam entre si.
                </p>
                <p className="text-gray-200 leading-relaxed">
                  Por exemplo: se você tem uma conta no Mastodon (rede social federada), você pode seguir e interagir 
                  com pessoas de outros servidores Mastodon, mesmo que elas estejam em "cidades" diferentes. 
                  É como ter um passaporte que funciona em vários países!
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🎬 Por que escolhemos o PeerTube?</h3>
                <p className="text-gray-200 leading-relaxed mb-4">
                  O PeerTube é como o YouTube, mas federado e descentralizado. Em vez de todos os vídeos ficarem 
                  em servidores do Google, cada instância do PeerTube (servidor) hospeda seus próprios vídeos, 
                  mas pode mostrar vídeos de outras instâncias também.
                </p>
                <p className="text-gray-200 leading-relaxed mb-4">
                  <strong className="text-white">Vantagens do PeerTube:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 ml-4">
                  <li><strong className="text-white">Controle total:</strong> Seu conteúdo, suas regras</li>
                  <li><strong className="text-white">Sem algoritmos:</strong> Seus vídeos aparecem para quem você escolher</li>
                  <li><strong className="text-white">Código aberto:</strong> Qualquer um pode ver como funciona</li>
                  <li><strong className="text-white">Streaming profissional:</strong> Suporte a HLS para vídeos de alta qualidade</li>
                  <li><strong className="text-white">API robusta:</strong> Fácil integração com aplicações personalizadas</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🎨 Por que uma interface familiar?</h3>
                <p className="text-gray-200 leading-relaxed mb-4">
                  Mesmo usando tecnologia descentralizada, mantive a interface similar ao Instagram Stories por uma razão simples: 
                  <strong className="text-white">facilitar a migração</strong>. Pessoas acostumadas com grandes plataformas 
                  se sentem mais confortáveis quando encontram algo familiar.
                </p>
                <p className="text-gray-200 leading-relaxed">
                  A ideia é mostrar que tecnologia descentralizada não precisa ser complicada. Você pode ter o melhor 
                  dos dois mundos: a simplicidade do Instagram com a liberdade das redes federadas.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">⚙️ Como estamos usando o PeerTube?</h3>
                <p className="text-gray-200 leading-relaxed mb-4">
                  Nossa aplicação funciona como uma "capa" sobre o PeerTube. Em vez de usar a interface padrão do PeerTube, 
                  criamos uma experiência personalizada que:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 ml-4">
                  <li>Conecta diretamente com a API do PeerTube para buscar vídeos</li>
                  <li>Transforma vídeos normais em formato "stories" (vertical, autoplay)</li>
                  <li>Adiciona controles de navegação por gestos (swipe)</li>
                  <li>Implementa barras de progresso visuais</li>
                  <li>Mantém a qualidade de streaming original do PeerTube</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🛠️ Justificativa das Tecnologias</h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">⚛️ React 18 + TypeScript</h4>
                    <p className="text-gray-200 text-sm">
                      React é a base da interface, permitindo componentes reutilizáveis e atualizações eficientes. 
                      TypeScript adiciona verificação de tipos, evitando erros comuns e facilitando manutenção. 
                      Escolhi React porque é maduro, tem grande comunidade e funciona perfeitamente para interfaces interativas.
                    </p>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">⚡ Vite (Build Tool)</h4>
                    <p className="text-gray-200 text-sm">
                      Vite é extremamente rápido para desenvolvimento e gera builds otimizados para produção. 
                      Diferente de ferramentas mais antigas, Vite usa módulos nativos do navegador durante desenvolvimento, 
                      resultando em recarregamento instantâneo quando você faz mudanças no código.
                    </p>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">🎨 Tailwind CSS</h4>
                    <p className="text-gray-200 text-sm">
                      Tailwind permite estilizar componentes diretamente no HTML usando classes utilitárias. 
                      Isso acelera o desenvolvimento, mantém consistência visual e facilita responsividade. 
                      É perfeito para prototipagem rápida e manutenção de design systems.
                    </p>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">📺 HLS.js (Streaming)</h4>
                    <p className="text-gray-200 text-sm">
                      HLS (HTTP Live Streaming) é o mesmo protocolo usado pelo YouTube e Netflix. 
                      HLS.js permite reproduzir vídeos HLS em navegadores que não suportam nativamente. 
                      Escolhi HLS porque oferece streaming adaptativo (ajusta qualidade conforme conexão) 
                      e é o padrão do PeerTube para vídeos de alta qualidade.
                    </p>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">👆 React Swipeable</h4>
                    <p className="text-gray-200 text-sm">
                      Para replicar a experiência do Instagram, precisava de gestos de navegação (swipe). 
                      React Swipeable detecta movimentos de toque e converte em ações de navegação. 
                      É leve, confiável e funciona perfeitamente em dispositivos móveis e desktop.
                    </p>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">🔐 Crypto-JS + Gravatar</h4>
                    <p className="text-gray-200 text-sm">
                      Gravatar é um serviço que gera avatares baseados no email do usuário. 
                      Crypto-JS gera o hash MD5 necessário para a API do Gravatar. 
                      Escolhi Gravatar porque é universal, confiável e não requer cadastro adicional.
                    </p>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">📱 PWA (Progressive Web App)</h4>
                    <p className="text-gray-200 text-sm">
                      PWA permite que a aplicação funcione como um app nativo, podendo ser instalada no celular. 
                      Isso melhora a experiência do usuário, permite notificações e funciona offline. 
                      É a ponte entre web e mobile, oferecendo o melhor dos dois mundos.
                    </p>
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
