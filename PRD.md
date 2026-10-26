# BEE Residence — Admin Dashboard PRD

## 1. Project Overview

Build a professional, modern, responsive admin dashboard for BEE Residence, a residential property management platform.

**Technology:** React, Vite, TypeScript, Tailwind CSS, React Router, Lucide React.

**Primary Pages**
1. Dashboard
2. Properties
3. Agencies

**Design Direction:** Clean blue-and-white theme, professional typography, compact cards, subtle shadows, consistent spacing, and minimal borders.

Use the existing project configuration wherever possible. Implement functional interactions instead of static mockup screens.

---

## 2. Global UI Requirements

- Use a fixed left sidebar on desktop.
- Include Dashboard, Properties, and Agencies navigation.
- Add a compact header with page title, search, notifications, and admin profile.
- Use a collapsible sidebar on mobile.
- Maintain a consistent blue-and-white design system.
- Avoid unnecessary horizontal divider lines beneath headings.
- Avoid oversized cards, excessive borders, and unnecessary decorative elements.
- Use Lucide React icons.
- Implement functional navigation, forms, search, filters, modals, and buttons.
- Use realistic sample data only for initial demonstration.
- All property and agency records must be manageable by the admin.
- Do not create additional top-level pages beyond the three specified pages.
- Keep RWA management inside Properties.

---

# 3. Page One — Dashboard

Create a centralized overview of the residential management system.

### A. Summary Cards

Display:
- Total Apartments
- Total Blocks/Towers
- Total Flats
- Occupied Flats
- Vacant Flats
- Active Agencies
- Pending Agency Approvals
- Active Maintenance Requests

Each card should display a relevant icon, count, and short descriptive label.

All counts must be calculated from the actual application data.

### B. Property Overview

Display registered apartments using compact cards.

Each card should include:
- Apartment image
- Apartment name
- Location
- Total blocks
- Total flats
- Occupancy percentage
- Property status

Clicking an apartment should navigate to Properties and open its details.

### C. Maintenance Overview

Display recent maintenance requests with:
- Request title
- Apartment and block
- Service category
- Assigned agency
- Priority
- Status

Statuses:
- Reported
- Pending Assignment
- Assigned
- In Progress
- Completed

### D. Agency Overview

Display:
- Total registered agencies
- Active agencies
- Available agencies
- Pending approvals
- Currently allocated personnel

Include recent assignments and agency approval requests.

### E. Recent Activity

Show:
- New properties added
- Property information updated
- New maintenance requests
- Agency registration submissions
- Property assignment approvals
- Completed maintenance activities

Keep the dashboard clean and informative.

---

# 4. Page Two — Properties

Properties is the main property-management module.

It must support:

**Apartments → Blocks/Towers → Floors → Flats**

The admin must be able to create and manage all property information rather than depending on permanently hardcoded data.

## A. Properties Page Header

Display:
- Page title: Properties
- Short description: Manage apartments, blocks, flats, facilities, and property documents.
- Search properties input
- Property status filter
- Prominent `+ Add Property` button

The Add Property button must be clearly visible in the Properties page header.

## B. Apartment Listing

Display all registered apartments in a responsive card grid.

Each apartment card must include:
- Apartment image
- Apartment name
- Location
- Total blocks/towers
- Total floors
- Total flats
- Occupied flats
- Vacant flats
- Property status

Provide actions to:
- View Details
- Edit Property
- Manage Documents

Newly added properties must appear automatically in this listing.

Do not hardcode the apartment list.

## C. Apartment Details and Image Layout

When an admin selects an apartment, open its detailed view.

### Hero Image

Display the apartment image in a large, attractive hero section.

Include:
- Apartment name
- Location
- Property status
- Built year, if available
- Back button
- Breadcrumb navigation
- Manage RWA button
- Edit Property button

Apply a dark, semi-transparent overlay over the image so that the image remains visible in the background and the text is readable.

### Property Summary Placement

**Do not display the six large property summary cards beneath the hero image as shown in the current screenshot.**

Instead, place the property statistics directly inside the hero image section, immediately below the location and other property information.

