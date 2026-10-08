# Dumitru Imobiliare — aplicație mobilă

Aplicație Expo pentru iOS și Android. Proiectul afișează anunțurile aprobate de pe site-ul Dumitru Imobiliare și permite trimiterea anunțurilor spre moderare.

## Lansare

Instalare: `npm ci`

Verificări: `npm run lint` și `npx tsc --noEmit`

Construire iOS: `npx eas-cli@latest build --platform ios --profile production`

Bundle ID iOS: `DUMITRU-IOS-001` (identificatorul din App Store Connect; SKU: `ro.dumitruimobiliare.app`).

## Actualizare 1.0.2

Fotografiile sunt convertite în JPEG, redimensionate la cel mult 1600 px pe latura lungă și verificate după compresie. Trimiterea multipart folosește fișiere Blob compatibile cu Expo 57.

Cardul și detaliile anunțului afișează `stats.views` din `GET /api/listings`. Când serverul nu oferă statistici (inclusiv pentru anunțul static cu ID `1`), aplicația indică indisponibilitatea valorii. Această modificare afișează statisticile existente; nu introduce un endpoint presupus pentru înregistrarea deschiderilor din aplicație. Pentru acea integrare este necesar contractul sau codul backendului.

Înainte de lansare, verifică pe un iPhone:
- Publicarea cu JPEG, PNG, HEIC, o poză din iCloud și o imagine originală peste 4 MB.
- Publicarea cu șase fotografii; numele și tipul fișierelor trimise trebuie să fie JPEG.
- Anularea selecției, selecția eșuată și trimiterea fără conexiune: formularul trebuie să rămână utilizabil.
- Compararea numărului de vizualizări din aplicație cu `stats.views` de pe server și reîmprospătarea listei.

Este necesar un build iOS nou: modulul nativ `expo-image-manipulator` nu poate fi adăugat doar printr-o actualizare OTA.
