import React, { useState } from 'react';
import {
  Building2,
  Layers,
  Home,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Zap,
  Info,
  ArrowLeft,
  Grid,
  CheckCircle2
} from 'lucide-react';

const PRESET_COLORS = [
  '#F59E0B', // Amber Gold
  '#10B981', // Emerald Green
  '#3B82F6', // Electric Blue
  '#8B5CF6', // Purple / Violet
  '#EC4899', // Pink / Rose
  '#06B6D4', // Cyan
  '#F97316'  // Orange
];

const BHK_OPTIONS = ['1 BHK Executive', '2 BHK Deluxe', '3 BHK Premium', '4 BHK Penthouse'];

export function HierarchyBuilderSubPage({
  onApplyHierarchy,
  onCancel,
  existingApartments = [],
  addToast = () => {}
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Apartments, 2: Blocks, 3: Floors, 4: Flats, 5: Review
  const [deploymentMode, setDeploymentMode] = useState('append'); // 'append' | 'replace'

  // Step 1: Apartments Count & Details
  const [apartmentsCount, setApartmentsCount] = useState(2);
  const [apartments, setApartments] = useState([
    {
      id: 'custom-apt-1',
      name: 'Falcon Crest Towers',
      code: 'FCT',
      tagline: 'Ultra-Modern Glass High-Rise',
      accentColor: '#3B82F6',
      builtYear: 2026,
      blocksCount: 2,
      blocks: [
        { id: 'FCT-A', code: 'Block-A', name: 'Block A (North Tower)', wing: 'North Wing', floorsCount: 4 },
        { id: 'FCT-B', code: 'Block-B', name: 'Block B (South Tower)', wing: 'South Wing', floorsCount: 4 }
      ]
    },
    {
      id: 'custom-apt-2',
      name: 'Silver Oak Residences',
      code: 'SOR',
      tagline: 'Eco-Luxury Botanical Enclave',
      accentColor: '#10B981',
      builtYear: 2025,
      blocksCount: 2,
      blocks: [
        { id: 'SOR-A', code: 'Block-A', name: 'Block A (East Pavilion)', wing: 'East Wing', floorsCount: 4 },
        { id: 'SOR-B', code: 'Block-B', name: 'Block B (West Pavilion)', wing: 'West Wing', floorsCount: 4 }
      ]
    }
  ]);

  // Global settings for flats generation per floor
  const [flatsPerFloor, setFlatsPerFloor] = useState(4);
  const [defaultBhk, setDefaultBhk] = useState('2 BHK Deluxe');
  const [defaultRent, setDefaultRent] = useState(2500);
  const [defaultSqft, setDefaultSqft] = useState(1200);

  // Handler: Change Apartments Count
  const handleApartmentsCountChange = (newCount) => {
    const count = Math.max(1, Math.min(10, parseInt(newCount) || 1));
    setApartmentsCount(count);

    setApartments(prev => {
      const updated = [...prev];
      while (updated.length < count) {
        const idx = updated.length + 1;
        const color = PRESET_COLORS[(idx - 1) % PRESET_COLORS.length];
        const aptCode = `APT${idx}`;
        updated.push({
          id: `custom-apt-${Date.now()}-${idx}`,
          name: `Apartment Complex ${idx}`,
          code: aptCode,
          tagline: 'Designer Master-Planned Living',
          accentColor: color,
          builtYear: 2026,
          blocksCount: 2,
          blocks: [
            { id: `${aptCode}-A`, code: 'Block-A', name: 'Block A (Main Tower)', wing: 'North Wing', floorsCount: 4 },
            { id: `${aptCode}-B`, code: 'Block-B', name: 'Block B (Garden Tower)', wing: 'South Wing', floorsCount: 4 }
          ]
        });
      }
      return updated.slice(0, count);
    });
  };

  // Handler: Update Apartment field
  const handleUpdateApartment = (idx, field, value) => {
    setApartments(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      if (field === 'name' && !copy[idx].manuallyEditedCode) {
        copy[idx].code = value.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4) || `A${idx+1}`;
      }
      return copy;
    });
  };

  // Handler: Update Blocks Count for an Apartment
  const handleBlocksCountChange = (aptIdx, newBlockCount) => {
    const count = Math.max(1, Math.min(10, parseInt(newBlockCount) || 1));
    setApartments(prev => {
      const copy = [...prev];
      const apt = { ...copy[aptIdx] };
      apt.blocksCount = count;
      const currentBlocks = [...(apt.blocks || [])];

      while (currentBlocks.length < count) {
        const bIdx = currentBlocks.length;
        const letter = String.fromCharCode(65 + bIdx); // A, B, C...
        currentBlocks.push({
          id: `${apt.code || 'APT'}-${letter}`,
          code: `Block-${letter}`,
          name: `Block ${letter} (Tower ${bIdx + 1})`,
          wing: bIdx % 2 === 0 ? 'East Wing' : 'West Wing',
          floorsCount: 4
        });
      }

      apt.blocks = currentBlocks.slice(0, count);
      copy[aptIdx] = apt;
      return copy;
    });
  };

  // Handler: Update Block field
  const handleUpdateBlock = (aptIdx, blkIdx, field, value) => {
    setApartments(prev => {
      const copy = [...prev];
      const apt = { ...copy[aptIdx] };
      const blocks = [...apt.blocks];
      blocks[blkIdx] = { ...blocks[blkIdx], [field]: value };
      apt.blocks = blocks;
      copy[aptIdx] = apt;
      return copy;
    });
  };

  // Handler: Update Floors Count for a Block
  const handleFloorsCountChange = (aptIdx, blkIdx, newFloorCount) => {
    const count = Math.max(1, Math.min(50, parseInt(newFloorCount) || 1));
    setApartments(prev => {
      const copy = [...prev];
      const apt = { ...copy[aptIdx] };
      const blocks = [...apt.blocks];
      blocks[blkIdx] = { ...blocks[blkIdx], floorsCount: count };
      apt.blocks = blocks;
      copy[aptIdx] = apt;
      return copy;
    });
  };

  // Quick fill all blocks with same floors
  const handleQuickFillFloors = (aptIdx, count) => {
    setApartments(prev => {
      const copy = [...prev];
      const apt = { ...copy[aptIdx] };
      apt.blocks = apt.blocks.map(b => ({ ...b, floorsCount: count }));
      copy[aptIdx] = apt;
      return copy;
    });
    addToast('Floors Configured', `All blocks in ${apartments[aptIdx].name} set to ${count} floors`, 'info');
  };

  // Calculate totals
  const totalApartments = apartments.length;
  const totalBlocks = apartments.reduce((sum, apt) => sum + (apt.blocks?.length || 0), 0);
  const totalFloors = apartments.reduce((sum, apt) => sum + (apt.blocks?.reduce((bSum, b) => bSum + (b.floorsCount || 0), 0) || 0), 0);
  const totalFlats = totalFloors * flatsPerFloor;

  // Final Deploy Generation
  const handleDeployHierarchy = () => {
    const generatedApartments = apartments.map((apt, aIdx) => {
      const formattedBlocks = apt.blocks.map((blk, bIdx) => ({
        id: blk.id || `${apt.code}-${String.fromCharCode(65 + bIdx)}`,
        code: blk.code || `Block-${String.fromCharCode(65 + bIdx)}`,
        name: blk.name || `Block ${String.fromCharCode(65 + bIdx)}`,
        wing: blk.wing || 'Central Wing',
        elevators: 2,
        powerBackup: '100% DG Backed',
        security: 'Biometric FaceID + RFID',
        floorsCount: blk.floorsCount || 4
      }));

      return {
        id: apt.id,
        code: apt.code || `APT${aIdx + 1}`,
        name: apt.name,
        tagline: apt.tagline || 'Designer Luxury Living',
        image: aIdx % 3 === 0 ? '/Images/honeycomb-towers.jpg' : aIdx % 3 === 1 ? '/Images/amber-grove.jpg' : '/Images/nectar-bay.jpg',
        rating: 4.9,
        builtYear: apt.builtYear || 2026,
        accentColor: apt.accentColor || '#3B82F6',
        badgeColor: `${apt.accentColor || '#3B82F6'}26`,
        architecturalStyle: 'Contemporary Biophilic Geometric Towers',
        address: `${100 + aIdx * 50} Bee Central Promenade`,
        description: `Custom configured residential property featuring ${apt.blocks.length} architectural blocks, multi-level elevations, and modern smart IoT access.`,
        features: ['Smart Access Hub', 'Automated Energy Metering', 'Resident Skybridge', 'EV Charging Slots'],
        blocks: formattedBlocks
      };
    });

    const generatedFlats = [];
    generatedApartments.forEach((apt) => {
      apt.blocks.forEach((blk) => {
        const floorCount = blk.floorsCount || 4;
        for (let fl = 1; fl <= floorCount; fl++) {
          for (let flt = 1; flt <= flatsPerFloor; flt++) {
            const flatNum = `${fl}${flt < 10 ? '0' + flt : flt}`;
            const flatId = `${blk.id}-${flatNum}`;
            const isOcc = (fl + flt) % 3 !== 0;

            generatedFlats.push({
              id: flatId,
              flatNumber: flatNum,
              apartmentId: apt.id,
              blockId: blk.id,
              blockName: blk.code,
              floor: fl,
              bhk: flt === flatsPerFloor && fl === floorCount ? '4 BHK Penthouse' : flt % 2 === 0 ? '3 BHK Premium' : defaultBhk,
              bedrooms: flt === flatsPerFloor && fl === floorCount ? 4 : flt % 2 === 0 ? 3 : 2,
              bathrooms: flt === flatsPerFloor && fl === floorCount ? 4 : 2,
              sqft: flt === flatsPerFloor && fl === floorCount ? defaultSqft + 800 : defaultSqft,
              rent: flt === flatsPerFloor && fl === floorCount ? defaultRent + 1200 : defaultRent,
              facing: flt % 2 === 0 ? 'East (Courtyard Facing)' : 'West (Garden Sunset Facing)',
              status: isOcc ? 'Occupied' : 'Vacant',
              smartLockStatus: 'Locked',
              inspectionScore: 98,
              tenant: isOcc ? {
                name: `Resident ${flatNum}`,
                email: `occupant.${flatNum}@beeportal.com`,
                phone: `+1 (555) 012-${flatNum}`,
                avatar: `https://images.unsplash.com/photo-${1534528741775 + (fl * 10 + flt)}?w=150&auto=format&fit=crop&q=80`,
                leaseStart: '2026-01-01',
                leaseEnd: '2027-12-31',
                paymentStatus: 'Paid',
                occupants: 2
              } : null,
              statusNote: isOcc ? 'Active Lease' : 'Ready for Immediate Move-in'
            });
          }
        }
      });
    });

    onApplyHierarchy({
      apartments: generatedApartments,
      flats: generatedFlats,
      mode: deploymentMode
    });

    addToast(
      'Hierarchy Successfully Deployed!',
      `Created ${totalApartments} Apartments, ${totalBlocks} Blocks, ${totalFloors} Floors, and ${totalFlats} Flats.`,
      'success'
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* 1. Header with Breadcrumb & Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            onClick={onCancel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#8FA3CB',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '0.65rem',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8FA3CB'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            <ArrowLeft size={14} /> Back to Properties Portfolio
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                background: 'rgba(37, 99, 235, 0.2)',
                border: '1px solid rgba(37, 99, 235, 0.4)',
                color: '#60A5FA',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}
            >
              STRUCTURE BUILDER
            </span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>Sequential Architectural Hierarchy Setup</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '0.35rem 0 0 0', fontFamily: "'Outfit', sans-serif" }}>
            Manual Property Hierarchy Builder
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#8FA3CB', fontSize: '13.5px' }}>
            Manually enter Apartments count & names ➔ Blocks in each Apartment ➔ Floors in each Block ➔ Flats per Floor.
          </p>
        </div>

        {/* Quick Deploy / Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#CBD5E1',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Discard
          </button>
          <button
            onClick={handleDeployHierarchy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.6rem 1.4rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Sparkles size={16} /> Deploy Hierarchy
          </button>
        </div>
      </div>

      {/* 2. Interactive Stepper Navigation Bar */}
      <div
        style={{
          background: '#091536',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflowX: 'auto',
          gap: '0.5rem'
        }}
      >
        {[
          { step: 1, label: '1. Apartments (Count & Names)' },
          { step: 2, label: '2. Blocks in Apartment' },
          { step: 3, label: '3. Floors per Block' },
          { step: 4, label: '4. Flats Configuration' },
          { step: 5, label: '5. Review & Deploy' }
        ].map(s => {
          const isActive = currentStep === s.step;
          const isCompleted = currentStep > s.step;
          return (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '0.5rem 0.95rem',
                borderRadius: '8px',
                background: isActive ? '#1D4ED8' : 'transparent',
                border: 'none',
                color: isActive ? '#FFFFFF' : isCompleted ? '#34D399' : '#8FA3CB',
                fontSize: '12.5px',
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isActive ? '#FFFFFF' : isCompleted ? '#10B981' : 'rgba(255,255,255,0.1)',
                  color: isActive ? '#1D4ED8' : '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isCompleted ? <Check size={12} strokeWidth={3} /> : s.step}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Two-Column Layout: Left (Inputs Form) vs Right (Live Hierarchy Visual Blueprint) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: ACTIVE STEP FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* STEP 1: APARTMENTS */}
          {currentStep === 1 && (
            <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '17px', fontWeight: 800 }}>
                  Step 1: Enter Apartments Count & Names
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', color: '#8FA3CB', fontSize: '12.5px' }}>
                  Define how many apartment complexes to create, and give each apartment its unique name and brand.
                </p>
              </div>

              {/* Apartments Count Input */}
              <div style={{ background: '#060E24', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#FFFFFF', fontWeight: 700, fontSize: '13.5px' }}>
                    Total Apartments Count
                  </label>
                  <div style={{ color: '#8FA3CB', fontSize: '11.5px', marginTop: '2px' }}>
                    How many separate apartment residential towers or complexes?
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={apartmentsCount}
                    onChange={(e) => handleApartmentsCountChange(e.target.value)}
                    style={{
                      width: '75px',
                      background: '#091536',
                      border: '2px solid #2563EB',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: 800,
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                  <span style={{ color: '#8FA3CB', fontSize: '13px', fontWeight: 600 }}>Apartments</span>
                </div>
              </div>

              {/* List of Apartment Name Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: '#8FA3CB', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.5px' }}>
                  SPECIFY DETAILS FOR EACH APARTMENT:
                </div>

                {apartments.map((apt, idx) => (
                  <div
                    key={apt.id || idx}
                    style={{
                      background: '#060E24',
                      border: `1px solid ${apt.accentColor}55`,
                      borderRadius: '10px',
                      padding: '1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            background: apt.accentColor,
                            color: '#FFFFFF',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '13px'
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14.5px' }}>
                          Apartment #{idx + 1}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#768EB8', marginRight: '4px' }}>Color:</span>
                        {PRESET_COLORS.map(c => (
                          <div
                            key={c}
                            onClick={() => handleUpdateApartment(idx, 'accentColor', c)}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: c,
                              cursor: 'pointer',
                              border: apt.accentColor === c ? '2px solid #FFFFFF' : 'none'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem' }}>
                      <div>
                        <label style={{ display: 'block', color: '#8FA3CB', fontSize: '11.5px', marginBottom: '3px' }}>
                          Apartment Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Lotus Heights, Honeycomb Towers..."
                          value={apt.name}
                          onChange={(e) => handleUpdateApartment(idx, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            background: '#091536',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '8px',
                            padding: '0.55rem 0.75rem',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8FA3CB', fontSize: '11.5px', marginBottom: '3px' }}>
                          Short Code
                        </label>
                        <input
                          type="text"
                          value={apt.code}
                          onChange={(e) => {
                            handleUpdateApartment(idx, 'manuallyEditedCode', true);
                            handleUpdateApartment(idx, 'code', e.target.value.toUpperCase());
                          }}
                          style={{
                            width: '100%',
                            background: '#091536',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '8px',
                            padding: '0.55rem 0.75rem',
                            color: '#60A5FA',
                            fontWeight: 700,
                            fontSize: '13px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#8FA3CB', fontSize: '11.5px', marginBottom: '3px' }}>
                        Architectural Tagline / Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ultra-Luxury Sky Residences & Courtyards..."
                        value={apt.tagline}
                        onChange={(e) => handleUpdateApartment(idx, 'tagline', e.target.value)}
                        style={{
                          width: '100%',
                          background: '#091536',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          padding: '0.5rem 0.75rem',
                          color: '#CBD5E1',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.65rem 1.4rem',
                    borderRadius: '8px',
                    background: '#2563EB',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Next: Configure Blocks in Apartment <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BLOCKS */}
          {currentStep === 2 && (
            <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '17px', fontWeight: 800 }}>
                  Step 2: Enter Blocks for each Apartment
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', color: '#8FA3CB', fontSize: '12.5px' }}>
                  Specially configure how many blocks (towers/wings) each apartment complex has.
                </p>
              </div>

              {apartments.map((apt, aIdx) => (
                <div
                  key={apt.id || aIdx}
                  style={{
                    background: '#060E24',
                    border: `1px solid ${apt.accentColor}44`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Building2 size={18} color={apt.accentColor} />
                      <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '15px' }}>
                        {apt.name} ({apt.code})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <label style={{ color: '#8FA3CB', fontSize: '12px', fontWeight: 600 }}>Number of Blocks:</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={apt.blocksCount || apt.blocks.length}
                        onChange={(e) => handleBlocksCountChange(aIdx, e.target.value)}
                        style={{
                          width: '65px',
                          background: '#091536',
                          border: '2px solid #2563EB',
                          borderRadius: '6px',
                          padding: '0.4rem',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          textAlign: 'center',
                          outline: 'none',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '0.75rem' }}>
                    {apt.blocks.map((blk, bIdx) => (
                      <div
                        key={blk.id || bIdx}
                        style={{
                          background: '#091536',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          padding: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#60A5FA', fontWeight: 700, fontSize: '12px' }}>
                            {blk.code || `Block-${String.fromCharCode(65 + bIdx)}`}
                          </span>
                          <span style={{ color: '#64748B', fontSize: '11px' }}>Tower {bIdx + 1}</span>
                        </div>

                        <div>
                          <label style={{ display: 'block', color: '#8FA3CB', fontSize: '10.5px', marginBottom: '2px' }}>
                            Block Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Block A (Royal Hive)"
                            value={blk.name}
                            onChange={(e) => handleUpdateBlock(aIdx, bIdx, 'name', e.target.value)}
                            style={{
                              width: '100%',
                              background: '#060E24',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '6px',
                              padding: '0.45rem 0.65rem',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', color: '#8FA3CB', fontSize: '10.5px', marginBottom: '2px' }}>
                            Wing / Direction
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. North Wing, East Wing..."
                            value={blk.wing}
                            onChange={(e) => handleUpdateBlock(aIdx, bIdx, 'wing', e.target.value)}
                            style={{
                              width: '100%',
                              background: '#060E24',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              borderRadius: '6px',
                              padding: '0.4rem 0.65rem',
                              color: '#8FA3CB',
                              fontSize: '11px',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#CBD5E1',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={16} /> Back to Apartments
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.65rem 1.4rem',
                    borderRadius: '8px',
                    background: '#2563EB',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Next: Enter Floors for each Block <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FLOORS */}
          {currentStep === 3 && (
            <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '17px', fontWeight: 800 }}>
                  Step 3: Enter Floors for each Block
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', color: '#8FA3CB', fontSize: '12.5px' }}>
                  Define the vertical elevation and number of floors for each block/tower.
                </p>
              </div>

              {apartments.map((apt, aIdx) => (
                <div
                  key={apt.id || aIdx}
                  style={{
                    background: '#060E24',
                    border: `1px solid ${apt.accentColor}44`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ color: apt.accentColor, fontWeight: 800, fontSize: '15px' }}>
                      {apt.name} ({apt.code})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '11px', color: '#768EB8' }}>Quick Fill:</span>
                      {[3, 4, 5, 8, 12].map(fl => (
                        <button
                          key={fl}
                          type="button"
                          onClick={() => handleQuickFillFloors(aIdx, fl)}
                          style={{
                            background: '#091536',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            padding: '0.25rem 0.55rem',
                            color: '#8FA3CB',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {fl} Flrs
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {apt.blocks.map((blk, bIdx) => (
                      <div
                        key={blk.id || bIdx}
                        style={{
                          background: '#091536',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '8px',
                          padding: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '13px' }}>{blk.name}</div>
                          <div style={{ color: '#64748B', fontSize: '11px' }}>{blk.wing}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={blk.floorsCount}
                            onChange={(e) => handleFloorsCountChange(aIdx, bIdx, e.target.value)}
                            style={{
                              width: '55px',
                              background: '#060E24',
                              border: '1px solid #2563EB',
                              borderRadius: '6px',
                              padding: '0.35rem',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              textAlign: 'center',
                              outline: 'none',
                              fontSize: '14px'
                            }}
                          />
                          <span style={{ color: '#8FA3CB', fontSize: '11.5px' }}>Floors</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#CBD5E1',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={16} /> Back to Blocks
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.65rem 1.4rem',
                    borderRadius: '8px',
                    background: '#2563EB',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Next: Configure Flats <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: FLATS */}
          {currentStep === 4 && (
            <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '17px', fontWeight: 800 }}>
                  Step 4: Enter Flats for each Floor
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', color: '#8FA3CB', fontSize: '12.5px' }}>
                  Define how many flats per floor, layout types, and base rent rates.
                </p>
              </div>

              <div style={{ background: '#060E24', padding: '1.25rem', borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Flats Per Floor Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={flatsPerFloor}
                    onChange={(e) => setFlatsPerFloor(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: '100%',
                      background: '#091536',
                      border: '2px solid #2563EB',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: 800,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ color: '#64748B', fontSize: '11px', marginTop: '3px' }}>
                    Auto-numbers 101, 102, 103, 104 on Floor 1, etc.
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Default Layout
                  </label>
                  <select
                    value={defaultBhk}
                    onChange={(e) => setDefaultBhk(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#091536',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    {BHK_OPTIONS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Base Monthly Rent ($)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={defaultRent}
                    onChange={(e) => setDefaultRent(parseInt(e.target.value) || 2000)}
                    style={{
                      width: '100%',
                      background: '#091536',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#34D399',
                      fontSize: '15px',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Carpet Area (sq.ft)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={defaultSqft}
                    onChange={(e) => setDefaultSqft(parseInt(e.target.value) || 1000)}
                    style={{
                      width: '100%',
                      background: '#091536',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#60A5FA',
                      fontSize: '15px',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Sample flat layout pill previews */}
              <div style={{ background: '#060E24', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ color: '#8FA3CB', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                  SAMPLE NUMBERING SEQUENCE:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Array.from({ length: Math.min(10, flatsPerFloor) }).map((_, fIdx) => (
                    <span
                      key={fIdx}
                      style={{
                        background: 'rgba(37, 99, 235, 0.15)',
                        border: '1px solid rgba(37, 99, 235, 0.3)',
                        color: '#60A5FA',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      Flat 10{fIdx + 1}
                    </span>
                  ))}
                  {flatsPerFloor > 10 && <span style={{ color: '#64748B', fontSize: '12px' }}>+{flatsPerFloor - 10} more</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#CBD5E1',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={16} /> Back to Floors
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.65rem 1.4rem',
                    borderRadius: '8px',
                    background: '#2563EB',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Review Final Blueprint <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & DEPLOY */}
          {currentStep === 5 && (
            <div style={{ background: '#091536', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '17px', fontWeight: 800 }}>
                  Step 5: Review & Deploy Property Hierarchy
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', color: '#8FA3CB', fontSize: '12.5px' }}>
                  Verify configuration totals and deployment target before applying to active property portfolio.
                </p>
              </div>

              {/* Total KPI summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                <div style={{ background: '#060E24', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ color: '#8FA3CB', fontSize: '11px', fontWeight: 600 }}>APARTMENTS</div>
                  <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 800, marginTop: '2px', fontFamily: "'Outfit', sans-serif" }}>{totalApartments}</div>
                </div>
                <div style={{ background: '#060E24', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ color: '#8FA3CB', fontSize: '11px', fontWeight: 600 }}>BLOCKS</div>
                  <div style={{ color: '#60A5FA', fontSize: '24px', fontWeight: 800, marginTop: '2px', fontFamily: "'Outfit', sans-serif" }}>{totalBlocks}</div>
                </div>
                <div style={{ background: '#060E24', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ color: '#8FA3CB', fontSize: '11px', fontWeight: 600 }}>FLOORS</div>
                  <div style={{ color: '#FBBF24', fontSize: '24px', fontWeight: 800, marginTop: '2px', fontFamily: "'Outfit', sans-serif" }}>{totalFloors}</div>
                </div>
                <div style={{ background: '#060E24', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ color: '#8FA3CB', fontSize: '11px', fontWeight: 600 }}>TOTAL FLATS</div>
                  <div style={{ color: '#34D399', fontSize: '24px', fontWeight: 800, marginTop: '2px', fontFamily: "'Outfit', sans-serif" }}>{totalFlats}</div>
                </div>
              </div>

              {/* Deployment Mode */}
              <div style={{ background: '#060E24', padding: '1.25rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}>Deployment Mode</div>
                  <div style={{ color: '#8FA3CB', fontSize: '12px', marginTop: '2px' }}>
                    Choose whether to append to existing community portfolio or replace as primary
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setDeploymentMode('append')}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: deploymentMode === 'append' ? '#1D4ED8' : '#0B1633',
                      color: deploymentMode === 'append' ? '#FFFFFF' : '#8FA3CB',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Add to Existing Portfolio
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeploymentMode('replace')}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: deploymentMode === 'replace' ? '#DC2626' : '#0B1633',
                      color: deploymentMode === 'replace' ? '#FFFFFF' : '#8FA3CB',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Set as Primary (Replace)
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#CBD5E1',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronLeft size={16} /> Back to Flats
                </button>
                <button
                  type="button"
                  onClick={handleDeployHierarchy}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.75rem 1.75rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  <Sparkles size={18} /> Deploy & Apply Hierarchy
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: LIVE ARCHITECTURAL TREE BLUEPRINT PREVIEW */}
        <div
          style={{
            background: '#091536',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            position: 'sticky',
            top: '80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60A5FA', fontWeight: 700, fontSize: '13.5px' }}>
              <Layers size={16} /> Live Hierarchy Blueprint
            </div>
            <span style={{ fontSize: '11px', color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
              Real-Time
            </span>
          </div>

          <div style={{ fontSize: '12px', color: '#8FA3CB' }}>
            Structural outline updating as you type:
          </div>

          <div style={{ maxHeight: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {apartments.map((apt, aIdx) => (
              <div
                key={apt.id || aIdx}
                style={{
                  background: '#060E24',
                  border: `1px solid ${apt.accentColor}33`,
                  borderRadius: '8px',
                  padding: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: apt.accentColor, fontWeight: 800, fontSize: '13.5px' }}>
                  <Building2 size={16} /> {apt.name || `Apartment ${aIdx + 1}`} ({apt.code})
                </div>

                <div style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {apt.blocks.map((blk, bIdx) => (
                    <div key={blk.id || bIdx} style={{ fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFFFFF', fontWeight: 600 }}>
                        <span style={{ color: '#64748B' }}>├──</span>
                        <Layers size={13} color="#60A5FA" />
                        <span>{blk.name}</span>
                        <span style={{ color: '#8FA3CB', fontSize: '11px' }}>({blk.wing})</span>
                      </div>

                      <div style={{ paddingLeft: '1.5rem', marginTop: '0.25rem', color: '#94A3B8', fontSize: '11.5px' }}>
                        <div>• {blk.floorsCount} Floors (Floors 1 to {blk.floorsCount})</div>
                        <div style={{ color: '#34D399' }}>
                          • {blk.floorsCount * flatsPerFloor} Flats ({flatsPerFloor}/floor)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Metrics Bar at Bottom */}
          <div style={{ background: '#060E24', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', textAlign: 'center', fontSize: '12px' }}>
            <div>
              <div style={{ color: '#768EB8', fontSize: '10.5px' }}>TOTAL BLOCKS</div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{totalBlocks} Blocks</div>
            </div>
            <div>
              <div style={{ color: '#768EB8', fontSize: '10.5px' }}>TOTAL CAPACITY</div>
              <div style={{ color: '#34D399', fontWeight: 700, marginTop: '2px' }}>{totalFlats} Flats</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HierarchyBuilderSubPage;