Display compact statistics for:
- Total Blocks/Towers
- Total Floors
- Total Flats
- Occupied Flats
- Vacant Flats
- Active Maintenance Requests

Use a single compact information row or a neatly arranged group of small statistics.

On mobile, allow the statistics to wrap into compact rows without making the hero section excessively tall.

The apartment image, location, and statistics must feel like one unified property overview.

Below the hero section, display:
1. Blocks & Towers
2. Maintenance & Facilities

Keep these sections clean and easy to navigate.

---

## D. Add Property — Complete Registration Form

The admin must be able to register new apartments using the `+ Add Property` button.

Open a professional, well-organized form in a large modal, side panel, or dedicated form view within Properties.

Avoid putting every field into one crowded section. Group related fields into logical sections.

### Section 1: Basic Property Information

Fields:
- Apartment Name — Required
- Property Code — Automatically generated, editable only if appropriate
- Property Type
- Property Status
- Registration Number, if applicable
- Year of Construction
- Property Description
- Total Land Area, if available

Property types may include:
- Residential Apartment
- Gated Community
- Residential Township
- Other

### Section 2: Location Details

Fields:
- Address Line 1
- Address Line 2
- City
- State
- PIN Code
- Country
- Google Maps Location or Map Link, optional

### Section 3: Property Images

Allow the admin to:
- Upload a primary apartment image
- Upload additional property images
- Preview uploaded images
- Change the primary image
- Replace or remove images

Use the primary image for the apartment listing card and hero banner.

### Section 4: Property Structure

Allow the admin to define:
- Total blocks/towers
- Total floors per block
- Flat numbers and flat details

The structure must support different floor counts for different blocks.

For example:
- Tower A: 12 floors
- Tower B: 15 floors
- Tower C: 10 floors

Do not assume that every block has the same number of floors.

Provide an option to create the initial structure while adding the property or configure it later.

### Section 5: Property Documents

Allow the admin to upload and manage:
- Property registration documents
- Master plan
- Apartment layout
- Floor plans
- Route maps
- Site maps
- Construction plans
- Building approval documents
- Completion certificates
- Occupancy certificates
- Maintenance manuals
- Other supporting documents

Support PDF uploads and appropriate image/document formats.

For each document, store:
- Document name
- Document category
- File reference
- Upload date
- Description or remarks

Provide:
- Upload Document
- Preview or View Document
- Download Document
- Replace Document
- Delete Document

Display the document name and file type clearly.

Validate file types and file sizes.

Do not treat a filename as proof that a document has been securely stored. Use actual file storage when a backend is available.

### Section 6: Property Management Information

Fields:
- Property Manager
- Property Manager Contact
- RWA Registration Status
- Emergency Contact, if available
- Internal Notes

Allow optional fields to remain empty.

### Form Actions

Provide:
- Save Property
- Save as Draft, if supported
- Cancel

Validate required fields before saving.

Show clear success or error feedback after submission.

---

## E. Save, Freeze and Edit Property Records

Once the admin saves a property, it must become a persistent registered record.

The term "freeze" means that the property information should not disappear or reset after saving, refreshing the browser, navigating to another page, or reopening the application.

It does not mean that the property must become permanently read-only.

### Required Behaviour

1. After saving, display the new property in the apartment listing.
2. Generate or assign a unique property ID.
3. Save all entered property details.
4. Preserve uploaded document references and image references.
5. Allow the admin to reopen the property and view saved information.
6. Provide an `Edit Property` action.
7. Allow the admin to update information when new construction occurs or property details change.
8. Allow the admin to add new blocks, floors, flats, images, and construction documents later.
9. Preserve existing information when adding new records.
10. Update relevant property statistics after structural changes.

### Data Persistence

For an initial frontend prototype, use localStorage or another appropriate persistent client-side mechanism.

When a backend becomes available, use a database and file storage for durable records and uploaded files.

Do not rely only on React component state for saved properties.

### Existing Property Changes

If an apartment already has registered blocks, floors, and flats, editing its details must not accidentally delete or reset that structure.

When a block, floor, or flat is added or modified, update only the relevant records.

