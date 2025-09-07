import CryptoJS from 'crypto-js';

/**
 * Gera a URL do Gravatar baseada no email do usuário
 * @param email - Email do usuário
 * @param size - Tamanho da imagem (padrão: 200)
 * @returns URL do Gravatar
 */
export function getGravatarUrl(email: string, size: number = 200): string {
  // Gera o hash MD5 do email em lowercase e trimado
  const hash = CryptoJS.MD5(email.toLowerCase().trim()).toString();
  
  // Retorna a URL do Gravatar
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon&r=pg`;
}

/**
 * Gera a URL do Gravatar com fallback personalizado
 * @param email - Email do usuário
 * @param size - Tamanho da imagem (padrão: 200)
 * @param fallback - URL de fallback personalizada
 * @returns URL do Gravatar
 */
export function getGravatarUrlWithFallback(
  email: string, 
  size: number = 200, 
  fallback?: string
): string {
  const hash = CryptoJS.MD5(email.toLowerCase().trim()).toString();
  const fallbackParam = fallback ? encodeURIComponent(fallback) : 'identicon';
  
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${fallbackParam}&r=pg`;
}