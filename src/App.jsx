import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import ZoneOverview from './pages/ZoneOverview'
import ClubDirectory from './pages/ClubDirectory'
import Membership from './pages/Membership'
import TRFGiving from './pages/TRFGiving'
import ClubExcellence from './pages/ClubExcellence'
import YouthServices from './pages/YouthServices'
import ServiceProjects from './pages/ServiceProjects'
import DistrictComparison from './pages/DistrictComparison'
import ClubDetail from './pages/ClubDetail'

function ProtectedRoute({ children }) {
  const user = JSON.parse(sessionStorage.getItem('ag_user') || 'null')
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<ZoneOverview />} />
          <Route path="clubs" element={<ClubDirectory />} />
          <Route path="membership" element={<Membership />} />
          <Route path="trf" element={<TRFGiving />} />
          <Route path="excellence" element={<ClubExcellence />} />
          <Route path="youth" element={<YouthServices />} />
          <Route path="projects" element={<ServiceProjects />} />
          <Route path="district" element={<DistrictComparison />} />
          <Route path="clubs/:clubId" element={<ClubDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