For important changes, show a confirmation dialog.

Do not automatically overwrite saved records with the original mock data after refreshing the application.

---

## F. Blocks and Towers

Display all blocks belonging to the selected apartment.

Each block card must show:
- Block/tower name
- Total floors
- Total flats
- Occupied flats
- Vacant flats
- Active maintenance requests

Provide:
- Add Block
- Edit Block
- View Block Details

When a block is selected, display its floors and relevant maintenance information.

The admin must be able to add new blocks later if the property expands.

## G. Floors

Display the floors belonging to the selected block.

Each floor should show:
- Floor number or name
- Total flats
- Occupied flats
- Vacant flats
- Active maintenance requests

Allow the admin to:
- Add Floor
- Edit Floor
- Add Flats
- View Flats

The number of floors must be configurable for each block.

## H. Flats and Residents

Display flats in a clean grid.

Each flat card should include:
- Flat number
- Owner or tenant name
- Occupancy status
- Resident type: Owner or Tenant
- Active maintenance requests

For vacant flats, show the flat number and Vacant status.

Clicking a flat should open a details panel containing:
- Apartment
- Block
- Floor
- Flat number
- Resident name
- Owner/Tenant designation
- Occupancy status
- Relevant maintenance requests

Allow authorized admins to add or update flat and occupancy details.

Do not expose unnecessary personal information.

---

## I. Maintenance & Facilities

Maintenance must remain inside Properties and be associated with the relevant apartment, block, floor, flat, or common area.

### Maintenance Categories

Include:
- Gardening and Landscaping
- Fountain Maintenance
- Painting and Waterproofing
- Electrical Repairs
- Plumbing
- Water Pump Maintenance
- Cleaning and Sanitation
- Lift Maintenance
- Generator Maintenance
- Swimming Pool Maintenance
- Gym and Clubhouse Equipment
- Fire Safety
- CCTV and Networking
- Other Facility Issues

Each maintenance record should contain:
- Request title
- Description
- Category
- Property
- Block, floor, flat, or common area
- Date reported
- Priority
- Assigned agency
- Scheduled date and time
- Current status

Statuses:
- Reported
- Pending Assignment
- Assigned
- In Progress
- Completed

Provide search and filters for property, block, category, priority, and status.

Allow the admin to open a request, view its details, and assign a compatible agency.

Maintenance records must remain linked to their actual locations.

---

## J. RWA Management

Keep RWA management inside Properties.

Add a prominent `Manage RWA` button in the selected apartment's hero section.

Clicking it should open a modal or side panel.

Include:
- RWA status
- Association name
- Registration number
- President/Chairperson
- Secretary
- Treasurer
- Contact information
- Committee members
- Registration date

Actions:
- Add RWA Details
- Edit RWA Details
- Add Committee Member
- Update RWA Status

Persist changes so they remain available after refreshing the application.

Do not create a separate top-level RWA page.

---

# 5. Page Three — Agencies

Create a centralized agency and service-partner management module.

**Important:** Use the uploaded `Bee_Zivion_Agent_Onboarding_Fields.docx` as the reference for the agent registration form, company details, service offerings, document uploads, property assignments, and admin approval workflow.

The Agencies page must support both a table view and a card view.

Use the same blue-and-white visual style as the rest of BEE Residence.

## A. Agency Page Header

Display:
- Page title: Agencies
- Short description
- Search agencies input
- Service category filter
- Agency status filter
- `+ Add Agency` button
- View toggle: Table / Cards

The default view should be a clean, professional card layout.

Allow the admin to switch to table view whenever needed.

Remember the selected view where appropriate.

## B. Agency Summary Cards

At the top of the page, display compact KPI cards for:
- Total Registered Agencies
- Active Agencies
- Available Agencies
- Pending Approvals
- Total Allocated Personnel

These should be smaller and more compact than the property summary section in the current screenshot.

Calculate the counts from actual application records.

## C. Agency Card Design

Create professional agency cards that display:

### Agency Header
- Agency logo or company image
- Company name
- Primary service category
- Registration status
- Availability badge

