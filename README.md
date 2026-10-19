# 🇪🇸 HablaDos: Castilian Spanish Duo

A mobile-first web application designed for a couple to learn authentic **Castilian Spanish (*Castellano*)** rapidly and expressively through interactive AI dialogues, real-time voice corrections, and friendly competition.

Inspired by the design languages of **Samsung One UI 8.5** and **Apple iPhone 16** (liquid glassmorphism, floating capsule navigation, animated soundwaves, and haptic-feel micro-interactions).

---

## 🌟 Key Features

1. **🇪🇸 Authentic Castilian Spanish (*Castellano*)**:
   - Focuses strictly on Peninsular Spanish spoken in Spain (*vosotros*, *coche*, *ordenador*, *vale*, *guay*, *tapas*).
   - Pronunciation guide covering the iconic *distinción* (/θ/ for 'c' and 'z'), trilled 'rr', and throat 'jota'.

2. **💬 Conversational AI Tutor (Madrid Accent)**:
   - Powered by **Google Gemini** (`gemini-2.5-flash`).
   - Roleplays realistic situations (*Tapas in Madrid*, *Stroll through El Retiro*, *Atocha Train Station*, *Neighborhood Market*, *Free Chat*).
   - Speaks in Spanish, provides instant English inline corrections when you make mistakes, and features on-demand "Explain this" dialogue grammar breakdowns.

3. **🔬 Sentence Lab (Free Expression)**:
   - Freedom to write or dictate any Spanish sentence without rigid multiple-choice restrictions.
   - AI evaluates your sentence (0–100 score), rewrites it as a local would say it in Madrid, highlights what changed, awards XP, and triggers celebration confetti.

4. **🎙️ Audio & Voice Engine**:
   - Native Castilian Spanish voice synthesis (`es-ES`) with authentic pronunciation.
   - Microphone dictation (speech-to-text) to practice speaking directly into your phone.
   - Real-time animated audio wave visualizer.

5. **🏆 Couple Duel & Shared Feed**:
   - Dedicated profiles for both of you (**Él 🦁** and **Ella 👑**) with customizable names and avatars.
   - Live head-to-head scoreboard showing who leads in Weekly XP and Streaks.
   - Shared Daily Couple Challenge.
   - Shared Live Activity Feed to see each other's accomplishments in real time.

---

## 🚀 Getting Started (Running Locally)

### 1. Set Your Gemini API Key
Create or edit `.env.local` in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Tip: You can obtain a free Gemini API key at [Google AI Studio](https://aistudio.google.com/). Even without an API key, HablaDos includes a built-in Castilian simulator so you can test all features right away.*

### 2. Start the Development Server
```bash
npm run dev
```
The app will be live at `http://localhost:3000`.

### 3. Open on Your Phones (Local Wi-Fi)
To test on your mobile phones while at home:
1. Find your computer's local IP address (e.g. `192.168.1.50`).
2. Run:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
3. Open `http://<your-computer-ip>:3000` in Safari on iPhone or Chrome on Android.

---

## ☁️ Deploying to Vercel (Free 2-Minute Setup)

Because HablaDos is built with **Next.js 16**, it is 100% native to **Vercel**:

1. Push this folder to a GitHub repository:
   ```bash
   git add .
   git commit -m "Initial commit of HablaDos app"
   git remote add origin https://github.com/<your-username>/spanish-duo.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `spanish-duo` repository.
4. Under **Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `Your Google Gemini API Key`
5. Click **Deploy**.

Vercel will give you a free, public HTTPS URL (e.g. `https://spanish-duo.vercel.app`) that you and your lady can add to your phone home screens as a web app!

---

## 📱 Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4, Lucide Icons, Glassmorphism
- **AI Engine**: Google Gemini 2.5 Flash API
- **Audio Engine**: Web Speech API (`es-ES` Castilian voice selection & speech recognition)
- **Gamification**: Canvas Confetti, custom streak & XP storage layer