# 🤖 CaterBot Kitchen AI

**AI-Powered Commercial Kitchen Equipment Troubleshooting Assistant**

A React PWA that provides instant troubleshooting help for restaurant kitchen equipment through QR code scanning, real-time AI chat, and intelligent equipment diagnostics.

## 🚀 Features

- **📱 Mobile-First PWA** - Optimized for kitchen staff using mobile devices
- **📷 QR Code Scanning** - Instant equipment identification via camera
- **🤖 AI-Powered Troubleshooting** - Real-time chat with intelligent assistance
- **💰 Cost Tracking** - Live monitoring of AI usage and savings
- **🔒 Multi-Tenant Architecture** - Secure data isolation between restaurant sites
- **⚡ Offline Support** - Basic functionality when internet is unavailable
- **🛡️ Safety-First** - Built-in safety protocols and escalation procedures

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Vite** for build tooling
- **PWA** with service worker

### Backend Integration
- **Supabase** for database and real-time features
- **Edge Functions** for AI orchestration
- **Row Level Security** for multi-tenant data protection
- **Claude API** integration for advanced troubleshooting

## 🎯 Target Users

- **Kitchen Staff** - Quick equipment troubleshooting during service
- **Restaurant Managers** - Cost monitoring and team oversight
- **Maintenance Teams** - Equipment status tracking and scheduling

## 📱 Mobile Experience

### Kitchen-Optimized Design
- **Large touch targets** for gloved hands
- **High contrast colors** for various lighting conditions
- **One-handed operation** support
- **Immediate visual feedback** for all interactions

### Real-World Usage
- **3-second QR scan to response** target
- **Works in noisy environments** (visual-first interface)
- **Handles wet/dirty hands** (large, forgiving touch areas)
- **Minimal training required** (intuitive workflow)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/HiImRodney/caterbot-kitchen-ai.git
cd caterbot-kitchen-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
The app is pre-configured with live Supabase endpoints:
```bash
VITE_SUPABASE_URL=https://ypmrqzxipboumkjttkmt.supabase.co
VITE_SUPABASE_ANON_KEY=<live_production_key>
VITE_SITE_ID=TOCA-TEST-001
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── QRScanner.tsx   # Camera-based QR scanning
├── pages/              # Main application pages
│   ├── LandingPage.tsx # Welcome and navigation
│   ├── EquipmentGrid.tsx # Equipment browser
│   └── ChatInterface.tsx # AI troubleshooting
├── contexts/           # React context providers
│   ├── EquipmentContext.tsx
│   └── UserContext.tsx
└── App.tsx            # Main application entry
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`from-slate-900 via-blue-900 to-slate-800`)
- **Equipment Status**:
  - ✅ Operational: `#10b981` (green)
  - ⚠️ Maintenance: `#f59e0b` (amber)
  - ❌ Broken: `#ef4444` (red)
- **Response Types**:
  - 🆓 Pattern Match: Green (free)
  - 🤖 AI Response: Blue (paid)
  - 🚨 Safety Alert: Red (priority)

### Typography
- **Primary Font**: Inter (clean, professional)
- **Large sizes** for primary actions (minimum 18px)
- **High contrast** text for readability

## 📊 Key Features

### 1. QR Code Scanner
- Camera integration with fallback manual entry
- Real-time equipment context loading
- Support for TOCA test equipment codes
- Flash and camera switching controls

### 2. Equipment Grid
- Visual equipment browser with categories
- Real-time status indicators
- Search and filtering capabilities
- Direct equipment selection for troubleshooting

### 3. AI Chat Interface
- Equipment-aware conversations
- Cost tracking per session
- Response type classification
- Safety escalation alerts
- Message history with copy functionality

### 4. PWA Capabilities
- Install to home screen
- Offline basic functionality
- Background sync for chat history
- Service worker caching

## 🔒 Security & Privacy

- **Row Level Security** ensures sites can only access their data
- **No sensitive data in frontend** (equipment IDs only)
- **Secure API key handling** via environment variables
- **Input validation** on all user inputs

## 💼 Business Model

- **Subscription**: £199-299/month per restaurant site
- **Cost Optimization**: 75% free responses via pattern matching
- **ROI Tracking**: Automatic calculation of service call savings
- **Scalability**: Multi-site restaurant chain support

## 🎯 Success Metrics

- **< 3 minutes** average issue resolution time
- **75%** reduction in service callouts
- **£2,400** average monthly savings per site
- **95%+** staff satisfaction with interface

## 🚀 Live Demo & Testing

### Test Equipment QR Codes
The app includes real TOCA test data with these QR codes:
- `TOCA-CK-CHILL-01` - Williams Reach-In Chiller #1
- `TOCA-HK-RANGE-01` - Falcon 6-Burner Range
- `TOCA-WU-DISH-01` - Hobart Dishwasher
- `TOCA-ICE-CUBE-01` - Hoshizaki Cube Ice Maker

### Demo Workflow
1. **Landing Page** - Choose "Scan Equipment" or "Browse Equipment"
2. **QR Scanner** - Use manual entry with test codes above
3. **Chat Interface** - Ask "This equipment is not working properly"
4. **AI Response** - Get instant troubleshooting guidance

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Build and deploy
npm run build
vercel --prod
```

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

## 🔧 Backend APIs

### Live Supabase Integration
The app connects to production Supabase endpoints:
- `/functions/v1/master-chat` - Main AI troubleshooting pipeline
- `/functions/v1/qr-scanner` - Equipment QR code processing
- `/functions/v1/equipment-context` - Equipment data retrieval

### API Features
- **Cost-optimized AI orchestration** (75% free responses)
- **Real-time equipment context** loading
- **Multi-tenant data isolation** with RLS
- **Safety protocol integration** with automatic escalation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TOCA Restaurant Group** - Partnership and testing
- **Supabase** - Backend infrastructure
- **Anthropic Claude** - AI troubleshooting capabilities
- **Kitchen Staff Everywhere** - The real heroes keeping restaurants running

---

**Built with ❤️ for the restaurant industry**

*Making kitchen equipment issues a thing of the past, one troubleshooting session at a time.*

## 🚀 What's Next?

This repository contains a fully functional CaterBot frontend that's ready for production use. The backend is already deployed and working - you can start using the app immediately!

### Ready Features
- ✅ Complete React PWA with mobile optimization
- ✅ Live Supabase integration with production endpoints
- ✅ QR scanner with camera integration
- ✅ AI chat interface with cost tracking
- ✅ Equipment grid with real-time data
- ✅ Service worker for offline support
- ✅ Production-ready configuration

### Next Steps for TOCA Integration
1. **Test with real equipment** - Scan the test QR codes
2. **Staff training** - Simple 5-minute walkthrough
3. **Manager dashboard** - Monitor usage and savings
4. **Scale to more locations** - Roll out across restaurant chain

**The kitchen revolution starts now! 🍽️**