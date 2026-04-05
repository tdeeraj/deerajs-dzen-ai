# DZen AI 🧘‍♂️✨

**DZen AI** is a premium, AI-powered mental health and smart study companion designed specifically for university students. It combines advanced emotional intelligence with academic productivity tools, all wrapped in a calming, atmospheric blue interface.

---

## 🚀 Key Features

- **🤖 AI Companion**: A supportive, empathetic chatbot designed to help manage academic stress and provide emotional guidance.
- **📸 Emotion Detection**: Real-time facial expression analysis using AI to help users identify and understand their current emotional state.
- **📊 Mood Tracking**: Log your daily feelings and stress levels to visualize patterns and improve self-awareness.
- **📅 Study Architect**: A smart planner that helps you organize your academic tasks and manage your time effectively.
- **💬 Peer Support Forum**: An anonymous space to connect with other students, share experiences, and find community support.
- **🧘 Zen Zone**: A dedicated space for relaxation and mindfulness exercises.
- **📚 Wellness Library**: A curated collection of videos, articles, and guides for meditation, sleep, and academic well-being.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** (Vite)
- **Tailwind CSS** (Styling)
- **Motion** (Animations)
- **Lucide React** (Icons)
- **Recharts** (Data Visualization)
- **React Markdown** (Formatted AI responses)

### Backend
- **Node.js** & **Express**
- **SQLite** (`better-sqlite3`) for lightweight, local data storage
- **JWT** (Authentication)

### AI Integration
- **Google Gemini API** (`@google/genai`) for conversational AI and image analysis

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/dzen-ai.git
   cd dzen-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   APP_URL=http://localhost:3000
   ```
   *Note: You can get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

4. **Run the application**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 📁 Project Structure

- `/src`: Frontend React application (pages, components, context, services).
- `/server`: Backend Express server logic, routes, and database configuration.
- `server.ts`: Main entry point for the full-stack application.
- `studyzen.db`: SQLite database file (generated automatically).

---

## 🚀 Deployment

To build the project for production:

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   NODE_ENV=production npm start
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bugs or feature requests.

