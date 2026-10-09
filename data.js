/* Kagaz — sample task data.
   Document lists are a general guide put together for this prototype.
   Rules change by state and over time, so every task links to its official portal. */

window.KAGAZ_TASKS = [
  {
    id: "passport",
    icon: "globe",
    title: { en: "Apply for a new passport", hi: "नया पासपोर्ट बनवाएं", mr: "नवीन पासपोर्ट काढा" },
    office: "Passport Seva Kendra",
    time: "45–90 min at the office",
    visits: "Usually 1 visit + police verification at home",
    portal: "https://www.passportindia.gov.in",
    tip: "Reach 15 minutes before your slot. They will not let you in more than ~30 minutes early.",
    groups: [
      {
        label: "Bring every one of these",
        type: "all",
        items: [
          { id: "arn", name: "Appointment receipt (ARN slip)", why: "The guard at the gate checks this before you enter.", originals: 1, copies: 0 },
          { id: "photoid", name: "Aadhaar card", why: "Used as photo ID and often as address proof.", originals: 1, copies: 1 }
        ]
      },
      {
        label: "Proof of address — any ONE",
        type: "one",
        items: [
          { id: "addr-aadhaar", name: "Aadhaar card (current address)", why: "Easiest if your Aadhaar already has the address you live at.", originals: 1, copies: 1 },
          { id: "addr-bill", name: "Electricity / water bill (recent)", why: "Should be in your name or a parent's name.", originals: 1, copies: 1 },
          { id: "addr-bank", name: "Bank passbook with photo", why: "Must be from a scheduled bank and show recent entries.", originals: 1, copies: 1 }
        ]
      },
      {
        label: "Proof of date of birth — any ONE",
        type: "one",
        items: [
          { id: "dob-birth", name: "Birth certificate", why: "Strongest proof, issued by the municipal registrar.", originals: 1, copies: 1 },
          { id: "dob-pan", name: "PAN card", why: "Accepted as date-of-birth proof.", originals: 1, copies: 1 },
          { id: "dob-school", name: "School leaving / 10th certificate", why: "Shows date of birth as recorded by the board.", originals: 1, copies: 1 }
        ]
      }
    ],
    steps: [
      "Register and fill the form online",
      "Pay the fee and book a slot",
      "Visit the Seva Kendra with originals",
      "Police verification at your address",
      "Passport arrives by post"
    ]
  },
  {
    id: "dl-renew",
    icon: "car",
    title: { en: "Renew driving licence", hi: "ड्राइविंग लाइसेंस नवीनीकरण", mr: "वाहन परवाना नूतनीकरण" },
    office: "Regional Transport Office (RTO)",
    time: "30–60 min",
    visits: "Often online; RTO visit if asked",
    portal: "https://parivahan.gov.in",
    tip: "If you are over 40, get the medical certificate signed before you go. It is the most common reason people are sent back.",
    groups: [
      {
        label: "Bring every one of these",
        type: "all",
        items: [
          { id: "dl-old", name: "Current driving licence", why: "The licence you are renewing.", originals: 1, copies: 1 },
          { id: "dl-form", name: "Renewal application printout", why: "Printed after you apply on the Parivahan portal.", originals: 1, copies: 0 },
          { id: "dl-photo", name: "Passport-size photos", why: "Keep two, even if you uploaded one online.", originals: 2, copies: 0, isPhoto: true },
          { id: "dl-fee", name: "Fee payment receipt", why: "Online payment slip.", originals: 1, copies: 0 }
        ]
      },
      {
        label: "Only if you are over 40",
        type: "optional",
        items: [
          { id: "dl-med", name: "Medical certificate (signed by a doctor)", why: "Required for renewal above a certain age.", originals: 1, copies: 0 }
        ]
      }
    ],
    steps: ["Apply on Parivahan", "Upload photo & signature", "Pay the fee", "Visit RTO if a test or check is required", "New licence by post"]
  },
  {
    id: "aadhaar-addr",
    icon: "home",
    title: { en: "Update address on Aadhaar", hi: "आधार में पता बदलें", mr: "आधारवरील पत्ता बदला" },
    office: "Online or Aadhaar Seva Kendra",
    time: "10 min online",
    visits: "Usually no visit needed",
    portal: "https://myaadhaar.uidai.gov.in",
    tip: "Keep the phone linked to Aadhaar with you — the whole process runs on an OTP.",
    groups: [
      {
        label: "Bring every one of these",
        type: "all",
        items: [
          { id: "aa-card", name: "Aadhaar number", why: "To log in to the portal.", originals: 1, copies: 0 },
          { id: "aa-phone", name: "Mobile linked to Aadhaar", why: "You will receive an OTP on it.", originals: 1, copies: 0, isThing: true }
        ]
      },
      {
        label: "New address proof — any ONE",
        type: "one",
        items: [
          { id: "aa-rent", name: "Registered rent agreement", why: "Must show your name and the new address.", originals: 1, copies: 0 },
          { id: "aa-bill", name: "Utility bill (last 3 months)", why: "Electricity, water, gas or landline.", originals: 1, copies: 0 },
          { id: "aa-bank", name: "Bank statement / passbook", why: "Signed and stamped by the bank.", originals: 1, copies: 0 }
        ]
      }
    ],
    steps: ["Log in with OTP", "Choose 'Address update'", "Upload a clear scan of the proof", "Pay the small fee", "Track with the URN"]
  },
  {
    id: "pan",
    icon: "card",
    title: { en: "Get a new PAN card", hi: "नया पैन कार्ड", mr: "नवीन पॅन कार्ड" },
    office: "Online (NSDL / UTIITSL)",
    time: "15 min online",
    visits: "No visit needed",
    portal: "https://www.onlineservices.nsdl.com",
    tip: "If you have Aadhaar, the instant e-PAN route is faster than the full form.",
    groups: [
      {
        label: "Bring every one of these",
        type: "all",
        items: [
          { id: "pan-photo", name: "Recent photo (scanned)", why: "Light background, face clearly visible.", originals: 1, copies: 0, isPhoto: true },
          { id: "pan-sign", name: "Signature on white paper (scanned)", why: "Sign inside the box, black ink works best.", originals: 1, copies: 0 }
        ]
      },
      {
        label: "Identity + address + DOB — any ONE set",
        type: "one",
        items: [
          { id: "pan-aadhaar", name: "Aadhaar card", why: "Covers identity, address and date of birth in one.", originals: 1, copies: 0 },
          { id: "pan-voter", name: "Voter ID + birth certificate", why: "If you do not want to use Aadhaar.", originals: 1, copies: 0 }
        ]
      }
    ],
    steps: ["Fill Form 49A online", "Upload documents", "Pay the fee", "e-PAN by email, card by post"]
  },
  {
    id: "income-cert",
    icon: "rupee",
    title: { en: "Income certificate", hi: "आय प्रमाण पत्र", mr: "उत्पन्नाचा दाखला" },
    office: "Tehsil office / state e-service portal",
    time: "1–2 hours, plus processing",
    visits: "1–2 visits",
    portal: "https://aaplesarkar.mahaonline.gov.in",
    tip: "Ask the talathi for the income report first. Without it the application usually waits.",
    groups: [
      {
        label: "Bring every one of these",
        type: "all",
        items: [
          { id: "ic-id", name: "Identity proof (Aadhaar / voter ID)", why: "To confirm who is applying.", originals: 1, copies: 2 },
          { id: "ic-ration", name: "Ration card", why: "Shows family members and address.", originals: 1, copies: 1 },
          { id: "ic-photo", name: "Passport-size photos", why: "One goes on the form.", originals: 2, copies: 0, isPhoto: true }
        ]
      },
      {
        label: "Proof of income — any ONE",
        type: "one",
        items: [
          { id: "ic-form16", name: "Form 16 / salary slip", why: "For salaried people.", originals: 1, copies: 1 },
          { id: "ic-talathi", name: "Talathi income report", why: "Common for farmers and self-employed.", originals: 1, copies: 1 },
          { id: "ic-self", name: "Self-declaration (affidavit)", why: "When no other proof exists.", originals: 1, copies: 1 }
        ]
      }
    ],
    steps: ["Collect income proof", "Apply online or at the setu kendra", "Verification by the office", "Download the signed certificate"]
  },
  {
    id: "vehicle-transfer",
    icon: "bike",
    title: { en: "Transfer vehicle ownership", hi: "वाहन का स्वामित्व ट्रांसफर", mr: "वाहन मालकी हस्तांतरण" },
    office: "Regional Transport Office (RTO)",
    time: "1–2 hours",
    visits: "Buyer and seller may both need to sign",
    portal: "https://vahan.parivahan.gov.in",
    tip: "Get every signature from the seller on the same day you pay. Chasing a signature later is the hardest part.",
    groups: [
      {
        label: "Bring every one of these",
        type: "all",
        items: [
          { id: "vt-rc", name: "Registration certificate (RC)", why: "The original RC of the vehicle.", originals: 1, copies: 1 },
          { id: "vt-29", name: "Form 29 (notice of transfer)", why: "Signed by the seller. Usually needs two copies.", originals: 2, copies: 0 },
          { id: "vt-30", name: "Form 30 (report of transfer)", why: "Signed by buyer and seller.", originals: 1, copies: 0 },
          { id: "vt-ins", name: "Valid insurance", why: "Must be active on the day of transfer.", originals: 1, copies: 1 },
          { id: "vt-puc", name: "PUC certificate", why: "Pollution check must be valid.", originals: 1, copies: 1 },
          { id: "vt-addr", name: "Buyer's address proof", why: "Aadhaar or a utility bill.", originals: 1, copies: 1 }
        ]
      },
      {
        label: "Only if the vehicle had a loan",
        type: "optional",
        items: [
          { id: "vt-noc", name: "NOC from the bank / financer", why: "Proves the loan is closed.", originals: 1, copies: 1 }
        ]
      }
    ],
    steps: ["Fill forms 29 & 30", "Apply on Vahan and pay", "Submit at RTO", "New RC in buyer's name"]
  }
];

window.KAGAZ_LOCKER_DEMO = [
  { id: "d1", name: "PUC certificate — scooter", expiry: 12 },
  { id: "d2", name: "Vehicle insurance", expiry: 48 },
  { id: "d3", name: "Driving licence", expiry: 210 },
  { id: "d4", name: "Passport", expiry: 1460 }
];
