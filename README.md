🚗 Smart Parking Dev
====================

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)


> A modern web application designed to streamline parking management by offering a user-friendly platform for locating, reserving, and managing parking spots.

🌐 [**Live Demo**](https://smart-parking-dev-tw4q.vercel.app/) | 📱 **Mobile Optimized** | 🔐 **Secure Authentication**

📖 Overview
-----------

Smart Parking Dev is a comprehensive parking management solution built during the **Bharat Shiksha Expo Hackathon** by **Anshik Jain**. This Next.js-powered application provides real-time parking availability, secure user authentication, and a responsive interface optimized for both desktop and mobile users. The platform simplifies the parking experience for users while empowering administrators with robust tools to manage parking facilities efficiently.

✨ Features
----------

### 🔐 User Management

*   **Secure Authentication**: Email/password login with NextAuth.js
    
*   **Google OAuth Integration**: One-click sign-in with Google
    
*   **Guest Access**: Explore the app without registration
    

### 🅿️ Parking Management

*   **Real-Time Search**: Find available parking spots by location
    
*   **Advanced Filters**: Sort by time, price, and proximity
    
*   **Instant Reservation**: Book parking spots in advance
    
*   **Booking History**: Track past and upcoming reservations
    

### 👨‍💼 Admin Features

*   **Dashboard Analytics**: View booking statistics and trends
    
*   **Spot Management**: Update availability and pricing
    
*   **User Management**: Handle reservations and customer support
    

### 🎨 User Experience

*   **Responsive Design**: Seamless experience across all devices
    
*   **Modern UI**: Clean interface with Geist font and Tailwind CSS
    
*   **Interactive Dashboard**: Intuitive user interface
    
*   **Real-time Updates**: Live parking availability status
    

🛠️ Tech Stack
--------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   TechnologyPurposeVersionNext.jsReact FrameworkLatestTypeScriptType SafetyLatestNextAuth.jsAuthenticationLatestTailwind CSSStylingLatestVercelDeployment-next/fontFont OptimizationGeist Font   `

🚀 Getting Started
------------------

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (v16 or higher)
    
*   **Git**
    
*   Package manager: **npm** / **yarn** / **pnpm** / **bun**
    
*   (Optional) **Google OAuth credentials** for Google sign-in
    

### 📥 Installation

1.  git clone https://github.com/Anshik-18/Smart-parking-dev.gitcd Smart-parking-dev
    
2.  \# Using npmnpm install# Using yarnyarn install# Using pnpmpnpm install# Using bunbun install
    
3.  \# Create environment filetouch .env.localAdd the following variables:envNEXTAUTH\_URL=http://localhost:3000NEXTAUTH\_SECRET=your\_secret\_hereGOOGLE\_CLIENT\_ID=your\_google\_client\_idGOOGLE\_CLIENT\_SECRET=your\_google\_client\_secret
    
4.  \# Using npmnpm run dev# Using yarnyarn dev# Using pnpmpnpm dev# Using bunbun dev
    
5.  **Open your browser**Navigate to [http://localhost:3000](http://localhost:3000) to view the application.
    

📱 Usage
--------

### For Users

1.  **🔍 Explore as Guest**: Use "Continue as Guest" to browse without signing up
    
2.  **👤 Create Account**: Register with email or sign in with Google OAuth
    
3.  **🔍 Search Parking**: Use the search bar to find spots by location
    
4.  **📅 Make Reservation**: Select time slots and reserve parking spots
    
5.  **📊 View Dashboard**: Access booking history and manage reservations
    

### For Administrators

1.  **🔑 Admin Access**: Log in with administrator credentials
    
2.  **📈 Analytics Dashboard**: View booking statistics and revenue
    
3.  **🅿️ Manage Spots**: Update availability, pricing, and spot details
    
4.  **👥 User Management**: Handle customer reservations and support
    

### File Structure

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Smart-parking-dev/  ├── app/                    # Next.js App Router  │   ├── page.tsx           # Home page  │   ├── layout.tsx         # Root layout  │   └── ...                # Other pages  ├── components/            # Reusable components  ├── public/               # Static assets  ├── styles/               # Global styles  ├── .env.local           # Environment variables  └── README.md            # This file   `

🌐 Deployment
-------------

### Quick Deploy with Vercel

1.  git add .git commit -m "Initial commit"git push origin main
    
2.  **Deploy on Vercel**
    
    *   Visit [vercel.com](https://vercel.com)
        
    *   Import your GitHub repository
        
    *   Add environment variables in Vercel dashboard
        
    *   Deploy with one click!
        
3.  **Configure Environment Variables**In your Vercel dashboard, add:
    
    *   NEXTAUTH\_SECRET
        
    *   GOOGLE\_CLIENT\_ID
        
    *   GOOGLE\_CLIENT\_SECRET
        
    *   NEXTAUTH\_URL (your production URL)
        

For detailed deployment instructions, check the [Next.js deployment documentation](https://nextjs.org/docs/deployment).



📚 Resources & Documentation
----------------------------

Expand your knowledge with these helpful resources:

*   📖 [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
    
*   🎓 [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
    
*   🔐 [NextAuth.js Documentation](https://next-auth.js.org/) - Authentication implementation guide
    
*   🎨 [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
    
*   💻 [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript language guide
    
*   🚀 [Vercel Platform](https://vercel.com/docs) - Deployment and hosting
    
👨‍💻 Contact & Support
-----------------------

**Developer**: Anshik Jain

*   🐙 **GitHub**: [@Anshik-18](https://github.com/Anshik-18)
    
*   📧 **Email**: [anshikjain1809@gmail.com](mailto:anshikjain1809@gmail.com)
    
*   🌐 **Live Demo**: [smart-parking-dev-tw4q.vercel.app](https://smart-parking-dev-tw4q.vercel.app/)
    

🙏 Acknowledgments
------------------

    
*   **Next.js Team** - For the amazing React framework
    
*   **Vercel** - For seamless deployment and hosting
    
*   **Contributors** - Thank you to everyone who contributes to this project!
    

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ by [Anshik Jain](https://github.com/Anshik-18)

_© 2025 Smart Parking Dev. All rights reserved._
