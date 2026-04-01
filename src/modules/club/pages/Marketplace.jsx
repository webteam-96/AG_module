import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import StatCard from '../components/StatCard'

export default function Marketplace() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Subscription"  value="Active"   sub="Rotary Web Marketplace"    subColor="up"    accent="#16a34a" />
        <StatCard label="Club Listings" value="12"       sub="Published on marketplace"  subColor="muted" accent="#003DA5" />
        <StatCard label="Member ID"     value="#1161484" sub="Registered club account"   subColor="muted" accent="#9333ea" />
        <StatCard label="Platform"      value="Rotary India" sub="webmarketplace.rotaryindia.org" subColor="muted" accent="#ca8a04" />
      </div>

      {/* Main launch card */}
      <Card>
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#003DA5' }}>
              <svg width="40" height="40" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Rotary Web Marketplace</h2>
            <p className="text-sm text-slate-500 mb-1">webmarketplace.rotaryindia.org</p>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              The Rotary India Web Marketplace is an external platform for clubs to list and discover
              member businesses, services, products, and social enterprises. Click below to open
              your club's marketplace portal.
            </p>
            <a
              href="https://webmarketplace.rotaryindia.org/Purchase?ID=1161484"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#003DA5' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Launch Marketplace
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Info cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">What is the Marketplace?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {[
                'List member businesses, products, and professional services',
                'Browse offerings from Rotary members across the district',
                'Promote social enterprises and NGO initiatives',
                'Create event listings with online payment links',
                'Connect with fellow Rotarian entrepreneurs',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#003DA5' }} />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Your Club's Listings</CardTitle>
            <CardDescription className="text-xs">Recently published on marketplace</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-slate-100">
            {[
              { title: 'TRF Fundraiser Dinner — Apr 20',      category: 'Event',   status: 'Active' },
              { title: 'Rotaract Charter Ceremony — Apr 25',  category: 'Event',   status: 'Active' },
              { title: 'Annual Membership Renewal',            category: 'Dues',    status: 'Open'   },
              { title: 'Vocational Training Camp — Apr 18',   category: 'Program', status: 'Active' },
            ].map((l, i) => (
              <div key={i} className="flex items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{l.title}</p>
                  <p className="text-[11px] text-slate-400">{l.category}</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
                  l.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}>{l.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {[
              { label: 'Club',             value: 'Thane City View RC'          },
              { label: 'Marketplace ID',   value: '#1161484'                     },
              { label: 'District',         value: '3142'                         },
              { label: 'Subscription',     value: 'Active', highlight: true      },
              { label: 'Contact Support',  value: 'support@rizones4567.org'      },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center">
                <span className="text-xs text-slate-500">{row.label}</span>
                <span className={`text-xs font-semibold ${row.highlight ? 'text-green-600' : 'text-slate-700'}`}>{row.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
