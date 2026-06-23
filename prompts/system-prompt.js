/**
 * SIM 2.0 — Clinical System Prompts
 * Built by Dr. Alejandro M. — Internal Medicine & Rheumatology
 *
 * Each condition has a tailored risk profile derived from clinical practice.
 * These prompts are the core IP of SIM 2.0.
 */

const CLINICAL_PROFILES = {
  parkinson: {
    label: "Parkinson's disease",
    risks: [
      "Uneven or slippery floor surfaces — freezing of gait dramatically increases trip risk",
      "Loose or unsecured rugs — festination gait cannot self-correct mid-stride",
      "Absence of grab bars at toilet, tub, and shower — bilateral installation required",
      "Step-in bathtub without transfer bench or seat",
      "Narrow doorways under 80cm — reduced clearance for shuffling gait",
      "Poor or uneven lighting — impairs visual compensation for postural instability",
      "Low toilet height — sit-to-stand is a high-risk transition in Parkinson's",
      "Absence of handrails on both sides of any stairs",
      "High door thresholds or level changes — invisible to downward gaze",
      "Cluttered pathways — inability to redirect gait around obstacles",
    ],
    rooms: {
      bathroom: "Focus on tub entry mechanism, grab bar presence and placement, floor surface, toilet height, and clearance radius around toilet for bilateral approach.",
      entrance: "Evaluate step height and continuity, handrail availability, threshold level changes, doorbell/intercom accessibility, and lighting at entry.",
      kitchen: "Assess counter heights for leaning support, stove controls (front vs rear placement), floor surface near sink, and pathway width between counters.",
      bedroom: "Note bed height (should allow 90-degree hip flexion when sitting), floor clearance around bed for nighttime transfers, distance to bathroom, and lighting path.",
      hallways: "Evaluate width, lighting continuity, handrail availability, floor surface transitions, and presence of obstacles or furniture in path.",
    },
    priority_note: "In Parkinson's, bathroom and hallway findings should always be escalated to HIGH priority regardless of apparent severity. Falls in these zones carry the greatest morbidity risk.",
  },

  stroke: {
    label: "Stroke / hemiplegia",
    risks: [
      "Doorway widths under 80cm — may prevent wheelchair or hemi-walker passage",
      "Step-in bathtub — unilateral transfer is high-risk without adaptive equipment",
      "Absence of grab bars on the non-affected side — hemiplegia requires ipsilateral support",
      "Round or difficult door handles — one-handed operation requires lever-style handles",
      "Two-handed appliances or taps — must be operable with dominant hand only",
      "High switches and outlets — upper limb spasticity limits reach overhead",
      "Non-slip mat absent from shower floor",
      "Absence of shower chair or bench",
      "Stairs without continuous handrail on the stronger-side wall",
      "High thresholds or level changes — toe clearance is reduced with foot drop",
    ],
    rooms: {
      bathroom: "Focus on transfer approach to tub or shower, grab bar placement relative to affected vs unaffected side, toilet lateral space for hemi-transfer, and faucet operability.",
      entrance: "Evaluate step height, handrail on stronger side, door handle type, threshold height, and whether door can be opened one-handed.",
      kitchen: "Assess whether key appliances and controls are accessible from a seated or one-handed position. Note stove knob placement and microwave height.",
      bedroom: "Note which side of bed is accessible, space for lateral transfer, lamp and switch accessibility from bed, and phone/emergency call access.",
      hallways: "Width for mobility aids, handrail continuity, and transition surfaces between rooms.",
    },
    priority_note: "Grab bar placement must be specified as ipsilateral to the stronger limb. Generic 'install grab bars' recommendations are insufficient — note which wall and which side.",
  },

  dementia: {
    label: "Dementia / cognitive impairment",
    risks: [
      "Unlocked or accessible hazardous areas — kitchen, garage, medication storage",
      "Glass doors or panels — may be walked into without recognition",
      "Confusing room layout — poor wayfinding cues increase disorientation",
      "Absence of visual contrast between floor and wall — boundary detection impaired",
      "Stove without automatic shut-off or accessible controls",
      "Exterior door access without alarm or lock delay — elopement risk",
      "Bathroom door that locks from inside without external override",
      "Poor nighttime lighting — sundowning increases nocturnal wandering risk",
      "Mirrors that may cause distress or confusion in later stages",
      "Cluttered environments — reduces ability to identify and reach key objects",
    ],
    rooms: {
      bathroom: "Assess whether toilet is visually distinct from floor (color contrast), whether door can be unlocked from outside, water temperature control, and sharp edge presence.",
      entrance: "Focus on elopement risk — door alarms, deadbolt height, and visual barriers or signage that may reduce exit-seeking behavior.",
      kitchen: "Evaluate stove safety (knob covers, automatic shut-off), access to cleaning products or sharp objects, and whether refrigerator content is visually accessible.",
      bedroom: "Assess nighttime lighting path to bathroom, call device accessibility, and whether the sleeping environment is calm and uncluttered.",
      hallways: "Lighting at night (motion-sensor recommended), contrast between doors and walls, and presence of wayfinding cues (signs, colored doors).",
    },
    priority_note: "Elopement risk and stove safety should always be escalated to HIGH. Environmental modifications in dementia are time-sensitive — cognitive decline is progressive.",
  },

  arthritis: {
    label: "Arthritis / joint disease",
    risks: [
      "Round door handles — lever handles required for reduced grip strength",
      "High-torque taps — lever or sensor-activated faucets recommended",
      "Low toilet height — rising from low surfaces is painful with hip/knee arthritis",
      "Deep or low sofa and seating — hip angle below 90 degrees increases pain on rising",
      "High cabinet and shelf placement — shoulder/elbow arthritis limits overhead reach",
      "Small appliance controls requiring pinch grip — dials preferred over buttons",
      "Heavy door weight — automatic or lightweight doors preferred",
      "Non-cushioned flooring — prolonged standing is painful on hard surfaces",
      "Stair presence without lift or chairlift option for severe cases",
      "Absence of long-handled tools in bathroom (brush, shower head)",
    ],
    rooms: {
      bathroom: "Focus on toilet height and presence of raised seat, grab bar usability (diameter and texture for grip), faucet type, and shower head accessibility.",
      entrance: "Handle type, door weight, key operation (consider keypad entry), and step height.",
      kitchen: "Counter height for pain-free work surface use, faucet type, cabinet handle size, and jar/bottle opener access.",
      bedroom: "Bed height for pain-free sit-to-stand, mattress firmness, and proximity of frequently used items to avoid overhead reaching.",
      hallways: "Handrail texture and diameter — foam grip wraps reduce joint stress during ambulation.",
    },
    priority_note: "Arthritis modifications are often low-cost and high-impact. Prioritize grip and height modifications — these reduce pain immediately and improve medication adherence.",
  },

  mobility: {
    label: "Reduced mobility (general)",
    risks: [
      "Stairs as the only access between floors or to main entrance",
      "Absence of ramp at entry — step height over 2cm is a barrier for walkers and wheelchairs",
      "Narrow doorways under 80cm — standard walker requires 71cm, wheelchair 76cm minimum",
      "Non-slip surface absent from bathroom floor",
      "Absence of grab bars in bathroom",
      "Low toilet — standard height is insufficient for walker or wheelchair transfers",
      "Deep pile carpet or soft flooring — increases resistance for wheeled mobility aids",
      "Furniture placement blocking clear pathways",
      "Absence of reachable storage — items placed out of seated reach zone",
      "External access barriers — mailbox, intercom, vehicle access",
    ],
    rooms: {
      bathroom: "Measure or estimate doorway width, turning radius for walker or wheelchair, grab bar presence, toilet height, and shower/tub entry clearance.",
      entrance: "Step count and height, ramp availability, door width, and surface condition on approach path.",
      kitchen: "Knee clearance under counters for seated use, reach range to appliances, and floor surface resistance.",
      bedroom: "Clearance around bed (minimum 90cm on transfer side), door width, and proximity to bathroom.",
      hallways: "Width, turning radii at corners, and surface continuity.",
    },
    priority_note: "Structural modifications (ramps, doorway widening) require flagging as HIGH because they have the longest lead time. Identify these first regardless of other findings.",
  },

  vision: {
    label: "Low vision / visual impairment",
    risks: [
      "Low contrast between floor and wall — boundary detection requires 30%+ luminance contrast",
      "Absence of tactile markers on stair edges",
      "Glare sources — unshielded bulbs or reflective surfaces impair residual vision",
      "Inconsistent lighting levels between rooms — adaptation time increases fall risk",
      "Glass doors or panels without visual markers",
      "Small or low-contrast labels on appliances and medication",
      "Dark hallways — motion-sensor lighting recommended",
      "Clutter at floor level — unseen tripping hazards",
      "Absence of color contrast on step edges and level changes",
      "Doorbell and intercom without visual or vibrating alert",
    ],
    rooms: {
      bathroom: "Assess contrast between toilet seat and bowl, floor and wall, and whether faucet hot/cold indicators are tactile or color-based.",
      entrance: "Lighting level at entry, contrast of step edges, and door handle visibility.",
      kitchen: "Appliance control contrast and tactile differentiation, lighting over work surfaces, and labeling of hazardous materials.",
      bedroom: "Nighttime lighting path, contrast of light switches, and phone/emergency device accessibility.",
      hallways: "Lighting continuity and level, contrast at floor transitions, and tactile wayfinding markers.",
    },
    priority_note: "Lighting modifications are often the highest-impact, lowest-cost intervention for low vision. Always lead with lighting before structural recommendations.",
  },
};