### Agency Information
- Contact person
- Company contact number
- Company email
- Number of employees
- Total allocated personnel
- Available personnel

### Service Information
Display the services offered by the agency using compact category badges.

### Assignment Information
Display:
- Assigned properties count
- Active assignments count
- Pending property assignment requests

### Card Actions
Provide:
- View Details
- Edit Agency
- Manage Assignments

For pending applications, show:
- Review Application
- Approve or Reject, where permitted

Keep the cards compact and avoid excessive text.

Use appropriate status badges:
- Draft
- Submitted
- Under Review
- Changes Requested
- Approved
- Rejected
- Suspended

Agency availability should be shown separately from registration approval status.

An approved agency is not necessarily available for a new assignment.

## D. Agency Table View

Provide a table view containing the same core information.

Columns:
- Agency / Company Name
- Contact Person
- Service Categories
- Total Personnel
- Allocated Personnel
- Available Personnel
- Registered Properties
- Registration Status
- Availability
- Actions

Support:
- Search
- Sorting
- Pagination, if required
- Category filters
- Status filters
- View Details
- Edit Agency

Switching between Cards and Table must not reset the underlying data or lose saved changes.

---

## E. Add Agency — Agent and Company Onboarding

When the admin selects `+ Add Agency`, open a professional multi-section form.

The form should follow the field structure in the uploaded onboarding document.

Use a clear stepper or grouped form sections to avoid overwhelming the user.

### Section 1: Personal Information

Fields:
- Agent / Contact Person First Name — Required
- Agent / Contact Person Last Name — Required
- Profile Photo — Optional
- Designation — Required
- Mobile Number with Country Code — Required
- Alternate Contact Number — Optional
- Email Address — Required
- Preferred Communication Language — Optional
- Agent Type — Required
- Employee / Agent ID — Automatically generated or admin-entered
- Emergency Contact Name — Optional
- Emergency Contact Number — Optional

Agent Type options:
- Company Owner
- Authorized Representative
- Employee
- Field Agent / Technician
- Service Coordinator
- Other

### Section 2: Company Details

Fields:
- Company / Business Name — Required
- Registered Company Name — Optional
- Business Type — Required
- Company Registration Number — Conditional
- GSTIN — Conditional
- PAN — Conditional
- Company Website — Optional
- Year of Establishment — Optional
- Number of Employees — Optional
- Company Email Address — Required
- Company Contact Number — Required
- Company Address Line 1 — Required
- Company Address Line 2 — Optional
- Country — Required
- State — Required
- City — Required
- PIN Code — Required
- Company Description — Optional
- Authorized Signatory Name — Optional
- Authorized Signatory Designation — Optional

Business Type options:
- Sole Proprietorship
- Partnership
- LLP
- Private Limited Company
- Public Limited Company
- Individual / Independent Service Provider
- Other

GSTIN, PAN, and registration details should be required only when applicable.

### Section 3: Contact Details

Fields:
- Primary Contact Name — Required
- Primary Contact Designation — Required
- Primary Contact Mobile — Required
- Primary Contact Email — Required
- Alternate Contact Person — Optional
- Alternate Contact Mobile — Optional
- Accounts / Billing Contact Name — Optional
- Accounts / Billing Email — Optional
- Accounts / Billing Phone — Optional
- Preferred Contact Method — Optional
- Preferred Contact Time — Optional

Preferred Contact Method:
- Phone Call
- WhatsApp
- Email
- BEE App Notification

### Section 4: Services Offered

Allow an agency to register multiple service categories.

Each service should be stored as a separate related record.

Fields:
- Service Category — Required
- Specific Service / Specialization
- Service Description
- Other Service Name, when applicable
- Service Coverage Area
- Years of Experience
- Relevant Certifications
- Service Availability

Use an `+ Add Another Service` button.

Each added service should have Edit and Remove actions.

