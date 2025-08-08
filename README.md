# PropGuard AI - Property Risk Assessment Platform

## 🎯 Overview

PropGuard AI is an advanced property risk assessment and valuation platform that combines artificial intelligence, blockchain technology, and distributed computing to provide comprehensive property analysis for lenders, investors, and regulatory compliance.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-PropGuard%20AI-blue)](https://propguard-ai-openxai.lovable.app/)
[![Backend API](https://img.shields.io/badge/API-Manus%20Space-green)](https://9yhyi3c8nkjv.manus.space)
[![GitHub](https://img.shields.io/badge/GitHub-global--ai--spark-black)](https://github.com/lucylow/global-ai-spark)

## 🏗️ Architecture

### Frontend (Lovable + React)
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Shadcn/ui + Tailwind CSS  
- **State Management**: Custom hooks + React Query
- **Routing**: React Router v6

### Backend (Manus Space)
- **API Gateway**: https://9yhyi3c8nkjv.manus.space/api
- **Services**: PropGuard Core, LLM Integration, Blockchain, XNode, Data Pipeline
- **Architecture**: Microservices with distributed computing

## 🚀 Features

### 🤖 AI-Powered Analysis
- **Property Valuation**: Real-time property value assessment
- **Risk Scoring**: Climate, market, and financial risk analysis
- **Sentiment Analysis**: Market sentiment and property sentiment scoring
- **Predictive Modeling**: Future value and risk projections

### ⛓️ Blockchain Integration
- **Property NFTs**: Immutable property certificates
- **APRA Compliance**: CPS 230 compliant reporting
- **Audit Trail**: Transparent transaction history
- **Smart Contracts**: Automated compliance checking

### 🌐 Distributed Computing (XNode)
- **Parallel Processing**: Distributed valuation calculations
- **Scalable Architecture**: Handle high-volume assessments
- **Real-time Updates**: Live market data integration
- **Global Network**: Decentralized computing nodes

### 📊 Risk Assessment
- **Climate Risk**: Flood, fire, coastal erosion analysis
- **Market Risk**: Volatility and trend analysis
- **Financial Risk**: LVR, DTI, and lending risk metrics
- **Compliance Risk**: Regulatory requirement checking

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                     # Shadcn UI components
│   ├── dashboard/              # Dashboard components
│   ├── blockchain/             # Blockchain features
│   ├── risk/                   # Risk analysis
│   ├── reports/                # Report generation
│   └── common/                 # Shared components
├── services/
│   ├── api/                    # API service layer
│   ├── auth/                   # Authentication
│   └── utils/                  # Utility functions
├── hooks/                      # Custom React hooks
├── types/                      # TypeScript definitions
├── config/                     # Configuration files
├── pages/                      # Page components
└── styles/                     # Styling files
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- Bun (recommended) or npm

### Local Development
```bash
# Clone the repository
git clone https://github.com/lucylow/global-ai-spark.git
cd global-ai-spark

# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build
```

### Environment Variables
Create a `.env.local` file:
```env
VITE_API_BASE_URL=https://9yhyi3c8nkjv.manus.space/api
VITE_APP_NAME=PropGuard AI
VITE_ENABLE_BLOCKCHAIN=true
VITE_ENABLE_XNODE=true
```

## 📱 Usage

### Property Analysis
```typescript
import { usePropertyAnalysis } from '@/hooks/usePropertyAnalysis';

const { analyzeProperty, analysis, isLoading } = usePropertyAnalysis();

// Analyze a property
await analyzeProperty('123 Collins Street, Melbourne VIC');
```

### System Health Monitoring
```typescript
import { useSystemHealth } from '@/hooks/useSystemHealth';

const { health, getServiceStatus } = useSystemHealth();

// Check if all services are operational
const allHealthy = Object.values(health).every(service => 
  getServiceStatus(service) === 'online'
);
```

### API Integration
```typescript
import { propGuardAPI } from '@/services/api/propguard';

// Get property valuation
const analysis = await propGuardAPI.analyzeProperty('Value property in Sydney');

// Get market sentiment
const sentiment = await propGuardAPI.getMarketSentiment({ location: 'Sydney' });

// Mint property NFT
const nft = await propGuardAPI.mintPropertyNFT(propertyData, valuationData);
```

## 🔧 API Endpoints

### Core PropGuard
- `POST /api/propguard/process-command` - Property analysis
- `GET /api/propguard/health` - Health check

### LLM Integration
- `POST /api/llm/property-sentiment` - Property sentiment analysis
- `POST /api/llm/market-sentiment` - Market sentiment analysis
- `POST /api/llm/generate-lvr-report` - LVR report generation

### Blockchain
- `POST /api/blockchain/mint-valuation-nft` - Mint property NFT
- `POST /api/blockchain/apra-compliance-report` - APRA compliance
- `GET /api/blockchain/blockchain-health` - Blockchain status

### XNode Distributed Computing
- `POST /api/xnode/distributed-valuation` - Distributed valuation
- `POST /api/xnode/distributed-risk-assessment` - Risk assessment
- `GET /api/xnode/xnode-health` - XNode status

### Data Pipeline
- `POST /api/pipeline/financial-impact-assessment` - Financial impact
- `POST /api/pipeline/market-analysis` - Market analysis
- `GET /api/pipeline/pipeline-health` - Pipeline status

## 🏢 Compliance & Regulations

### APRA CPS 230 Compliance
- **Operational Resilience**: Continuous system monitoring
- **Critical Operations**: Risk assessment and valuation services
- **Service Provider Management**: Third-party API integration oversight
- **Incident Management**: Automated error detection and reporting

### NCCP Act Compliance
- **Responsible Lending**: Risk-based lending assessments
- **Borrower Verification**: Income and expense verification
- **Loan Suitability**: LVR and DTI ratio analysis

### Basel III Framework
- **Risk Weights**: Property risk scoring for capital requirements
- **Stress Testing**: Market volatility impact analysis
- **Capital Adequacy**: LVR ratio monitoring

## 🌍 Global Deployment

### Lovable Hosting
- **Primary**: https://propguard-ai-openxai.lovable.app/
- **Auto-deployment**: GitHub integration with instant updates
- **CDN**: Global content delivery for optimal performance

### Custom Domain Options
- Configure custom domains through Lovable project settings
- SSL certificates automatically provisioned
- DNS management for production deployments

## 🔐 Security

### Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Privacy**: GDPR and privacy law compliant
- **Access Control**: Role-based permissions system

### API Security
- **Authentication**: JWT token-based authentication
- **Rate Limiting**: API request throttling
- **Monitoring**: Real-time security monitoring

## 📈 Performance

### Optimization
- **Code Splitting**: Dynamic imports for optimal loading
- **Caching**: Intelligent API response caching
- **CDN**: Global content delivery network

### Monitoring
- **Health Checks**: Continuous system health monitoring
- **Performance Metrics**: Real-time performance tracking
- **Error Tracking**: Automated error detection and reporting

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push to branch: `git push origin feature/new-feature`
6. Create a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Automated code formatting
- **Conventional Commits**: Standardized commit messages

## 📞 Support

### Documentation
- **API Docs**: Available at `/docs` endpoint
- **Component Library**: Shadcn/ui documentation
- **Architecture Guide**: See `/docs/architecture.md`

### Contact
- **GitHub Issues**: https://github.com/lucylow/global-ai-spark/issues
- **Live Demo**: https://propguard-ai-openxai.lovable.app/
- **Backend API**: https://9yhyi3c8nkjv.manus.space

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Achievements

- ✅ **APRA CPS 230 Compliant** - Operational resilience framework
- ✅ **AI-Powered Analytics** - Advanced machine learning integration
- ✅ **Blockchain Certified** - Immutable property records
- ✅ **Distributed Architecture** - Scalable XNode computing
- ✅ **Real-time Processing** - Instant property analysis

---

**PropGuard AI** - Revolutionizing property assessment through artificial intelligence, blockchain technology, and distributed computing.


