# VopeX
All in one Outbound Sales




VopeX Sales - the AI-powered outbound SDR Android application:


vopex-sales/
├── app/                       # React Native (Expo) Android frontend
│   ├── assets/
│   │   ├── animations/        # Lottie JSON files
│   │   ├── fonts/             # Custom fonts
│   │   └── images/            # Optimized medical-theme images
│   ├── components/
│   │   ├── ai/                # AI components
│   │   │   ├── PersonalizationEngine.js
│   │   │   └── TacticSelector.js
│   │   ├── campaigns/
│   │   ├── leads/
│   │   ├── ui/                # Reusable UI elements
│   │   │   ├── MedicalPalette.js
│   │   │   ├── AnimatedButton.js
│   │   │   └── PerformanceCard.js
│   ├── constants/
│   │   ├── colors.js          # Medical theme palette
│   │   └── ai_tactics.js      # Psychological tactics config
│   ├── contexts/              # State management
│   │   ├── AuthContext.js
│   │   └── CampaignContext.js
│   ├── hooks/                 # Custom hooks
│   │   ├── useScraper.js
│   │   └── useAIPersonalizer.js
│   ├── navigation/            # React Navigation setup
│   ├── screens/
│   │   ├── auth/
│   │   ├── dashboard/         # Main app screens
│   │   │   ├── CampaignLaunch.js
│   │   │   ├── LeadBoard.js
│   │   │   └── MeetingCalendar.js
│   │   ├── ai-lab/            # AI training interface
│   │   └── settings/
│   ├── services/
│   │   ├── supabase.js        # Database client
│   │   ├── sheets.js          # Google Sheets API
│   │   └── huggingface.js     # AI service wrapper
│   └── utils/
│       ├── scraping.js        # Lead parsing helpers
│       └── ai_helpers.js      # Psychology tactic appliers
│
├── server/                    # Node.js/Express backend
│   ├── ai/
│   │   ├── personalization/   # Core AI logic
│   │   │   ├── textGenerator.js
│   │   │   └── videoGenerator.js
│   │   └── learning/          # AI improvement system
│   │       ├── patternDetector.js
│   │       └── tacticOptimizer.js
│   ├── scraping/
│   │   ├── leadFinder.js      # Web scraping module
│   │   └── relevanceScorer.js # Behavior analysis
│   ├── outreach/
│   │   ├── emailService.js    # Free-tier email (Resend/SendGrid)
│   │   ├── socialService.js   # LinkedIn/Twitter APIs
│   │   └── sequencer.js       # Follow-up automation
│   ├── database/
│   │   ├── supabase.js        # DB operations
│   │   └── sheetsSync.js      # Google Sheets integration
│   ├── config/                # API keys and settings
│   ├── routes/
│   │   ├── campaignRoutes.js
│   │   ├── aiRoutes.js
│   │   └── ... 
│   └── app.js                 # Server entry point
│
├── scripts/                   # Automation scripts
│   ├── deploy/                # Deployment helpers
│   │   ├── netlify.sh
│   │   └── nhost.sh
│   ├── scraping/              # Scheduled scraping jobs
│   └── ai-training/           # Periodic AI optimization
│
├── integration/               # 3rd party service configs
│   ├── supabase/              # SQL schema and RLS policies
│   ├── google-sheets/         # Sheet templates and scripts
│   └── huggingface/           # Model configs
│
├── .github/workflows          # CI/CD pipelines
│   ├── android-ci.yml
│   └── server-deploy.yml
│
├── docs/                      # Project documentation
│   ├── ARCHITECTURE.md        # System design
│   └── PSYCHOLOGY.md          # Sales tactics implementation
│
├── .env.template              # Environment variables
├── LICENSE
└── README.md                  # Medical-themed branding + setup
```

### Key Structural Features:

1. **Mobile-First Optimization**:
   - Lottie animations directory for lightweight visuals
   - Medical palette constants (`colors.js`)
   - Perf-optimized component structure

2. **AI-Centric Organization**:
   - Dedicated `ai-lab` screen for tactic management
   - Psychological tactic configs (`ai_tactics.js`)
   - Isolated AI services directory in backend

3. **Zero-Cost Infrastructure**:
   - Separate integration configs for free-tier services
   - Deployment scripts for Netlify/Nhost
   - Google Sheets sync utilities

4. **Security Implementation**:
   - Supabase RLS policies in `/integration`
   - Encrypted config handling
   - Isolated scraping modules

5. **Performance Critical Path**:
   - Cached AI responses in `services/huggingface.js`
   - Lazy-loaded campaign components
   - Background scraping scripts

6. **Sales Psychology Implementation**:
   - `tacticOptimizer.js` for AI learning
   - `PSYCHOLOGY.md` documentation
   - Tactic selector UI component

### Android-Specific Setup:

1. **app.json** Configuration:
```json
{
  "expo": {
    "name": "VopeX Sales",
    "slug": "vopex-sales",
    "android": {
      "package": "com.vopex.sales",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2B7CB6"
      }
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "enableProguardInReleaseBuilds": true,
            "extraMavenRepos": ["../../integration/android"]
          }
        }
      ]
    ]
  }
}
```

2. **Performance Critical Files**:
- `app/components/ui/PerformanceCard.js`: Dashboard metrics
- `server/outreach/sequencer.js`: Follow-up automation
- `server/ai/learning/patternDetector.js`: AI improvement system

This structure maintains strict separation between:
- AI processing and business logic
- Free-tier service integrations
- Mobile UI and backend services
- Sensitive data handling

The design supports single-command builds for Android while enabling all specified AI SDR capabilities through the free-tier stack.
