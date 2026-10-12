# BeeProperty — ZIVION Admin Portal for Apartment Property Management

A high-performance, glassmorphic, enterprise-grade Apartment Property Management Admin Portal built in **React** with the **ZIVION Design System** (`theme.md`).

---

## 🎨 Theme Architecture (`src/theme.css`)
Coded directly from [theme.md](file:///c:/Full_Stack_Course/BeeProperty-Management/theme.md) with support for **Dark Mode** and **Light Mode**:
- **Primary Colors**: Navy `#0B1220`, Electric Blue `#3B82F6`, Cyan Blue `#22D3EE`, Light Background `#F8FAFC`, Dark Background `#060B14`.
- **UI Colors**: Glass `#FFFFFFCC`, Text Primary `#111827`, Text Secondary `#64748B`, Success `#10B981`, Warning `#F59E0B`, Error `#EF4444`, Border `#E2E8F0`.
- **Gradients**: Primary `#3B82F6` → `#22D3EE`, Secondary `#6366F1` → `#22D3EE`, Dark `#060B14` → `#0B1220`, Blue `#1D4ED8` → `#3B82F6`.
- **Component & Status Tokens**: Button states, active nav indicators, and IoT telemetry badges.

---

## 🏢 Specialized React Screens

1. **Executive Command Center (`DashboardScreen.jsx`)**:
   - Occupancy rate breakdown with dynamic multi-segment progress bar.
   - Monthly collection metrics ($498.3k / 97.8% on-time).
   - Interactive SVG financial velocity area & bar chart (Revenue vs Expenses over 6 months).
   - Real-time IoT Smart Access telemetry stream (Lobby RFID, Amazon smart lockers, license plate scanners).
   - Immediate action units carousel.

2. **Apartment Units & Elevation Matrix (`UnitsScreen.jsx`)**:
   - Floor elevation filtering (Floors 1–4, Penthouse).
   - Status filters: Occupied, Vacant Ready, In Turnover, Reserved.
   - Dual-view toggle: Visual Architecture Matrix Cards vs. Detailed Table.
   - Slide-out **Unit CAD Inspector Drawer (`UnitDetailDrawer.jsx`)** with vector floorplan layout, smart lock toggles, and climate controls.

3. **Residents CRM & Lease Lifecycle (`TenantsScreen.jsx`)**:
   - Resident directory with avatars, contact links, and vehicle & pet registrations.
   - Lease expiration tracker, AutoPay enrollment badges, and overdue balance highlights.
   - Full resident file inspection modal and electronic notice dispatcher.

4. **Maintenance & Dispatch Kanban (`MaintenanceScreen.jsx`)**:
   - 4-stage workflow lanes: *Reported / Intake*, *Active Dispatch*, *Urgent Escalation*, *Resolved & Signed*.
   - Filter by trade: HVAC, Plumbing, Electrical, Appliances, Security.
   - Certified technician tracking, SLA urgency, and field work order inspection modal.

5. **Financial Analytics & Rent Ledger (`FinancialsScreen.jsx`)**:
   - Gross potential rent, collected rent, delinquencies, and Net Operating Income (NOI).
   - Stream breakdown: Base rent, EV charging & parking, RUBS utility ratio, storage fees.
   - Real-time automated Stripe/ACH settlement ledger with printable receipt modals.

6. **Amenities & Facilities Hub (`AmenitiesScreen.jsx`)**:
   - High-end community spaces: Sky Lounge, Rooftop Infinity Lap Pool, Elite Fitness Club, Co-Working Studio, Fast EV Charging bays.
   - Operating hours, guest capacity limits, reservation counters, and instant booking modal.

7. **ZIVION Theme System Explorer (`ThemeGuideScreen.jsx`)**:
   - Interactive swatch catalog for all 42 color tokens from `theme.md`.
   - One-click hex code copy with toast feedback.
   - Live button variants, input states, and light/dark theme switch demonstration.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# -> Opens on http://localhost:5173/

# Build for production
npm run build
```