Supported categories:
- Housekeeping and Cleaning
- Security Services
- Facility Management
- Electrical Maintenance
- Plumbing
- HVAC / Air Conditioning
- Fire Safety and Fire Protection Systems
- Lift / Elevator Maintenance
- DG Set / Generator Maintenance
- STP / WTP / Water Treatment
- Landscaping and Gardening
- Pest Control
- Civil Works and Carpentry
- Painting and Waterproofing
- IT, Networking and CCTV
- Access Control and Intercom
- Waste Management
- Swimming Pool Maintenance
- Gym / Clubhouse Equipment Maintenance
- Appliance Repair
- Moving and Relocation
- Property Leasing / Real Estate Services
- Other

### Section 5: Document Uploads

Allow the admin to upload and manage:
- Company Registration Certificate
- GST Registration Certificate
- PAN Document
- Company / Business Profile PDF
- Authorized Signatory ID / Authorization Letter
- Service Certifications / Licences
- Insurance Certificate
- Previous Work / Experience Portfolio
- Other Supporting Documents

For each document, store:
- Document type
- File reference
- Upload date
- Expiry date, where applicable
- Verification status
- Document remarks

Support multiple file uploads where appropriate.

Provide file preview or download options where supported.

Restrict sensitive documents to authorized users.

### Section 6: Registration Review

Include:
- Registration Reference Number
- Submission Date
- Registration Form Status
- Terms and Privacy Acknowledgement
- Declaration of Information Accuracy

Generate registration reference numbers automatically.

Registration statuses:
- Draft
- Submitted
- Under Review
- Changes Requested
- Approved for Property Assignment
- Rejected

These statuses must reflect the agency registration workflow, not automatically grant property access.

---

## F. Agency Personnel Management

Track the personnel associated with each agency.

Display:
- Total registered personnel
- Allocated personnel
- Available personnel
- Personnel currently on assignment
- Personnel unavailable or on leave

Where individual staff records are supported, include:
- Employee / Agent ID
- Name
- Designation
- Service specialization
- Contact details, where appropriate
- Employment or agent status
- Assigned property
- Assigned shift
- Availability

Allow authorized admins to add, edit, and manage personnel records.

Do not assume that every employee of an agency is automatically allocated to every property.

Distinguish between the total workforce, currently assigned personnel, and personnel available for a requested time slot.

---

## G. Property Assignment Requests

An agency's company registration and property assignment must be treated as separate processes.

An agency may register its company details first and subsequently request access to one or more properties.

### Property Assignment Form

Include:
- Organization / Property Management Company
- Property Name
- Property Code — Automatically populated
- Property Type — Automatically populated
- Property Address — Automatically populated
- State / City — Automatically populated
- Assignment Type
- Assigned Towers / Blocks
- Assigned Floors / Zones
- Assigned Facilities / Areas
- Assignment Start Date
- Assignment End Date
- Services to Be Provided at This Property
- Property-Specific Service Details
- Expected Service Hours
- Property Contact Person
- Property Contact Number
- Property Manager / Sponsor
- Supporting Property Documents
- Reason for Assignment

Assignment Type options:
- Single Property
- Multiple Properties
- Property Portfolio
- Temporary / Project-Based Assignment

Only services registered by the agency may be selected for property assignment requests.

The admin must be able to approve only the relevant services and property areas required for an assignment.

### Multiple Property Assignments

Provide an `+ Add Another Property` action.

Each property assignment must have its own:
- Property
- Blocks or towers
- Floors or zones
- Approved services
- Start and end dates
- Property manager or sponsor
- Supporting documents
- Approval status

Maintain a single agency/company profile with multiple property assignments.

Do not duplicate the agency registration for each property.

---

## H. Admin Approval Workflow

The admin must review registration and property assignment requests.

### Registration Approval

The admin should be able to:
- View submitted company details
- Review service categories
- View uploaded documents
- Verify registration information
- Request changes
- Approve registration for property assignment
- Reject registration

### Property Assignment Approval

For every property assignment request, display:
- Request ID
- Agency / Company
- Requested Properties
- Requested Services
- Requested Towers / Blocks
- Submission Date
- Assigned Reviewer
- Verification Checklist
- Admin Comments
- Approval Decision
- Approved Services
- Approved Towers / Blocks
- Approved Start Date
- Approved End Date
- Rejection / Change Request Reason
- Review Date

