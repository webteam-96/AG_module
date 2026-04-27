import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// AG module
import AGLayout from './modules/ag/layout/AGLayout'
import ZoneOverview from './modules/ag/pages/ZoneOverview'
import ClubDirectory from './modules/ag/pages/ClubDirectory'
import Membership from './modules/ag/pages/Membership'
import TRFGiving from './modules/ag/pages/TRFGiving'
import ClubExcellence from './modules/ag/pages/ClubExcellence'
import YouthServices from './modules/ag/pages/YouthServices'
import ServiceProjects from './modules/ag/pages/ServiceProjects'
import DistrictComparison from './modules/ag/pages/DistrictComparison'
import ClubDetail from './modules/ag/pages/ClubDetail'

// Club module
import ClubLayout from './modules/club/layout/ClubLayout'
import ClubOverview from './modules/club/pages/Overview'
import AvenueOfService from './modules/club/pages/AvenueOfService'
import Communication from './modules/club/pages/Communication'
import EGovernance from './modules/club/pages/EGovernance'
import Payments from './modules/club/pages/Payments'
import Directory from './modules/club/pages/Directory'
import ClubWebsiteData from './modules/club/pages/WebsiteData'

// District module
import DistrictLayout from './modules/district/layout/DistrictLayout'
import DistrictOverview from './modules/district/pages/Overview'
import DistrictDirectory    from './modules/district/pages/Directory'
import DistrictCommittee    from './modules/district/pages/Committee'
import DistrictClubs        from './modules/district/pages/Clubs'
import DistrictMonthlyReport from './modules/district/pages/MonthlyReport'
import DistrictModerator    from './modules/district/pages/Moderator'
import DistrictAG           from './modules/district/pages/AG'
import DistrictWebsiteData  from './modules/district/pages/WebsiteData'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route index element={<Navigate to="/agdashboard/clubs" replace />} />

        {/* AG Dashboard */}
        <Route path="/agdashboard" element={<AGLayout />}>
          <Route index element={<Navigate to="/agdashboard/clubs" replace />} />
          <Route path="clubs" element={<ClubDirectory />} />
          <Route path="clubs/:clubId" element={<ClubDetail />} />
          <Route path="overview" element={<ZoneOverview />} />
          <Route path="membership" element={<Membership />} />
          <Route path="trf" element={<TRFGiving />} />
          <Route path="excellence" element={<ClubExcellence />} />
          <Route path="youth" element={<YouthServices />} />
          <Route path="projects" element={<ServiceProjects />} />
          <Route path="district" element={<DistrictComparison />} />
        </Route>

        {/* Club Dashboard */}
        <Route path="/clubdashboard" element={<ClubLayout />}>
          <Route index element={<Navigate to="/clubdashboard/overview" replace />} />
          <Route path="overview" element={<ClubOverview />} />
          <Route path="avenue" element={<AvenueOfService />} />
          <Route path="communication" element={<Communication />} />
          <Route path="egovernance" element={<EGovernance />} />
          <Route path="payments"  element={<Payments />} />
          <Route path="directory" element={<Directory />} />
          <Route path="website"   element={<ClubWebsiteData />} />
        </Route>

        {/* District Dashboard */}
        <Route path="/districtdashboard" element={<DistrictLayout />}>
          <Route index element={<Navigate to="/districtdashboard/overview" replace />} />
          <Route path="overview"       element={<DistrictOverview />} />
          <Route path="directory"      element={<DistrictDirectory />} />
          <Route path="committee"      element={<DistrictCommittee />} />
          <Route path="clubs"          element={<DistrictClubs />} />
          <Route path="monthly-report" element={<DistrictMonthlyReport />} />
          <Route path="moderator"      element={<DistrictModerator />} />
          <Route path="ag"             element={<DistrictAG />} />
          <Route path="website-data"   element={<DistrictWebsiteData />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/agdashboard/clubs" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
