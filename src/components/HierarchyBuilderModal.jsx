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
  X,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Zap,
  Info
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

export function HierarchyBuilderModal({
  isOpen,
  onClose,
  onApplyHierarchy,
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

  if (!isOpen) return null;

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
    // 1. Generate full formatted apartments array
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

    // 2. Generate all flats for all floors across all blocks
    const generatedFlats = [];
    generatedApartments.forEach((apt) => {
      apt.blocks.forEach((blk) => {
        const floorCount = blk.floorsCount || 4;
        for (let fl = 1; fl <= floorCount; fl++) {
          for (let flt = 1; flt <= flatsPerFloor; flt++) {
            const flatNum = `${fl}${flt < 10 ? '0' + flt : flt}`;
            const flatId = `${blk.id}-${flatNum}`;
            const isOcc = (fl + flt) % 3 !== 0; // Realistic sample mix

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

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#091536',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(37, 99, 235, 0.2)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#060E24'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(37, 99, 235, 0.2)',
                border: '1px solid rgba(37, 99, 235, 0.4)',
                color: '#60A5FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Outfit', sans-serif" }}>
                Property Hierarchy Builder
              </h2>
              <div style={{ color: '#8FA3CB', fontSize: '12px', marginTop: '2px' }}>
                Step-by-step configuration: Apartments ➔ Blocks ➔ Floors ➔ Flats
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#8FA3CB', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper Progress Navigation */}
        <div
          style={{
            padding: '0.85rem 1.75rem',
            background: 'rgba(11, 22, 51, 0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflowX: 'auto',
            gap: '0.5rem'
          }}
        >
          {[
            { step: 1, label: '1. Apartments Count & Names' },
            { step: 2, label: '2. Blocks in Apartment' },
            { step: 3, label: '3. Floors per Block' },
            { step: 4, label: '4. Flats Configuration' },
            { step: 5, label: '5. Review & Deploy' }
          ].map(s => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <div
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  background: isActive ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                  border: isActive ? '1px solid rgba(37, 99, 235, 0.5)' : '1px solid transparent',
                  color: isActive ? '#FFFFFF' : isCompleted ? '#34D399' : '#7088B6',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap'
                }}
              >
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: isActive ? '#2563EB' : isCompleted ? '#10B981' : 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isCompleted ? <Check size={11} /> : s.step}
                </span>
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* STEP 1: APARTMENTS COUNT & NAMES */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#060E24', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#FFFFFF', fontWeight: 700, fontSize: '13.5px' }}>
                      How many Apartments do you want to enter?
                    </label>
                    <div style={{ color: '#8FA3CB', fontSize: '11.5px', marginTop: '2px' }}>
                      Enter total apartment complexes to configure in your community
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
                        fontSize: '16px',
                        fontWeight: 800,
                        textAlign: 'center',
                        outline: 'none'
                      }}
                    />
                    <span style={{ color: '#8FA3CB', fontSize: '12.5px' }}>Apartments</span>
                  </div>
                </div>
              </div>

              {/* Apartment Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: '#8FA3CB', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
                  ENTER APARTMENT NAMES & CODES:
                </div>

                {apartments.map((apt, idx) => (
                  <div
                    key={apt.id || idx}
                    style={{
                      background: '#0B1633',
                      border: `1px solid ${apt.accentColor}44`,
                      borderRadius: '12px',
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
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '12px'
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}>
                          Apartment #{idx + 1}
                        </span>
                      </div>

                      {/* Color Accent Picker */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                        <label style={{ display: 'block', color: '#8FA3CB', fontSize: '11px', marginBottom: '3px' }}>
                          Apartment Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Honeycomb Towers, Emerald Heights..."
                          value={apt.name}
                          onChange={(e) => handleUpdateApartment(idx, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            background: '#060E24',
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
                        <label style={{ display: 'block', color: '#8FA3CB', fontSize: '11px', marginBottom: '3px' }}>
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
                            background: '#060E24',
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: BLOCKS IN APARTMENTS */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ color: '#8FA3CB', fontSize: '12.5px' }}>
                Specially configure the <strong>Blocks</strong> for each entered apartment:
              </div>

              {apartments.map((apt, aIdx) => (
                <div
                  key={apt.id || aIdx}
                  style={{
                    background: '#0B1633',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ color: apt.accentColor, fontWeight: 700, fontSize: '14.5px' }}>
                        {apt.name} ({apt.code})
                      </div>
                      <div style={{ color: '#8FA3CB', fontSize: '11.5px' }}>
                        Configure blocks/towers for this complex
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <label style={{ color: '#8FA3CB', fontSize: '12px' }}>Number of Blocks:</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={apt.blocksCount || apt.blocks.length}
                        onChange={(e) => handleBlocksCountChange(aIdx, e.target.value)}
                        style={{
                          width: '65px',
                          background: '#060E24',
                          border: '1px solid #2563EB',
                          borderRadius: '6px',
                          padding: '0.4rem',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          textAlign: 'center',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Individual Block inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {apt.blocks.map((blk, bIdx) => (
                      <div
                        key={blk.id || bIdx}
                        style={{
                          background: '#060E24',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem'
                        }}
                      >
                        <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '12px' }}>
                          Block {String.fromCharCode(65 + bIdx)}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Block A (Royal Hive)"
                          value={blk.name}
                          onChange={(e) => handleUpdateBlock(aIdx, bIdx, 'name', e.target.value)}
                          style={{
                            background: '#091536',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '0.45rem 0.65rem',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Wing: North Wing, East Wing..."
                          value={blk.wing}
                          onChange={(e) => handleUpdateBlock(aIdx, bIdx, 'wing', e.target.value)}
                          style={{
                            background: '#091536',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '6px',
                            padding: '0.4rem 0.65rem',
                            color: '#8FA3CB',
                            fontSize: '11px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: FLOORS PER BLOCK */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ color: '#8FA3CB', fontSize: '12.5px' }}>
                Next, enter the number of <strong>Floors</strong> for each block:
              </div>

              {apartments.map((apt, aIdx) => (
                <div
                  key={apt.id || aIdx}
                  style={{
                    background: '#0B1633',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ color: apt.accentColor, fontWeight: 700, fontSize: '14.5px' }}>
                      {apt.name}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {[3, 4, 5, 8, 10].map(fl => (
                        <button
                          key={fl}
                          onClick={() => handleQuickFillFloors(aIdx, fl)}
                          style={{
                            background: '#060E24',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            color: '#8FA3CB',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          All {fl} Flrs
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {apt.blocks.map((blk, bIdx) => (
                      <div
                        key={blk.id || bIdx}
                        style={{
                          background: '#060E24',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '12.5px' }}>{blk.name}</div>
                          <div style={{ color: '#64748B', fontSize: '11px' }}>{blk.wing}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={blk.floorsCount}
                            onChange={(e) => handleFloorsCountChange(aIdx, bIdx, e.target.value)}
                            style={{
                              width: '55px',
                              background: '#091536',
                              border: '1px solid #2563EB',
                              borderRadius: '6px',
                              padding: '0.35rem',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              textAlign: 'center',
                              outline: 'none',
                              fontSize: '13px'
                            }}
                          />
                          <span style={{ color: '#8FA3CB', fontSize: '11px' }}>Floors</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: FLATS CONFIGURATION */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ color: '#8FA3CB', fontSize: '12.5px' }}>
                Next, configure the <strong>Flats</strong> generation for each floor:
              </div>

              <div style={{ background: '#0B1633', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', marginBottom: '4px' }}>
                      Flats Per Floor
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={flatsPerFloor}
                      onChange={(e) => setFlatsPerFloor(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{
                        width: '100%',
                        background: '#060E24',
                        border: '1px solid #2563EB',
                        borderRadius: '8px',
                        padding: '0.6rem 0.85rem',
                        color: '#FFFFFF',
                        fontSize: '15px',
                        fontWeight: 700,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ color: '#64748B', fontSize: '11px', marginTop: '3px' }}>
                      Generates 101, 102, 103, 104 on Floor 1, etc.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', marginBottom: '4px' }}>
                      Default Unit Layout
                    </label>
                    <select
                      value={defaultBhk}
                      onChange={(e) => setDefaultBhk(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#060E24',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.85rem',
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
                    <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', marginBottom: '4px' }}>
                      Base Monthly Rent ($)
                    </label>
                    <input
                      type="number"
                      step="50"
                      value={defaultRent}
                      onChange={(e) => setDefaultRent(parseInt(e.target.value) || 2000)}
                      style={{
                        width: '100%',
                        background: '#060E24',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.85rem',
                        color: '#34D399',
                        fontSize: '14px',
                        fontWeight: 700,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#8FA3CB', fontSize: '12px', marginBottom: '4px' }}>
                      Average Sq.Ft Area
                    </label>
                    <input
                      type="number"
                      step="50"
                      value={defaultSqft}
                      onChange={(e) => setDefaultSqft(parseInt(e.target.value) || 1000)}
                      style={{
                        width: '100%',
                        background: '#060E24',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.85rem',
                        color: '#60A5FA',
                        fontSize: '14px',
                        fontWeight: 700,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Example Numbering Preview */}
                <div style={{ background: '#060E24', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ color: '#8FA3CB', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                    SAMPLE NUMBERING PATTERN:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {Array.from({ length: Math.min(8, flatsPerFloor) }).map((_, fIdx) => (
                      <span
                        key={fIdx}
                        style={{
                          background: 'rgba(37, 99, 235, 0.15)',
                          border: '1px solid rgba(37, 99, 235, 0.3)',
                          color: '#60A5FA',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700
                        }}
                      >
                        Flat 10{fIdx + 1}
                      </span>
                    ))}
                    {flatsPerFloor > 8 && <span style={{ color: '#64748B', fontSize: '12px' }}>+{flatsPerFloor - 8} more</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & DEPLOY */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#060E24', padding: '1.15rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '16px', fontWeight: 800 }}>
                      Generated Hierarchy Summary
                    </h3>
                    <div style={{ color: '#8FA3CB', fontSize: '12px', marginTop: '2px' }}>
                      Verify all apartments, blocks, floors, and flats before deploying.
                    </div>
                  </div>

                  {/* Summary Metric Pills */}
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <div style={{ background: '#091536', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#8FA3CB' }}>APARTMENTS</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>{totalApartments}</div>
                    </div>
                    <div style={{ background: '#091536', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#8FA3CB' }}>BLOCKS</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#60A5FA' }}>{totalBlocks}</div>
                    </div>
                    <div style={{ background: '#091536', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#8FA3CB' }}>FLOORS</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#FBBF24' }}>{totalFloors}</div>
                    </div>
                    <div style={{ background: '#091536', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#8FA3CB' }}>TOTAL FLATS</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#34D399' }}>{totalFlats}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tree View of Hierarchy */}
              <div style={{ background: '#0B1633', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem', maxHeight: '220px', overflowY: 'auto' }}>
                {apartments.map((apt, aIdx) => (
                  <div key={apt.id || aIdx} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: apt.accentColor, fontWeight: 700, fontSize: '13.5px' }}>
                      <Building2 size={15} /> {apt.name} ({apt.code}) • {apt.blocks.length} Blocks
                    </div>
                    <div style={{ paddingLeft: '1.5rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {apt.blocks.map((blk, bIdx) => (
                        <div key={blk.id || bIdx} style={{ fontSize: '12px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#64748B' }}>├──</span>
                          <Layers size={13} color="#60A5FA" />
                          <strong style={{ color: '#FFFFFF' }}>{blk.name}</strong>
                          <span style={{ color: '#8FA3CB' }}>({blk.floorsCount} Floors • {blk.floorsCount * flatsPerFloor} Flats)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Deployment Action Mode */}
              <div style={{ background: '#060E24', padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
                <div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px' }}>Deployment Mode</div>
                  <div style={{ color: '#8FA3CB', fontSize: '11.5px' }}>Choose how to integrate into current community</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setDeploymentMode('append')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: deploymentMode === 'append' ? '#1D4ED8' : '#0B1633',
                      color: deploymentMode === 'append' ? '#FFFFFF' : '#8FA3CB',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Add to Portfolio
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeploymentMode('replace')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: deploymentMode === 'replace' ? '#DC2626' : '#0B1633',
                      color: deploymentMode === 'replace' ? '#FFFFFF' : '#8FA3CB',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Set as Primary (Replace)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#060E24'
          }}
        >
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: currentStep === 1 ? '#475569' : '#CBD5E1',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: '12.5px',
              fontWeight: 600
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#CBD5E1',
                cursor: 'pointer',
                fontSize: '12.5px'
              }}
            >
              Cancel
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  background: '#2563EB',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDeployHierarchy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                }}
              >
                <Sparkles size={16} /> Deploy & Apply Hierarchy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HierarchyBuilderModal;
