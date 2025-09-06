import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const base = process.env.VITE_BASE_PATH || '/'
	return {
		plugins: [react()],
		base,
	}
})
