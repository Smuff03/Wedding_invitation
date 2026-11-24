# Sagar & Shrutika – Wedding Invitation (React + Node.js)

## Run locally
```
npm install
npm run dev          # development at http://localhost:5173
```
## Production (Node server)
```
npm run build
npm start            # http://localhost:3000  (set PORT to change)
```
Deploy to any Node host (Render, Railway, a VPS): build command `npm install && npm run build`, start command `npm start`.

## Customise
- Names, dates, venue, Google Maps link, dress codes, captions: `src/data.js`
- Photos: `public/images/` (keep the same file names)
- Music: put your song at `public/music/song.mp3` (the 🔊 button appears automatically when the file exists; music starts when the guest taps the book, as phones require)
- Colours / layout: `src/styles.css`