Approval decisions:
- Approve
- Approve with Restrictions
- Request Changes
- Reject

Assignment statuses:
- Draft
- Submitted for Approval
- Under Review
- Changes Requested
- Approved
- Approved with Restrictions
- Rejected
- Suspended
- Expired
- Revoked

### Critical Approval Rules

- Submitting an application must not automatically grant property access.
- Company registration approval and property assignment approval must remain separate.
- Only approved property assignments may activate the corresponding property access.
- The admin may approve only selected services, blocks, or areas.
- Expired or revoked assignments must no longer grant access.
- Keep a history of important changes and approval decisions.

---

## I. Agency Details View

Clicking an agency card or table row should open a detailed view or side panel.

Organize the information into sections or tabs:

1. Overview
2. Company Information
3. Services
4. Personnel
5. Documents
6. Property Assignments
7. Approval History

### Overview

Display:
- Company name and logo
- Primary contact
- Service categories
- Registration status
- Total personnel
- Allocated personnel
- Available personnel
- Active assignments

### Services

Display the agency's registered service offerings, specialization, service coverage, and relevant certifications.

### Documents

Display uploaded documents, verification statuses, expiry dates, and available document actions.

### Property Assignments

Display:
- Property name
- Approved blocks and areas
- Approved services
- Start date
- End date
- Assignment status

### Approval History

Display:
- Previous decision
- Reviewer
- Review date
- Admin comments
- Changes requested
- Approval or rejection details

Provide Edit Agency and Manage Assignments actions where appropriate.

---

## J. Maintenance Agency Allocation

Allow admins to assign compatible agencies to maintenance requests.

### Allocation Workflow

1. Select an open maintenance request.
2. View the request's apartment, block, floor, or flat.
3. Identify compatible registered agencies.
4. Verify that the agency has an approved assignment for the relevant property and service.
5. Check personnel availability.
6. Select an agency.
7. Select personnel, where individual allocation is supported.
8. Select a date and time.
9. Confirm the assignment.

After confirmation:
- Update the maintenance request status.
- Update the agency's assignment list.
- Update relevant personnel schedules.
- Display the assigned agency in the property's maintenance record.
- Update dashboard counts.

Do not allow agencies to be allocated to properties or services outside their approved assignment scope.

If no compatible agency is available, display a clear message and allow the admin to select another suitable time slot.

---

## K. Security Agency Allocation

Support security agency allocation for:
- Entire apartment communities
- Individual blocks or towers
- Designated entrances
- Common areas

Display:
- Security agency
- Total required personnel
- Allocated personnel
- Available personnel
- Shift
- Assignment schedule
- Property
- Block or designated area
- Assignment status

Prevent personnel from being assigned to overlapping shifts.

Use clear status indicators to show whether an agency has enough personnel to meet the requirement.

---

# 6. Navigation and Interaction Requirements

### Flow 1: Explore a Property

Dashboard → Properties → Select Apartment → View Hero Image and Summary → Select Block → Select Floor → View Flats.

### Flow 2: Add a Property

Properties → Add Property → Enter Property Details → Upload Images and Documents → Save → View Registered Property → Edit When Required.

### Flow 3: Manage Property Expansion

Properties → Select Apartment → Edit Property → Add Block / Floor / Flat → Save Changes → Updated Structure.

### Flow 4: Manage Maintenance

Properties → Select Apartment → Maintenance & Facilities → Open Request → Check Compatible Agency → Check Availability → Assign → Confirm.

### Flow 5: Manage RWA

Properties → Select Apartment → Manage RWA → View or Edit Association Details.

### Flow 6: Register an Agency

Agencies → Add Agency → Enter Personal and Company Details → Add Services → Upload Documents → Submit for Review.

### Flow 7: Approve an Agency

Agencies → Review Application → Verify Details → Approve, Reject, or Request Changes.

### Flow 8: Approve a Property Assignment

Agencies → Open Assignment Request → Review Property, Services, and Documents → Approve or Restrict Assignment → Activate Only Approved Permissions.

### Flow 9: Allocate Agency Personnel