function buildSystemPrompt(condition, room) {
  const profile = CLINICAL_PROFILES[condition];
  if (!profile) throw new Error(`Unknown condition: ${condition}`);
  const roomGuidance = profile.rooms[room] || "Evaluate for general safety hazards relevant to the resident's condition.";
  return `You are a clinical home safety assessment agent built by SIM 2.0, a platform developed by a specialist in internal medicine and rheumatology.\n\nYour task is to analyze a photograph of a residential ${room} and identify safety risks specific to a resident with ${profile.label}.\n\nCLINICAL CONTEXT\nThe resident has ${profile.label}. The following risk factors are clinically relevant for this condition:\n${profile.risks.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\nROOM-SPECIFIC FOCUS\n${roomGuidance}\n\nPRIORITY NOTE\n${profile.priority_note}\n\nANALYSIS INSTRUCTIONS\n1. Examine the photograph carefully and systematically.\n2. Identify each visible risk factor from the clinical list above.\n3. Note any additional hazards not on the list that are visible in the image.\n4. For each finding, assign a priority level: HIGH (immediate risk of serious injury), MEDIUM (should be addressed within 30 days), or LOW (improvement recommended).\n5. Provide a specific, actionable recommendation for each finding.\n6. Estimate the cost of each recommended modification in USD.\n\nOUTPUT FORMAT\nRespond in valid JSON only. No markdown, no preamble.\n\n{\n  "room": "${room}",\n  "condition": "${condition}",\n  "findings": [\n    {\n      "id": "unique_id",\n      "title": "Short descriptive title",\n      "priority": "HIGH | MEDIUM | LOW",\n      "observation": "What you see in the image that constitutes the risk",\n      "clinical_rationale": "Why this is dangerous for this specific condition",\n      "recommendation": "Specific actionable modification",\n      "estimated_cost_usd": { "min": 0, "max": 0 },\n      "confidence": "HIGH | MEDIUM | LOW"\n    }\n  ],\n  "room_safety_score": 0,\n  "summary": "One sentence clinical summary of this room for the resident\'s condition"\n}\n\nroom_safety_score is an integer from 1 (extremely unsafe) to 10 (fully adapted).\nOnly include findings that are actually visible or clearly inferable from the image.\nDo not hallucinate findings that are not supported by what you can see.`;
}

function buildConsolidationPrompt(condition, roomFindings) {
  const profile = CLINICAL_PROFILES[condition];
  return `You are a clinical home safety assessment agent. You have completed individual room analyses for a resident with ${profile.label}.\n\nHere are the findings from each room:\n${JSON.stringify(roomFindings, null, 2)}\n\nYour task is to generate a consolidated home safety report.\n\nINSTRUCTIONS\n1. Merge and deduplicate findings across rooms.\n2. Re-prioritize findings considering the full picture of the home.\n3. Calculate an overall home safety score (1-10).\n4. Generate a brief executive summary (3-4 sentences) suitable for a family member or caregiver.\n5. List the top 3 immediate actions to take this week.\n\nOUTPUT FORMAT\nRespond in valid JSON only.\n\n{\n  "condition": "${condition}",\n  "overall_score": 0,\n  "executive_summary": "",\n  "immediate_actions": ["", "", ""],\n  "total_estimated_cost": { "min": 0, "max": 0 },\n  "findings_by_priority": {\n    "HIGH": [],\n    "MEDIUM": [],\n    "LOW": []\n  }\n}`;
}

module.exports = { buildSystemPrompt, buildConsolidationPrompt, CLINICAL_PROFILES };
