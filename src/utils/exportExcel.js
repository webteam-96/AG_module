import * as XLSX from 'xlsx'

// ── helpers ────────────────────────────────────────────────────────────────────
const inr = (n) => (n != null ? Number(n) : 0)
const pct = (n) => (n != null ? `${n}%` : '—')

// Save workbook helper
function save(wb, filename) {
  XLSX.writeFile(wb, filename)
}

// ── 1. Export ALL clubs summary ────────────────────────────────────────────────
export function exportAllClubs(clubs, agName = 'Anita C Murgai') {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Club Summary
  const summary = clubs.map((c, i) => ({
    'Sr No': i + 1,
    'Club Name': `RC ${c.name}`,
    'Club ID': c.id,
    'Members': c.members,
    'Members (Prev Year)': c.membersPrev ?? '—',
    'New Members': c.newMembers ?? '—',
    'Female Members': c.femaleMembers ?? '—',
    'Avg Attendance %': c.avgAttendance ?? '—',
    'MyRotary Registered': c.myRotaryCount ?? '—',
    'Total Meetings': c.meetings,
    'Total Projects': c.totalProjects,
    'TRF Total (INR)': inr(c.trf?.totalINR),
    'TRF Annual (INR)': inr(c.trf?.annualINR ?? c.trf?.annual * 84),
    'TRF Polio (INR)': inr(c.trf?.polioINR ?? c.trf?.polio * 84),
    'TRF Global Grant (INR)': inr(c.trf?.globalGrantINR ?? c.trf?.globalGrant * 84),
    'Citation Score': c.citationScore ?? '—',
    'National Project Rank': c.projectRank ?? '—',
    'Dues Status': c.duesStatus?.paid ? 'Paid' : 'Pending',
    'Outstanding Dues (INR)': c.duesStatus?.outstanding ?? 0,
    'President': c.president?.name ?? '—',
    'President Mobile': c.president?.mobile ?? '—',
    'Secretary': c.secretary?.name ?? '—',
    'AG': c.ag,
    'District': c.district,
  }))
  const ws1 = XLSX.utils.json_to_sheet(summary)
  ws1['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 10 }, ...Array(20).fill({ wch: 18 })]
  XLSX.utils.book_append_sheet(wb, ws1, 'Club Summary')

  // Sheet 2: TRF Details
  const trf = clubs.map((c) => ({
    'Club Name': `RC ${c.name}`,
    'Total TRF (INR)': inr(c.trf?.totalINR),
    'Annual Unrestricted (INR)': inr(c.trf?.annualINR ?? (c.trf?.annual ?? 0) * 84),
    'Polio Plus (INR)': inr(c.trf?.polioINR ?? (c.trf?.polio ?? 0) * 84),
    'Endowment (INR)': inr(c.trf?.endowmentINR ?? (c.trf?.endowment ?? 0) * 84),
    'Global Grant (INR)': inr(c.trf?.globalGrantINR ?? (c.trf?.globalGrant ?? 0) * 84),
    'Others (INR)': inr(c.trf?.othersINR ?? (c.trf?.others ?? 0) * 84),
    'Per Member Giving (INR)': c.members > 0 ? Math.round(inr(c.trf?.totalINR) / c.members) : 0,
  }))
  const ws2 = XLSX.utils.json_to_sheet(trf)
  ws2['!cols'] = [{ wch: 30 }, ...Array(7).fill({ wch: 22 })]
  XLSX.utils.book_append_sheet(wb, ws2, 'TRF Giving')

  // Sheet 3: Goals
  const goals = clubs.map((c) => ({
    'Club Name': `RC ${c.name}`,
    'Membership Growth %': c.goals?.membershipGrowth ?? '—',
    'TRF Per Capita (INR)': c.goals?.trfPerCapita != null ? Math.round(c.goals.trfPerCapita * 84) : '—',
    'Service Projects': c.goals?.projects ?? c.totalProjects,
    'Meeting Attendance %': c.goals?.attendance ?? c.avgAttendance ?? '—',
    'MyRotary %': c.goals?.myRotary ?? '—',
    'New Members': c.goals?.newMembers ?? '—',
    'Citation Score': c.citationScore ?? '—',
    'Dues Compliant': c.duesStatus?.paid ? 'Yes' : 'No',
  }))
  const ws3 = XLSX.utils.json_to_sheet(goals)
  ws3['!cols'] = [{ wch: 30 }, ...Array(8).fill({ wch: 22 })]
  XLSX.utils.book_append_sheet(wb, ws3, 'Goals')

  save(wb, `AG_All_Clubs_Analytics_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// ── 2. Export single club full analytics ───────────────────────────────────────
export function exportClubDetail(club) {
  const wb = XLSX.utils.book_new()
  const clubName = `RC ${club.name}`

  // Sheet 1: Membership
  const membership = [{
    'Club Name': clubName,
    'Current Members': club.members,
    'Previous Year Members': club.membersPrev ?? '—',
    'New Members Added': club.newMembers ?? '—',
    'Terminated Members': club.terminatedMembers ?? '—',
    'Female Members': club.femaleMembers ?? '—',
    'Female %': club.femaleMembers != null ? `${((club.femaleMembers / club.members) * 100).toFixed(1)}%` : '—',
    'MyRotary Registered': club.myRotaryCount ?? '—',
    'MyRotary %': club.myRotaryCount != null ? `${((club.myRotaryCount / club.members) * 100).toFixed(1)}%` : '—',
    'Avg Meeting Attendance %': club.avgAttendance ?? '—',
    'OCV Count': club.ocv ?? '—',
    'Announcements': club.announcements ?? '—',
  }]
  const ws1 = XLSX.utils.json_to_sheet(membership)
  ws1['!cols'] = Array(12).fill({ wch: 24 })
  XLSX.utils.book_append_sheet(wb, ws1, 'Membership')

  // Sheet 2: BOD
  if (club.bod?.length) {
    const bod = club.bod.map((b, i) => ({
      'Sr No': i + 1,
      'Designation': b.designation,
      'Member Name': b.name,
      'Email': b.email ?? '—',
      'Mobile': b.mobile ?? '—',
    }))
    const ws2 = XLSX.utils.json_to_sheet(bod)
    ws2['!cols'] = [{ wch: 6 }, { wch: 28 }, { wch: 28 }, { wch: 30 }, { wch: 16 }]
    XLSX.utils.book_append_sheet(wb, ws2, 'Board of Directors')
  }

  // Sheet 3: TRF
  const trf = [{
    'Club Name': clubName,
    'Total TRF (INR)': inr(club.trf?.totalINR),
    'Annual Unrestricted (INR)': inr(club.trf?.annualINR ?? (club.trf?.annual ?? 0) * 84),
    'Polio Plus (INR)': inr(club.trf?.polioINR ?? (club.trf?.polio ?? 0) * 84),
    'Endowment (INR)': inr(club.trf?.endowmentINR ?? (club.trf?.endowment ?? 0) * 84),
    'Global Grant (INR)': inr(club.trf?.globalGrantINR ?? (club.trf?.globalGrant ?? 0) * 84),
    'Others (INR)': inr(club.trf?.othersINR ?? (club.trf?.others ?? 0) * 84),
    'Per Member Giving (INR)': club.members > 0 ? Math.round(inr(club.trf?.totalINR) / club.members) : 0,
    'Target Per Member (INR)': 8400,
  }]
  const ws3 = XLSX.utils.json_to_sheet(trf)
  ws3['!cols'] = Array(9).fill({ wch: 24 })
  XLSX.utils.book_append_sheet(wb, ws3, 'Foundation & TRF')

  // Sheet 4: Service Projects
  if (club.projects?.length) {
    const projects = club.projects.map((p, i) => ({
      'Sr No': i + 1,
      'Club': p.club ?? clubName,
      'Date': p.date ?? '—',
      'Type': p.type ?? '—',
      'Category': p.category ?? '—',
      'Sub Category': p.subCategory ?? '—',
      'Title': p.title ?? '—',
      'Description': p.description ?? '—',
      'Cost (INR)': inr(p.cost),
      'Funding': p.funding ?? '—',
      'Beneficiaries': p.beneficiaries ?? 0,
      'Man Hours': p.manHours ?? 0,
      'Rotarians Involved': p.rotarians ?? 0,
      'One Time / Ongoing': p.oneTimeOngoing ?? '—',
      'Global Grant No': p.globalGrantNo ?? '—',
    }))
    const ws4 = XLSX.utils.json_to_sheet(projects)
    ws4['!cols'] = [{ wch: 5 }, { wch: 28 }, { wch: 12 }, { wch: 12 }, { wch: 22 },
      { wch: 22 }, { wch: 36 }, { wch: 40 }, { wch: 14 }, { wch: 14 },
      { wch: 14 }, { wch: 12 }, { wch: 18 }, { wch: 16 }, { wch: 18 }]
    XLSX.utils.book_append_sheet(wb, ws4, 'Service Projects')
  }

  // Sheet 5: Monthly CMR
  if (club.monthly?.length) {
    const monthly = club.monthly.map((m) => ({
      'Month': m.month,
      'Meetings': m.meetings,
      'TRF (USD)': m.trf ?? 0,
      'TRF (INR)': Math.round((m.trf ?? 0) * 84),
      'Projects': m.projects ?? 0,
      'Project Cost (INR)': inr(m.cost),
      'Beneficiaries': m.beneficiaries ?? 0,
      'Man Hours': m.manHours ?? 0,
      'Rotarians Involved': m.rotarians ?? 0,
      'Rotaractors': m.rotaractors ?? 0,
    }))
    const ws5 = XLSX.utils.json_to_sheet(monthly)
    ws5['!cols'] = Array(10).fill({ wch: 18 })
    XLSX.utils.book_append_sheet(wb, ws5, 'Monthly CMR')
  }

  // Sheet 6: Goals
  const goals = [{
    'Club Name': clubName,
    'Citation Score': club.citationScore ?? '—',
    'Membership Growth %': club.goals?.membershipGrowth ?? '—',
    'TRF Per Capita (INR)': club.goals?.trfPerCapita != null ? Math.round(club.goals.trfPerCapita * 84) : '—',
    'Service Projects': club.goals?.projects ?? club.totalProjects,
    'Meeting Attendance %': club.goals?.attendance ?? club.avgAttendance ?? '—',
    'MyRotary %': club.goals?.myRotary ?? '—',
    'New Members': club.goals?.newMembers ?? '—',
    'Dues Status': club.duesStatus?.paid ? 'Paid' : 'Pending',
    'Outstanding (INR)': club.duesStatus?.outstanding ?? 0,
  }]
  const ws6 = XLSX.utils.json_to_sheet(goals)
  ws6['!cols'] = Array(10).fill({ wch: 24 })
  XLSX.utils.book_append_sheet(wb, ws6, 'Goals')

  // Sheet 7: Dues
  const duesRows = [
    ...(club.dues?.paid ?? []).map((d) => ({
      'Status': 'PAID',
      'Document Type': d.type ?? '—',
      'Document Name': d.name ?? '—',
      'Uploaded On': d.uploadedOn ?? '—',
      'Paid On': d.paidOn ?? '—',
      'Amount (INR)': inr(d.amount),
    })),
    ...(club.dues?.notUploaded ?? []).map((d) => ({
      'Status': 'NOT UPLOADED',
      'Document Type': d.type ?? '—',
      'Document Name': d.name ?? '—',
      'Uploaded On': '—',
      'Paid On': '—',
      'Amount (INR)': 0,
    })),
  ]
  if (duesRows.length) {
    const ws7 = XLSX.utils.json_to_sheet(duesRows)
    ws7['!cols'] = [{ wch: 14 }, { wch: 24 }, { wch: 36 }, { wch: 14 }, { wch: 14 }, { wch: 16 }]
    XLSX.utils.book_append_sheet(wb, ws7, 'Dues & Compliance')
  }

  save(wb, `${club.name.replace(/\s+/g, '_')}_Analytics_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
