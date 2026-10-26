# Zar's Tiki Shack - Hawaiian Shave Ice Catering

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-brightgreen.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)

A modern and responsive website for Zar's Tiki Shack, a Hawaiian shave ice catering service. Experience the taste of authentic Hawaiian shave ice at your next event!

![Website Preview](393b7334-29e5-4429-ab90-4313715e3331.png)

## 🌟 Features

- 📱 Responsive design for mobile, tablet, and desktop
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🔒 Type-safe development with TypeScript
- ⚡ Fast development with Vite
- 📧 Integrated contact form with EmailJS
- 🎯 SEO optimized
- 🚀 Easy deployment

## 🛠️ Technologies Used

- **Frontend Framework**: React 18.3
- **Build Tool**: Vite 6.3
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Routing**: React Router 6.26
- **Form Handling**: Controlled React form with browser validation
- **Email Integration**: EmailJS

## 🚀 Quick Start

### Prerequisites

- Node.js 22 (used in CI)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Zarskiii/zars-tiki-catering.git

# Navigate to the project directory
cd zars-tiki-catering

# Install dependencies
npm ci
```

### Development

```bash
# Start the development server
npm run dev
```

The development server will start at http://localhost:8081/zars-tiki-catering/ (or another port if 8081 is in use).

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable components
│   └── ui/        # UI components from shadcn/ui
├── pages/         # Page components
├── lib/           # Utility functions and helpers
├── hooks/         # Custom React hooks
└── assets/        # Static assets
```

## 📧 Contact Form Setup

The form uses EmailJS only when all build-time settings are provided. Otherwise it prepares an email draft that the customer must send themselves. [Setup and delivery verification](docs/catering-inquiry.md).

## 🌐 Deployment Options

1. **Via Lovable**
   - Visit [Lovable Project](https://lovable.dev/projects/517cc1a7-4328-4a35-9253-e38abbed93f3)
   - Click Share -> Publish

2. **Custom Domain**
   - Navigate to Project > Settings > Domains
   - Click Connect Domain
   - [Detailed guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 💻 Development Options

1. **Use Lovable**
   - Visit the [Lovable Project](https://lovable.dev/projects/517cc1a7-4328-4a35-9253-e38abbed93f3)
   - Start prompting for changes

2. **Local Development**
   - Clone the repository
   - Install dependencies
   - Use your preferred IDE

3. **GitHub Codespaces**
   - Launch directly from GitHub
   - Full development environment in the browser

## 📝 Inquiry Delivery and Validation

See [the inquiry delivery guide](docs/catering-inquiry.md) for environment variables,
EmailJS template fields, manual email behavior, deployment prerequisites, and an
end-to-end verification checklist. No working credentials or live deployment are
assumed by this repository.

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The regression suite mocks EmailJS: it never sends customer inquiries. It covers
successful service acceptance, errors and timeouts, manual email/copy fallback,
validation, duplicate submission prevention, and package links under HashRouter.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please reach out through:
- The contact form on the website
- Opening an issue in this repository

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [EmailJS](https://www.emailjs.com/) for the contact form functionality
