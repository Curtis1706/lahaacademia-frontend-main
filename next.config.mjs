/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supprimer le rewrite global pour éviter les conflits
  // Les routes Next.js locales appelleront Django directement
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
}

export default nextConfig