Agencies → Select Agency → Check Approved Property Assignment → Review Availability → Select Personnel → Schedule → Confirm.

### General Interaction Rules

- Maintain breadcrumb navigation within Properties.
- Keep saved data when switching pages.
- Preserve data when editing existing records.
- Use confirmation dialogs for important changes.
- Show loading, empty, success, and error states.
- Make search and filters functional.
- Do not leave important buttons as nonfunctional placeholders.

---

# 7. Responsive Design

### Desktop
- Fixed sidebar
- Compact top header
- Multi-column property grids
- Compact property statistics integrated into the hero image
- Agency cards and agency table
- Spacious forms with logical field grouping

### Tablet
- Collapsible sidebar
- Adaptive property grids
- Responsive agency cards
- Scrollable tables where appropriate

### Mobile
- Collapsible navigation
- Compact property cards
- Responsive property hero section
- Statistics wrapping into compact rows
- Single-column forms
- Full-width or slide-in details panels
- Card-based agency listing
- Horizontally scrollable agency tables when necessary
- Touch-friendly buttons
- No horizontal page overflow

Do not simply shrink the desktop interface. Maintain readability and usability at every screen size.

---

# 8. Design System

### Color Palette

- Primary Blue: #2563EB
- Dark Navy: #172554
- Light Blue: #EFF6FF
- Page Background: #F8FAFC
- Card Background: #FFFFFF
- Main Text: #0F172A
- Secondary Text: #64748B
- Success: #16A34A
- Warning: #D97706
- Error: #DC2626

Use blue for primary actions, selected navigation, links, and important highlights.

### Typography

Use Inter or a similar professional sans-serif font.

- Page title: 22–26px
- Section title: 16–18px
- Card heading: 14–16px
- Body text: 13–14px
- Supporting labels: 12px

### Component Styling

- Card radius: 10–14px
- Subtle shadows
- Clean input fields
- Consistent button heights
- Clear focus states
- Soft status badges
- Consistent icon sizing
- Minimal borders

### Heading Rules

- Do not add decorative horizontal lines under page headings.
- Use spacing and typography to separate sections.
- Avoid unnecessary borders around every component.
- Keep cards compact and information easy to scan.
- Keep the apartment statistics inside the hero image, not in a separate row of oversized cards beneath it.

---

# 9. Technical Architecture

Use:
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React

Recommended structure:

src/
  components/
    layout/
      Sidebar.tsx
      Header.tsx
      PageContainer.tsx
    common/
      StatCard.tsx
      StatusBadge.tsx
      SearchInput.tsx
      EmptyState.tsx
      ConfirmDialog.tsx
      FileUploader.tsx
    properties/
      ApartmentCard.tsx
      PropertyHero.tsx
      PropertySummary.tsx
      PropertyForm.tsx
      PropertyDocuments.tsx
      BlockCard.tsx
      FloorCard.tsx
      FlatCard.tsx
      PropertyBreadcrumbs.tsx
      MaintenanceList.tsx
      RWAManagement.tsx
    agencies/
      AgencyCard.tsx
      AgencyTable.tsx
      AgencyForm.tsx
      AgencyDetails.tsx
      AgencyServices.tsx
      AgencyDocuments.tsx
      PersonnelManagement.tsx
      PropertyAssignmentForm.tsx
      AssignmentApproval.tsx
      AgencyAllocationModal.tsx
  pages/
    Dashboard.tsx
    Properties.tsx
    Agencies.tsx
  data/
    mockApartments.ts
    mockAgencies.ts
    mockMaintenance.ts
  types/
    property.ts
    agency.ts
    maintenance.ts
  App.tsx
  main.tsx

Adapt this structure to the existing project if necessary.

Use reusable components and maintain clear separation of responsibilities.

---

# 10. Data and Persistence Requirements

Create interconnected records for:
- Apartments
- Property images
- Property documents
- Blocks
- Floors
- Flats
- Residents
- RWA associations
- Maintenance requests
- Agency companies
- Agents and personnel
- Service offerings
- Agency documents
- Property assignment requests
- Assignment approvals
- Personnel schedules
- Maintenance and security allocations
- Approval history

