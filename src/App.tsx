import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import DisclaimerGate from './pages/DisclaimerGate'
import Dashboard from './pages/Dashboard'
import CrisisMode from './pages/CrisisMode'
import Tools from './pages/Tools'
import KidsRegulationTools from './pages/KidsRegulationTools'
import TryAgainTool from './pages/TryAgainTool'
import RegulateMeNow from './pages/RegulateMeNow'
import CaregiverSupport from './pages/CaregiverSupport'
import ScriptsLibrary from './pages/ScriptsLibrary'
import LearningLibrary from './pages/LearningLibrary'
import GrowthTracker from './pages/GrowthTracker'
import FamilyPlan from './pages/FamilyPlan'
import SafetyResources from './pages/SafetyResources'
import MandatedReporterGuide from './pages/MandatedReporterGuide'
import PrintablesVault from './pages/PrintablesVault'
import AccountSettings from './pages/AccountSettings'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AccessGate from './pages/AccessGate'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/disclaimer" element={<DisclaimerGate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crisis" element={<CrisisMode />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/kids-regulation" element={<KidsRegulationTools />} />
        <Route path="/try-again" element={<TryAgainTool />} />
        <Route path="/regulate-me" element={<RegulateMeNow />} />
        <Route path="/caregiver-support" element={<CaregiverSupport />} />
        <Route path="/scripts" element={<ScriptsLibrary />} />
        <Route path="/learning" element={<LearningLibrary />} />
        <Route path="/growth-tracker" element={<GrowthTracker />} />
        <Route path="/family-plan" element={<FamilyPlan />} />
        <Route path="/safety-resources" element={<SafetyResources />} />
        <Route path="/mandated-reporter-guide" element={<MandatedReporterGuide />} />
        <Route path="/printables" element={<PrintablesVault />} />
        <Route path="/access-gate" element={<AccessGate />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
