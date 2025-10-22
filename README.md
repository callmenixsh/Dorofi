# Dorofi - Focus Better with the Pomodoro Technique

![Dorofi Logo](public/assets/celestial.png)

Dorofi is a modern, feature-rich Pomodoro timer application that helps you boost productivity through focused work sessions and smart break management.

## Features

- **Smart Timer Management**
  - 25-minute focused work sessions
  - 5-minute breaks
  - Customizable session lengths
  - Session tracking and statistics

- **Theme System**
  - Four beautiful themes:
    - Dorofi Celestial (Purple/Blue)
    - Dorofi Crystal (Cyan/Teal)
    - Dorofi Lava (Orange/Pink)
    - Dorofi Noir (Black/White)
  - Automatic favicon and logo updates
  - Persistent theme preferences

- **User Features**
  - Task management
  - Progress tracking
  - Friend system
  - Leaderboards
  - Achievement system

- **Social Integration**
  - Friend activity tracking
  - Competitive leaderboards
  - Shared achievements
  - Real-time status updates

## Tech Stack

- **Frontend**
  - React
  - Redux Toolkit
  - TailwindCSS
  - Vite

- **Backend**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/callmenixsh/Dorofi.git
   cd Dorofi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Start the backend server:
Is private at the moment

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## Environment Setup

### Frontend (.env)
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
