# AMD Ideathon

> A modern web application built as part of the AMD Ideathon initiative

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

This is a React + Vite web application developed for the AMD Ideathon competition. The project showcases innovative solutions using modern web technologies with a focus on performance and user experience.

**Repository**: [Tyagism/amd-ideathon](https://github.com/Tyagism/amd-ideathon)  
**Main Branch**: `main`  
**Language Composition**:
- JavaScript: 75.7%
- CSS: 23.8%
- HTML: 0.5%

## ✨ Features

- **React Framework** - Modern component-based architecture
- **Vite Build Tool** - Lightning-fast development and production builds
- **Hot Module Replacement (HMR)** - Instant updates during development
- **ESLint Integration** - Code quality and consistency
- **Responsive Design** - Works seamlessly across all devices
- **Performance Optimized** - Fast load times and smooth interactions

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React** | UI component library and framework |
| **Vite** | Build tool and dev server |
| **JavaScript (ES6+)** | Core application logic |
| **CSS3** | Styling and responsive layouts |
| **HTML5** | Semantic markup |
| **ESLint** | Code quality and linting |

## 📦 Prerequisites

Before you get started, make sure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0 or higher) or **yarn** - Comes with Node.js
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tyagism/amd-ideathon.git
   cd amd-ideathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   Or if using yarn:
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:5173`

## 💻 Usage

### Running the Application

```bash
npm run dev
```

The development server will start with Hot Module Replacement (HMR) enabled, so changes to your code will reflect instantly in the browser.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This allows you to preview the production build locally before deploying.

### Running Linter

```bash
npm run lint
```

This checks your code for quality issues and style violations.

## 📂 Project Structure

```
amd-ideathon/
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── styles/            # CSS files
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Application entry point
│   └── index.css           # Global styles
├── public/                # Static assets
├── index.html             # Main HTML file
├── vite.config.js         # Vite configuration
├── eslintrc.cjs           # ESLint configuration
├── package.json           # Project dependencies
└── README.md             # This file
```

## 🔨 Development

### Code Style

- Use **ES6+ JavaScript** and **JSX** syntax
- Follow consistent naming conventions (camelCase for variables/functions, PascalCase for components)
- Write meaningful comments for complex logic
- Maintain clean and organized CSS with proper selectors
- Follow ESLint rules for code quality

### Making Changes

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```

3. Run linter to check code quality
   ```bash
   npm run lint
   ```

4. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request for review

### Recommended VSCode Extensions

- **ES7+ React/Redux/React-Native snippets** - Helpful shortcuts
- **ESLint** - Real-time linting
- **Prettier** - Code formatting

## 🏗 Building for Production

```bash
npm run build
```

The optimized production build will be created in the `dist/` directory with:
- Minified JavaScript and CSS
- Optimized assets
- Source maps for debugging

### Deployment

The built files can be deployed to any static hosting service:

- **GitHub Pages** - Free hosting directly from your repository
- **Netlify** - Automatic deployments on push
  ```bash
  npm run build  # Build locally
  # Then deploy the dist/ folder
  ```
- **Vercel** - Optimized for React projects
- **AWS S3 + CloudFront** - Scalable cloud hosting
- **Traditional Web Server** - Serve the `dist/` folder

## 🔌 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| dev | `npm run dev` | Start development server with HMR |
| build | `npm run build` | Build for production |
| preview | `npm run preview` | Preview production build |
| lint | `npm run lint` | Run ESLint |

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and commit (`git commit -m 'Add amazing feature'`)
4. Run linter to ensure code quality (`npm run lint`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code:
- Follows the ESLint rules
- Is well-documented with comments
- Includes meaningful commit messages
- Has been tested in the development environment

## 📄 License

This project is open source. See the [LICENSE](LICENSE) file for details.

## 👤 Contact

**Author**: [Tyagism](https://github.com/Tyagism)

For questions or feedback, feel free to:
- Open an issue on [GitHub Issues](https://github.com/Tyagism/amd-ideathon/issues)
- Contact me directly via GitHub

---

<div align="center">

**Made with ❤️ for AMD Ideathon**

[⬆ back to top](#amd-ideathon)

</div>