### Data Relationships

- Each block belongs to an apartment.
- Each floor belongs to a block.
- Each flat belongs to a floor.
- Each maintenance request references its actual property location.
- Each agency can have multiple registered services.
- Each agency can request multiple property assignments.
- Each property assignment has its own approval status.
- Each assignment references the agency, property, approved services, and approved areas.
- Each allocation references the relevant agency and, where applicable, individual personnel.

### Persistence Rules

For the frontend prototype:
- Use localStorage or another appropriate persistent client-side mechanism.
- Keep application records separate from UI components.
- Preserve changes after page refresh.
- Support creating, reading, updating, and deleting records where appropriate.
- Avoid overwriting saved records with initial mock data.
- Maintain unique IDs for records.
- Validate forms before saving.
- Keep image and document handling appropriate for the selected storage approach.

For a production application:
- Use a backend and database for persistent records.
- Use appropriate file storage for uploaded images and documents.
- Enforce role-based access control.
- Validate sensitive operations on the server.
- Maintain audit history for important changes.

Do not claim that a frontend-only prototype provides secure document storage or production-grade access control.

---

# 11. Acceptance Criteria

The implementation is complete when:

1. Exactly three primary pages exist: Dashboard, Properties, and Agencies.
2. The blue-and-white theme is consistent across all pages.
3. Apartment cards display images and relevant property information.
4. Apartment details show a translucent image overlay.
5. Property statistics appear inside the hero section, directly below the location information.
6. The oversized property summary cards beneath the hero image are removed.
7. The Add Property button opens a complete registration form.
8. The admin can upload property images, floor plans, route maps, and supporting documents.
9. Saved properties persist after page refresh.
10. Existing properties can be edited without losing their structure.
11. New blocks, floors, and flats can be added later.
12. Property statistics update when the underlying records change.
13. Maintenance requests remain linked to the relevant property locations.
14. RWA details can be managed within Properties.
15. Agencies can be displayed in both card and table views.
16. Agency registration includes personal, company, contact, service, and document information.
17. Agencies can offer multiple service categories.
18. Agency records support multiple property assignment requests.
19. Company registration and property assignment approvals remain separate.
20. Admins can approve assignments with restrictions.
21. Unapproved assignments do not activate property access.
22. Agency personnel and availability are tracked appropriately.
23. Maintenance and security allocations respect approved assignment scope.
24. Search, filters, forms, and important actions work.
25. The interface is responsive and has no unnecessary heading divider lines.
26. No major workflow is left as a static screen or nonfunctional placeholder.

---

# 12. Implementation Instructions for Copilot / Antigravity

First, inspect the existing project and read this entire PRD along with the uploaded `Bee_Zivion_Agent_Onboarding_Fields.docx`.

If the React project already exists, preserve its configuration and dependencies wherever possible.

Implement the application in this order:

1. Set up the global design system and responsive layout.
2. Build the sidebar and top header.
3. Implement the Dashboard using connected application data.
4. Implement Properties and apartment → block → floor → flat navigation.
5. Integrate the property statistics into the apartment hero image.
6. Implement Add Property, Edit Property, image uploads, and document management.
7. Implement persistent property records and property expansion workflows.
8. Implement Maintenance & Facilities and RWA management.
9. Implement Agencies with both card and table views.
10. Implement agency onboarding using the uploaded document's field specifications.
11. Implement service offerings, personnel management, documents, and property assignments.
12. Implement registration review and assignment approval workflows.
13. Connect agency allocation to maintenance and security workflows.
14. Test persistence, navigation, forms, validation, and responsive layouts.
15. Fix TypeScript errors, console errors, broken images, and layout issues.

Do not remove required features from this PRD for the sake of simplifying the implementation.

Do not replace existing functionality with static placeholder screens.

**Final Objective:** Deliver a polished BEE Residence Admin Dashboard with a clean blue UI, image-integrated property summaries, fully manageable property records, professional agency cards and tables, document management, RWA administration, and a structured agency onboarding and approval workflow based on the uploaded specification.