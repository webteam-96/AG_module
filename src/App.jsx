import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/clubs" replace />} />
          <Route path="clubs" element={<ClubDirectory />} />
          <Route path="overview" element={<ZoneOverview />} />
          <Route path="membership" element={<Membership />} />
          <Route path="trf" element={<TRFGiving />} />
          <Route path="excellence" element={<ClubExcellence />} />
          <Route path="youth" element={<YouthServices />} />
          <Route path="projects" element={<ServiceProjects />} />
          <Route path="district" element={<DistrictComparison />} />
          <Route path="clubs/:clubId" element={<ClubDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/clubs" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
