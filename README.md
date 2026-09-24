# Dumitru Imobiliare — aplicație mobilă

Aplicație Expo pentru iOS și Android. Proiectul afișează anunțurile aprobate de pe site-ul Dumitru Imobiliare și permite trimiterea anunțurilor spre moderare.

## Lansare

Instalare: `npm ci`

Verificări: `npm run lint` și `npx tsc --noEmit`

Construire iOS: `npx eas-cli@latest build --platform ios --profile production`

Bundle ID iOS: `ro.dumitruimobiliare.app`.
