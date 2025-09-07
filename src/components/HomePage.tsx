
interface HomePageProps {
  onAvatarClick: () => void;
}

export default function HomePage({ onAvatarClick }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      {/* Avatar Circular com Border Gradiente */}
      <div className="mb-8">
        <div 
          className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/50"
          onClick={onAvatarClick}
        >
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-4xl font-bold text-white animate-pulse">📱</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-white/80 text-sm">Clique para ver os stories</p>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
        Stories Player
      </h1>

      {/* Descrição do Projeto */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
          Uma experiência de stories interativa inspirada no Instagram, 
          construída com React e TypeScript.
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">✨ Características</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-green-400 text-xl">🎬</span>
                <span className="text-gray-200">Reprodução automática de vídeos</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400 text-xl">📱</span>
                <span className="text-gray-200">Interface responsiva e moderna</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-purple-400 text-xl">⚡</span>
                <span className="text-gray-200">Navegação por gestos</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400 text-xl">🔊</span>
                <span className="text-gray-200">Controle de áudio</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-red-400 text-xl">📊</span>
                <span className="text-gray-200">Barra de progresso visual</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-indigo-400 text-xl">🎯</span>
                <span className="text-gray-200">Integração com PeerTube</span>
              </div>
            </div>
          </div>
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