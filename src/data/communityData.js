// Bee Property Community - Complete Hierarchical Data Model
// Hierarchy: Community -> 3 Apartments -> 3 Blocks per Apartment -> 4 Floors per Block -> 4 Flats per Floor (144 Flats Total)

export const COMMUNITY_INFO = {
  id: 'bee-community-master',
  name: 'Bee Property Community',
  tagline: 'Premier Master-Planned Residential Community',
  description: 'An elite 45-acre integrated gated development comprising 3 luxury apartment complexes, 9 residential blocks, 36 floors, and 144 designer flats connected by lush botanical promenades, smart IoT infrastructure, and resort amenities.',
  address: 'Bee Central Boulevard & Honeycomb Way, Metro Emerald District',
  city: 'Emerald City',
  state: 'CA',
  zip: '94016',
  aerialImage: '/Images/bee-community-master.jpg',
  totalApartments: 3,
  totalBlocks: 9,
  totalFloors: 36,
  totalFlats: 144,
  valuation: '$84.5M',
  established: 2024,
  amenities: [
    { id: 'am-1', name: 'Clubhouse "The Hive"', category: 'Social & Wellness', desc: '30,000 sq.ft private lounge, ballroom & spa', icon: 'Hexagon' },
    { id: 'am-2', name: 'Olympic Infinity Pool', category: 'Aquatics', desc: '50m temperature-regulated lap pool with private sunbeds', icon: 'Waves' },
    { id: 'am-3', name: 'Tennis & Pickleball Courts', category: 'Sports', desc: '3 championship floodlit courts with pro training', icon: 'Trophy' },
    { id: 'am-4', name: 'EV Supercharger Fleet', category: 'Green Tech', desc: '36 Level-3 DC fast chargers with solar canopy', icon: 'Zap' },
    { id: 'am-5', name: 'Botanical Bee Garden', category: 'Nature', desc: '10 acres of walking paths, herb gardens & reflection ponds', icon: 'Trees' },
    { id: 'am-6', name: '24/7 Perimeter Security', category: 'Safety', desc: 'Biometric entry gates, license plate AI & 24/7 patrol', icon: 'ShieldCheck' }
  ]
};

export const APARTMENT_TEMPLATES = [
  {
    id: 'apt-1',
    code: 'HCT',
    name: 'Honeycomb Towers',
    tagline: 'Ultra-Luxury High-Rise & Sky Penthouses',
    image: '/Images/honeycomb-towers.jpg',
    rating: 4.9,
    builtYear: 2024,
    accentColor: '#F59E0B',
    badgeColor: 'rgba(245, 158, 11, 0.15)',
    architecturalStyle: 'Geometric Glass Atrium & Golden Honeycomb Lattice',
    address: '100 Bee Boulevard, North Quadrant',
    description: 'Flagship architectural landmark featuring hexagonal sun-shielding glass facades, sky-atrium lounges, and direct clubhouse skywalk access.',
    features: ['Sky Lounge', 'Rooftop Helipad', 'Direct Club Skybridge', 'Wine Cellars', 'Concierge 24/7'],
    blocks: [
      { id: 'HCT-A', code: 'Block-A', name: 'Block A (Royal Hive)', wing: 'North Wing', elevators: 2, powerBackup: '100% DG Backed', security: 'Biometric FaceID + RFID' },
      { id: 'HCT-B', code: 'Block-B', name: 'Block B (Queen Wing)', wing: 'Central Hive', elevators: 2, powerBackup: '100% DG Backed', security: 'Smart Mobile Pass + RFID' },
      { id: 'HCT-C', code: 'Block-C', name: 'Block C (Skyline Pavilion)', wing: 'South Wing', elevators: 2, powerBackup: '100% DG Backed', security: 'Biometric Fingerprint + Intercom' }
    ]
  },
  {
    id: 'apt-2',
    code: 'AGR',
    name: 'Amber Grove Residences',
    tagline: 'Botanical Garden Sanctuary & Family Enclave',
    image: '/Images/amber-grove.jpg',
    rating: 4.8,
    builtYear: 2023,
    accentColor: '#10B981',
    badgeColor: 'rgba(16, 185, 129, 0.15)',
    architecturalStyle: 'Biophilic Contemporary & Cascading Fountain Courtyards',
    address: '250 Amber Enclave Way, Garden District',
    description: 'A serene garden oasis surrounded by landscaped zen courtyards, stone fountains, organic fruit groves, and private children play areas.',
    features: ['Zen Fountain Courtyard', 'Kids Nature Play Park', 'Pet Spa & Run', 'Co-Working Library', 'Organic Orchard'],
    blocks: [
      { id: 'AGR-A', code: 'Block-A', name: 'Block A (Orchard Wing)', wing: 'East Wing', elevators: 2, powerBackup: '100% DG Backed', security: 'Biometric FaceID + RFID' },
      { id: 'AGR-B', code: 'Block-B', name: 'Block B (Canopy Wing)', wing: 'Central Court', elevators: 2, powerBackup: '100% DG Backed', security: 'Smart Keycard + Mobile Pass' },
      { id: 'AGR-C', code: 'Block-C', name: 'Block C (Meadow Wing)', wing: 'West Wing', elevators: 2, powerBackup: '100% DG Backed', security: 'Biometric Fingerprint + Intercom' }
    ]
  },
  {
    id: 'apt-3',
    code: 'NBL',
    name: 'Nectar Bay Living',
    tagline: 'Waterfront Promenade Lofts & Tech Suites',
    image: '/Images/nectar-bay.jpg',
    rating: 4.9,
    builtYear: 2025,
    accentColor: '#3B82F6',
    badgeColor: 'rgba(59, 130, 246, 0.15)',
    architecturalStyle: 'Waterfront Modern Glass & Sunset Balconies',
    address: '88 Marina Bay Promenade, Harborfront',
    description: 'Contemporary coastal architecture with sunset-facing glass balconies overlooking the private yacht marina, infinity water features, and tech hubs.',
    features: ['Private Yacht Marina Pier', 'Saltwater Spa Deck', 'High-Speed Tech Hub', 'Sunset Rooftop Bar', 'Kayak Launch'],
    blocks: [
      { id: 'NBL-A', code: 'Block-A', name: 'Block A (Marina Wing)', wing: 'Harborfront Wing', elevators: 2, powerBackup: '100% DG Backed', security: 'Biometric FaceID + RFID' },
      { id: 'NBL-B', code: 'Block-B', name: 'Block B (Breeze Tower)', wing: 'Central Promenade', elevators: 2, powerBackup: '100% DG Backed', security: 'Smart Mobile Pass + RFID' },
      { id: 'NBL-C', code: 'Block-C', name: 'Block C (Lagoon Pavilion)', wing: 'Lagoon Wing', elevators: 2, powerBackup: '100% DG Backed', security: 'Biometric Fingerprint + Intercom' }
    ]
  }
];

