# AI Resume Analyzer - Frontend

A modern React application for AI-powered resume analysis and job matching.

## Features

- **User Authentication**: Login/Signup with role-based access
- **Resume Upload**: Drag & drop resume upload with PDF/DOC support
- **ATS Scoring**: AI-powered resume analysis with scoring
- **Job Matching**: Intelligent job recommendations based on skills
- **Dashboard**: Role-based dashboards for job seekers and recruiters
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for API state management
- **React Dropzone** for file uploads
- **Lucide React** for icons
- **Chart.js** for data visualization

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── ResumeUpload.jsx
│   ├── ATSScore.jsx
│   └── JobMatches.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Dashboard.jsx
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── context/            # React context providers
└── App.jsx             # Main app component
```

## Features in Detail

### Resume Upload
- Drag & drop interface
- Support for PDF, DOC, DOCX files
- File size validation (max 5MB)
- Real-time upload progress

### ATS Scoring
- Circular progress indicator
- Color-coded score ranges
- Skills detection display
- Improvement recommendations

### Job Matching
- Match percentage indicators
- Company and location details
- Required skills display
- Apply and save functionality

## TODO

- [ ] Integrate with backend API
- [ ] Add authentication state management
- [ ] Implement real file upload
- [ ] Add error handling
- [ ] Add loading states
- [ ] Implement job application flow
- [ ] Add user profile management
- [ ] Add admin dashboard
- [ ] Add analytics charts
- [ ] Add email notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
