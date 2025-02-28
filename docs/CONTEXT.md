# Prayer Times App - Technical Documentation


## TechStack
Frontend: React Native with TypeScript, Expo, and Expo Router
UI Framework: React Native Paper

## 1. App Flow & Core Features

### 1.1 Launch Screen
- Welcome message "Assalamu Aleykum"
- Loading screen while fetching initial data (location, prayer times)
- Auto-redirect to dashboard after loading

### 1.2 Dashboard
Main screen displaying essential information:

#### Prayer Times Display
- DITIB-based calculation method
- Next prayer time highlighted
- Countdown timer to next prayer
- Current date (Gregorian & Islamic calendar)
- Location display with auto-detection (optional)

#### Dynamic Background
Background adapts to current prayer time:
- Fajr: Dawn with sun/moon mix
- Dhuhr: Bright background with radiant sun
- Asr: Late afternoon sun
- Maghrib: Sunset with warm colors
- Isha: Night sky with clear moon

### 1.3 Navigation Bar
Bottom navigation with 4 main sections:

#### Calendar 📅
- Upcoming Islamic holidays
- Displays both Gregorian & Islamic dates
- Key events (Ramadan, Eid al-Adha, Mawlid an-Nabi)

#### Qibla Compass 🧭
- Direction to Mecca
- Real-time updates based on device orientation
- Location-based calculations

#### Settings ⚙️
- Theme toggle (Dark/Light mode)
- Notification preferences
  - Customizable alert timing (5/10/15 min before prayer)
- Location permissions management

## 2. Technical Requirements

### 2.1 Frontend
- Framework: React Native/Swift (iOS)
- System theme integration
- Device sensor integration (magnetometer)

### 2.2 Backend
- Prayer times API (DITIB method)
- Islamic calendar database
- Push notification system

### 2.3 Additional Features
- Offline functionality
  - Local storage for last known prayer times
- Minimalist UI/UX
- Performance optimization

## 3. Design Guidelines

### 3.1 Visual Elements
- Color scheme: Time-of-day adaptive
- Typography: Bilingual support (Arabic/Latin)
- Icons: Intuitive navigation symbols

### 3.2 User Experience
- Simplified interface
- Quick access to core features
- Smooth transitions

## 4. Data Management
- Local caching
- Real-time updates
- Privacy-focused location handling

## 5. Database Schema

### 5.1 Users Table
```sql
users (
  id: uuid primary key
  email: string unique
  created_at: timestamp
  last_login: timestamp
  preferences: jsonb {
    theme: string
    notification_timing: number
    notifications_enabled: boolean
    location_tracking: boolean
  }
)
```

### 5.2 Prayer Times Table
```sql
prayer_times (
  id: uuid primary key
  date: date
  location_id: uuid foreign key
  fajr: timestamp
  sunrise: timestamp
  dhuhr: timestamp
  asr: timestamp
  maghrib: timestamp
  isha: timestamp
  created_at: timestamp
)
```

### 5.3 Locations Table
```sql
locations (
  id: uuid primary key
  city: string
  country: string
  latitude: float
  longitude: float
  timezone: string
  created_at: timestamp
)
```

### 5.4 Islamic Events Table
```sql
islamic_events (
  id: uuid primary key
  name: string
  description: text
  hijri_date: date
  gregorian_date: date
  type: enum ['holiday', 'celebration', 'other']
  created_at: timestamp
)
```

### 5.5 User Locations Table
```sql
user_locations (
  id: uuid primary key
  user_id: uuid foreign key
  location_id: uuid foreign key
  is_primary: boolean
  created_at: timestamp
)
```

## 6. Project Structure

```
prayer-times-app/
├── app/                      # Expo Router pages
│   ├── (auth)/              # Authentication routes
│   ├── (tabs)/              # Main tab navigation
│   │   ├── home.tsx         # Dashboard
│   │   ├── calendar.tsx     # Islamic calendar
│   │   ├── qibla.tsx        # Qibla compass
│   │   └── settings.tsx     # User settings
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry point
├── assets/                   # Static assets
│   ├── fonts/
│   ├── images/
│   └── animations/          # Lottie files
├── components/              # Reusable components
│   ├── common/             # Shared components
│   ├── prayer-times/       # Prayer-specific components
│   ├── calendar/           # Calendar components
│   └── qibla/             # Qibla-specific components
├── constants/              # App constants
│   ├── theme.ts
│   └── config.ts
├── hooks/                  # Custom React hooks
│   ├── usePrayerTimes.ts
│   ├── useLocation.ts
│   └── useQibla.ts
├── services/              # API and external services
│   ├── supabase/         # Supabase related
│   ├── prayer-times/     # Prayer times calculation
│   └── notifications/    # Push notifications
├── store/                # State management
│   ├── auth/
│   └── settings/
├── types/                # TypeScript types
├── utils/               # Helper functions
└── config/              # App configuration
```

## 7. Key Technical Considerations

### 7.1 Database Relationships
- One-to-many relationship between Users and User Locations
- One-to-many relationship between Locations and Prayer Times
- Many-to-many relationship between Users and Locations through User Locations

### 7.2 Data Flow
- Prayer times are cached locally but synced with server
- User preferences stored both locally and in database
- Location data updated based on user movement/selection

### 7.3 Performance Optimization
- Implement efficient caching strategies
- Batch database operations
- Optimize prayer time calculations
- Minimize network requests
