import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente dos arquivos .env* conforme o mode
  const env = loadEnv(mode, process.cwd(), '') // sem prefixo para ler tudo

  // Prioridade: VITE_BASE_PATH (env) > fallback por mode
  // (garanta que tenha barra inicial; sem barra final é ok)
  const baseFromEnv = env.VITE_BASE_PATH && env.VITE_BASE_PATH.trim()
  const fallbackBase = mode === 'production' ? '/' : '/'
  const base = baseFromEnv || fallbackBase

  return {
    plugins: [react()],
    base,
  }
})
