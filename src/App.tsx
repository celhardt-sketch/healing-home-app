import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import CrisisBanner from './components/CrisisBanner'
import LandingPage from './pages/LandingPage'
import DisclaimerGate from './pages/DisclaimerGate'
import Dashboard from './pages/Dashboard'
import CrisisMode from './pages/CrisisMode'
import KidsRegulationTools from './pages/KidsRegulationTools'
import TryAgainTool from './pages/TryAgainTool'
import RegulateMeNow from './pages/RegulateMeNow'
import CaregiverSupport from './pages/CaregiverSupport'
import ScriptsLibrary from './pages/ScriptsLibrary'
import LearningLibrary from './pages/LearningLibrary'
import LearningCategory from './pages/LearningCategory'
import LearningArticle from './pages/LearningArticle'
import GrowthTracker from './pages/GrowthTracker'
import FamilyPlan from './pages/FamilyPlan'
import SafetyResources from './pages/SafetyResources'
import MandatedReporterGuide from './pages/MandatedReporterGuide'
import PrintablesVault from './pages/PrintablesVault'
import AccountSettings from './pages/AccountSettings'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AccessGate from './pages/AccessGate'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

// These pages already show 911 and 988 in SafetyFooter. The public help strip
// stays off them so subscribers do not get a second banner.
const PAGES_WITHOUT_PUBLIC_STRIP = [
  '/dashboard',
  '/kids-regulation',
  '/try-again',
  '/regulate-me',
  '/caregiver-support',
  '/scripts',
  '/learning',
  '/growth-tracker',
  '/family-plan',
  '/printables',
  '/account',
  '/admin',
]

function isSignedInAppPage(pathname: string) {
  return PAGES_WITHOUT_PUBLIC_STRIP.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

export default function App() {
  const { pathname } = useLocation()
  const showCrisisStrip = !isSignedInAppPage(pathname)

  return (
    <AuthProvider>
      {showCrisisStrip && <CrisisBanner variant="strip" />}
      <Routes>
        {/* Public: landing, gates, legal, and safety-critical crisis pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/disclaimer" element={<DisclaimerGate />} />
        <Route path="/access-gate" element={<AccessGate />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/crisis" element={<CrisisMode />} />
        <Route path="/safety-resources" element={<SafetyResources />} />
        <Route path="/mandated-reporter-guide" element={<MandatedReporterGuide />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Requires sign-in + active subscription */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/kids-regulation" element={<ProtectedRoute><KidsRegulationTools /></ProtectedRoute>} />
        <Route path="/try-again" element={<ProtectedRoute><TryAgainTool /></ProtectedRoute>} />
        <Route path="/regulate-me" element={<ProtectedRoute><RegulateMeNow /></ProtectedRoute>} />
        <Route path="/caregiver-support" element={<ProtectedRoute><CaregiverSupport /></ProtectedRoute>} />
        <Route path="/scripts" element={<ProtectedRoute><ScriptsLibrary /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><LearningLibrary /></ProtectedRoute>} />
        <Route path="/learning/:categorySlug" element={<ProtectedRoute><LearningCategory /></ProtectedRoute>} />
        <Route path="/learning/:categorySlug/:articleSlug" element={<ProtectedRoute><LearningArticle /></ProtectedRoute>} />
        <Route path="/growth-tracker" element={<ProtectedRoute><GrowthTracker /></ProtectedRoute>} />
        <Route path="/family-plan" element={<ProtectedRoute><FamilyPlan /></ProtectedRoute>} />
        <Route path="/printables" element={<ProtectedRoute><PrintablesVault /></ProtectedRoute>} />

        {/* Requires sign-in only (billing management stays reachable if a subscription lapses) */}
        <Route path="/account" element={<ProtectedRoute requireSubscription={false}><AccountSettings /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
