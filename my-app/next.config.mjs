/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    env:{
      WEB3_AUTH_CLIENT_ID: 'BFpR6wWj7Qdf9y1Gjyca6XcSBzhpYZ4fk5LiGiurjFmKg5UovV5rl3yii41-0C0Xb8Ur-zlbmT6h1H9tzXMu6Dc',
      DATABASE_URL: 'postgresql://wastedb_owner:U6SsMDh2gTON@ep-wild-cherry-a1048kt3.ap-southeast-1.aws.neon.tech/wastedb?sslmode=require',
      GEMINI_API_KEY:'AIzaSyB2iBDJHZNytthVh4arWyLY9vhvnawAGhY',
      GOOOGLE_MAPS_API_KEY:'AIzaSyAqAo0-uDFPLPIxwKYEEO3jdBZUVu2J9V4'
    },
  };
  
  export default nextConfig;