// Resident Seed Pool for realism
const RESIDENT_NAMES = [
  { name: 'Dr. Marcus Vance', email: 'm.vance@techcorp.io', phone: '+1 (555) 234-8901', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Elena & Lucas Moreau', email: 'moreau.family@luxestate.com', phone: '+1 (555) 345-6789', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Dr. Sarah Sterling', email: 's.sterling@metromedical.org', phone: '+1 (555) 456-7890', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { name: 'David & Hannah Miller', email: 'miller.h@designgroup.com', phone: '+1 (555) 567-8901', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { name: 'Chloe Bennett', email: 'chloe.bennett@mediahive.net', phone: '+1 (555) 678-9012', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { name: 'Sebastian Wright', email: 'sebastian@wright-holdings.co', phone: '+1 (555) 789-0123', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
  { name: 'Nadia Kovac', email: 'nadia.kovac@fintech-ai.com', phone: '+1 (555) 890-1234', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { name: 'Julian Thorne', email: 'jthorne@globalcapital.io', phone: '+1 (555) 901-2345', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Aria Chen', email: 'aria.chen@venturepoint.vc', phone: '+1 (555) 112-3344', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { name: 'Oliver & Priya Patel', email: 'patel.family@biolabs.com', phone: '+1 (555) 223-4455', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
  { name: 'Samantha Reed', email: 's.reed@architects-studio.com', phone: '+1 (555) 334-5566', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { name: 'Carlos Mendez', email: 'c.mendez@aerotech.org', phone: '+1 (555) 445-6677', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { name: 'Maya Lin', email: 'maya.lin@sounddesign.com', phone: '+1 (555) 556-7788', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
  { name: 'Zachary Cole', email: 'z.cole@cloudmesh.io', phone: '+1 (555) 667-8899', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80' },
  { name: 'Victoria Hawthorne', email: 'v.hawthorne@royalgallery.com', phone: '+1 (555) 778-9900', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80' }
];

// Flat Configuration Matrix by Floor (Floor 1 to 4)
const FLOOR_SPEC_CONFIG = {
  4: [ // Penthouse Level
    { flatSuffix: '01', bhk: '4 BHK Sky Penthouse', beds: 4, baths: 4, sqft: 2450, rent: 4800, typeTag: 'Penthouse', facing: 'North-East (Panoramic Skyline)', balcony: 'Wrap-around 360° Terrace' },
    { flatSuffix: '02', bhk: '3 BHK Royal Penthouse', beds: 3, baths: 3.5, sqft: 1980, rent: 3950, typeTag: 'Penthouse', facing: 'South-East (Sunrise & Park)', balcony: 'Dual Terrace Deck' },
    { flatSuffix: '03', bhk: '3 BHK Executive Loft', beds: 3, baths: 3, sqft: 1750, rent: 3500, typeTag: 'Luxury', facing: 'South-West (Sunset & Pool)', balcony: 'Deep Lounge Balcony' },
    { flatSuffix: '04', bhk: '2 BHK Sky Suite', beds: 2, baths: 2, sqft: 1380, rent: 2950, typeTag: 'Deluxe', facing: 'North-West (Garden Vista)', balcony: 'Glass Balcony' }
  ],
  3: [ // Premium Level
    { flatSuffix: '01', bhk: '3 BHK Luxury Suite', beds: 3, baths: 3, sqft: 1680, rent: 3250, typeTag: 'Luxury', facing: 'East (Sunrise View)', balcony: 'Extended Balcony' },
    { flatSuffix: '02', bhk: '2 BHK Deluxe Plus', beds: 2, baths: 2, sqft: 1320, rent: 2650, typeTag: 'Deluxe', facing: 'South (Courtyard View)', balcony: 'Twin Balconies' },
    { flatSuffix: '03', bhk: '2 BHK Deluxe', beds: 2, baths: 2, sqft: 1220, rent: 2500, typeTag: 'Deluxe', facing: 'West (Sunset Vista)', balcony: 'Balcony with Planter' },
    { flatSuffix: '04', bhk: '1 BHK Modern Loft', beds: 1, baths: 1.5, sqft: 880, rent: 2050, typeTag: 'Modern 1BHK', facing: 'North (Promenade)', balcony: 'French Balcony' }
  ],
  2: [ // Deluxe Level
    { flatSuffix: '01', bhk: '3 BHK Comfort Suite', beds: 3, baths: 2.5, sqft: 1540, rent: 3000, typeTag: 'Luxury', facing: 'East (Morning Sunlight)', balcony: 'Balcony' },
    { flatSuffix: '02', bhk: '2 BHK Deluxe', beds: 2, baths: 2, sqft: 1250, rent: 2550, typeTag: 'Deluxe', facing: 'South (Garden View)', balcony: 'Balcony' },
    { flatSuffix: '03', bhk: '2 BHK Classic', beds: 2, baths: 2, sqft: 1180, rent: 2400, typeTag: 'Deluxe', facing: 'West (Courtyard)', balcony: 'Balcony' },
    { flatSuffix: '04', bhk: '1 BHK Studio Deluxe', beds: 1, baths: 1, sqft: 790, rent: 1850, typeTag: 'Modern 1BHK', facing: 'North (Park Green)', balcony: 'French Balcony' }
  ],
  1: [ // Ground / Terrace Level
    { flatSuffix: '01', bhk: '3 BHK Private Lawn', beds: 3, baths: 3, sqft: 1720, rent: 3200, typeTag: 'Terrace Suite', facing: 'East (Private Garden)', balcony: 'Private Lawn 400 sqft' },
    { flatSuffix: '02', bhk: '2 BHK Courtyard Home', beds: 2, baths: 2, sqft: 1300, rent: 2600, typeTag: 'Deluxe', facing: 'South (Flower Garden)', balcony: 'Private Patio' },
    { flatSuffix: '03', bhk: '2 BHK Garden Suite', beds: 2, baths: 2, sqft: 1210, rent: 2450, typeTag: 'Deluxe', facing: 'West (Pool Deck)', balcony: 'Stone Patio' },
    { flatSuffix: '04', bhk: '1 BHK Terrace Studio', beds: 1, baths: 1, sqft: 740, rent: 1780, typeTag: 'Modern 1BHK', facing: 'North (Courtyard)', balcony: 'Terrace Garden' }
  ]
};

// Predetermined vacant / turnover flat keys to ensure 91.7% realistic occupancy (8 vacant, 4 turnover)
const SPECIAL_STATUS_MAP = {
  // Vacant Flats (8 across the 3 apartments)
  'HCT-A-102': { status: 'Vacant', reason: 'Freshly Renovated & Staged' },
  'HCT-B-302': { status: 'Vacant', reason: 'Ready for Immediate Move-in' },
  'HCT-C-204': { status: 'Vacant', reason: 'Lease Closed Last Week' },
  'AGR-A-203': { status: 'Vacant', reason: 'Newly Listed Garden Unit' },
  'AGR-B-104': { status: 'Vacant', reason: 'Painted & Cleaned' },
  'AGR-C-302': { status: 'Vacant', reason: 'Open for Tour Showings' },
  'NBL-A-102': { status: 'Vacant', reason: 'Waterfront Unit Available' },
  'NBL-C-404': { status: 'Vacant', reason: 'Skyline Studio Available' },

  // Maintenance / Turnover Flats (4 across the 3 apartments)
  'HCT-A-104': { status: 'Maintenance', reason: 'HVAC Seasonal Overhaul & Filter Replacement', completionDate: 'Tomorrow at 4 PM' },
  'HCT-C-401': { status: 'Maintenance', reason: 'Penthouse Balcony Deck Weatherproofing', completionDate: 'Oct 15, 2026' },
  'AGR-B-201': { status: 'Maintenance', reason: 'Hardwood Floor Polishing & Fixture Inspection', completionDate: 'Oct 14, 2026' },
  'NBL-B-303': { status: 'Maintenance', reason: 'Smart Home Hub & Thermostat Calibration', completionDate: 'Today at 6 PM' },

  // Reserved Flats (2)
  'HCT-B-202': { status: 'Reserved', reason: 'Security Deposit Paid, Move-in Oct 18' },
  'NBL-A-301': { status: 'Reserved', reason: 'Lease Agreement Signed, Move-in Nov 01' }
};

// Generate the 144 Flats across 3 Apartments, 9 Blocks, 36 Floors
export function generateCommunityFlats() {
  const flats = [];
  let residentIndex = 0;

  APARTMENT_TEMPLATES.forEach(apt => {
    apt.blocks.forEach((block, bIdx) => {
      [4, 3, 2, 1].forEach(floorNum => {
        const floorConfigs = FLOOR_SPEC_CONFIG[floorNum];

        floorConfigs.forEach((cfg, flatIndex) => {
          const flatNumber = `${floorNum}0${flatIndex + 1}`;
          const flatId = `${block.id}-${flatNumber}`;
          const special = SPECIAL_STATUS_MAP[flatId];

          const status = special ? special.status : 'Occupied';
          const resident = status === 'Occupied'
            ? RESIDENT_NAMES[residentIndex % RESIDENT_NAMES.length]
            : null;

          if (status === 'Occupied') {
            residentIndex++;
          }

          flats.push({
            id: flatId,
            flatNumber,
            apartmentId: apt.id,
            apartmentCode: apt.code,
            apartmentName: apt.name,
            apartmentAccent: apt.accentColor,
            blockId: block.id,
            blockCode: block.code,
            blockName: block.name,
            blockWing: block.wing,
            floor: floorNum,
            bhk: cfg.bhk,
            bedrooms: cfg.beds,
            bathrooms: cfg.baths,
            sqft: cfg.sqft,
            rent: cfg.rent,
            deposit: cfg.rent,
            typeTag: cfg.typeTag,
            facing: cfg.facing,
            balcony: cfg.balcony,
            status, // 'Occupied' | 'Vacant' | 'Maintenance' | 'Reserved'
            statusNote: special ? special.reason : 'Long-Term Active Lease',
            completionDate: special?.completionDate || null,
            parkingSlot: `P-${block.code.split('-')[1]}${floorNum}${flatIndex + 1} (EV Slot)`,
            smartLockStatus: status === 'Occupied' ? 'Locked' : 'Access Ready',
            temperature: 71 + (flatIndex % 3),
            powerBackup: 'Active (100%)',
            waterMeterReading: `${120 + floorNum * 15} kL`,
            electricityMeterReading: `${280 + floorNum * 35} kWh`,
            features: [
              'Smart Keyless Digital Lock',
              'Nest Smart Thermostat',
              'High-speed Fiber (1 Gbps)',
              'Double-glazed Noise Insulation',
              'Dedicated EV Parking Bay'
            ],
            tenant: resident ? {
              name: resident.name,
              avatar: resident.avatar,
              email: resident.email,
              phone: resident.phone,
              leaseStart: '2025-06-01',
              leaseEnd: '2027-05-31',
              paymentStatus: (flatIndex % 4 === 0) ? 'Auto-Pay Active' : 'Paid',
              occupants: cfg.beds
            } : null
          });
        });
      });
    });
  });

  return flats;
}

// Initial full state of the 144 community flats
export const INITIAL_COMMUNITY_FLATS = generateCommunityFlats();
