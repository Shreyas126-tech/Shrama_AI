/**
 * Statutory Minimum Wage Rates Directory (Indian Labour Law Standards)
 * Grounded in Section 6, 7 & 8 of The Code on Wages (2019)
 */

export interface MinimumWageRecord {
  stateCode: string;
  stateName: string;
  stateNameHindi: string;
  effectiveDate: string;
  gazetteRef: string;
  rates: {
    unskilled: { daily: number; monthly: number; label: string; labelHindi: string };
    semiSkilled: { daily: number; monthly: number; label: string; labelHindi: string };
    skilled: { daily: number; monthly: number; label: string; labelHindi: string };
    highlySkilled: { daily: number; monthly: number; label: string; labelHindi: string };
  };
  specialProvisions: string[];
}

export const STATUTORY_MINIMUM_WAGES: MinimumWageRecord[] = [
  {
    stateCode: 'CENTRAL',
    stateName: 'Central Sphere (Govt, Mining, Major Ports, Railways)',
    stateNameHindi: 'केंद्रीय क्षेत्र (रेलवे, खनन, बंदरगाह, केंद्रीय निर्माण)',
    effectiveDate: '01-10-2024',
    gazetteRef: 'Chief Labour Commissioner (Central) Notification 1/7(1)/2024-LS-II',
    rates: {
      unskilled: { daily: 783, monthly: 20358, label: 'Unskilled', labelHindi: 'अकुशल (मजदूर, हेल्पर)' },
      semiSkilled: { daily: 868, monthly: 22568, label: 'Semi-Skilled', labelHindi: 'अर्ध-कुशल (असिस्टेंट, ऑपरेटर)' },
      skilled: { daily: 954, monthly: 24804, label: 'Skilled', labelHindi: 'कुशल (मिस्त्री, बढ़ई, इलेक्ट्रीशियन)' },
      highlySkilled: { daily: 1035, monthly: 26910, label: 'Highly Skilled', labelHindi: 'अति-कुशल (फोरमैन, सुपरवाइजर)' },
    },
    specialProvisions: [
      'वेतन संहिता 2019 धारा 14: 8 घंटे से अधिक कार्य पर 2x ओवरटाइम अनिवार्य।',
      'महंगाई भत्ता (VDA) हर 6 महीने में संशोधित किया जाता है।',
    ],
  },
  {
    stateCode: 'DELHI',
    stateName: 'Delhi (National Capital Territory)',
    stateNameHindi: 'दिल्ली (राष्ट्रीय राजधानी क्षेत्र)',
    effectiveDate: '01-10-2024',
    gazetteRef: 'Govt of NCT of Delhi Notification F.No.(12)/Lab/MW/2024',
    rates: {
      unskilled: { daily: 712, monthly: 18512, label: 'Unskilled', labelHindi: 'अकुशल' },
      semiSkilled: { daily: 784, monthly: 20384, label: 'Semi-Skilled', labelHindi: 'अर्ध-कुशल' },
      skilled: { daily: 863, monthly: 22438, label: 'Skilled', labelHindi: 'कुशल' },
      highlySkilled: { daily: 935, monthly: 24310, label: 'Highly Skilled', labelHindi: 'अति-कुशल' },
    },
    specialProvisions: [
      'भारत में सर्वोच्च न्यूनतम वेतन दरों में से एक।',
      'अधिसूचित दर से 1 रुपया भी कम देना दंडनीय अपराध है।',
    ],
  },
  {
    stateCode: 'MAHARASHTRA',
    stateName: 'Maharashtra (Zone I - Mumbai, Pune, Thane)',
    stateNameHindi: 'महाराष्ट्र (जोन I - मुंबई, पुणे, ठाणे)',
    effectiveDate: '01-07-2024',
    gazetteRef: 'Govt of Maharashtra Industries & Labour Dept CLA-2024',
    rates: {
      unskilled: { daily: 624, monthly: 16224, label: 'Unskilled', labelHindi: 'अकुशल' },
      semiSkilled: { daily: 680, monthly: 17680, label: 'Semi-Skilled', labelHindi: 'अर्ध-कुशल' },
      skilled: { daily: 742, monthly: 19292, label: 'Skilled', labelHindi: 'कुशल' },
      highlySkilled: { daily: 810, monthly: 21060, label: 'Highly Skilled', labelHindi: 'अति-कुशल' },
    },
    specialProvisions: [
      'विशेष भत्ता (Special Allowance) प्रति माह शामिल है।',
      'हाउस रेंट अलाउंस (HRA) 5% अतिरिक्त देय है।',
    ],
  },
  {
    stateCode: 'KARNATAKA',
    stateName: 'Karnataka (Bengaluru & Urban Areas)',
    stateNameHindi: 'ಕರ್ನಾಟಕ / कर्नाटक (बेंगलुरु व शहरी क्षेत्र)',
    effectiveDate: '01-04-2024',
    gazetteRef: 'Karnataka Gazette Notification KAE 2024',
    rates: {
      unskilled: { daily: 596, monthly: 15496, label: 'Unskilled', labelHindi: 'ಅನುಭವಿ ಇಲ್ಲದ (अकुशल)' },
      semiSkilled: { daily: 648, monthly: 16848, label: 'Semi-Skilled', labelHindi: 'ಅರೆ-ಕುಶಲ (अर्ध-कुशल)' },
      skilled: { daily: 710, monthly: 18460, label: 'Skilled', labelHindi: 'ಕುಶಲ (कुशल)' },
      highlySkilled: { daily: 775, monthly: 20150, label: 'Highly Skilled', labelHindi: 'ಉನ್ನತ ಕುಶಲ (अति-कुशल)' },
    },
    specialProvisions: [
      'ರಾಜ್ಯಾದ್ಯಂತ ಕಾರ್ಮಿಕ ಸಂಹಿತೆಯ ರಕ್ಷಣೆ.',
      'ಪ್ರತಿ ದಿನದ ಕೆಲಸದ ಸಮಯ ಗರಿಷ್ಠ 8 ಗಂಟೆಗಳು.',
    ],
  },
  {
    stateCode: 'UP',
    stateName: 'Uttar Pradesh (Construction & General Industry)',
    stateNameHindi: 'उत्तर प्रदेश (भवन निर्माण एवं सामान्य उद्योग)',
    effectiveDate: '01-10-2024',
    gazetteRef: 'UP Labour Commissioner Order 3481/MW-2024',
    rates: {
      unskilled: { daily: 485, monthly: 12610, label: 'Unskilled', labelHindi: 'अकुशल (मजदूर)' },
      semiSkilled: { daily: 534, monthly: 13884, label: 'Semi-Skilled', labelHindi: 'अर्ध-कुशल' },
      skilled: { daily: 598, monthly: 15548, label: 'Skilled', labelHindi: 'कुशल (कारीगर)' },
      highlySkilled: { daily: 670, monthly: 17420, label: 'Highly Skilled', labelHindi: 'अति-कुशल' },
    },
    specialProvisions: [
      'मजदूरी का भुगतान बैंक खाते या चेक द्वारा होना अनिवार्य है।',
      'ठेकेदार द्वारा लेबर सेस की कटौती गैर-कानूनी है।',
    ],
  },
  {
    stateCode: 'TAMIL_NADU',
    stateName: 'Tamil Nadu (Chennai, Coimbatore & Industrial Belts)',
    stateNameHindi: 'தமிழ்நாடு / तमिलनाडु (चेन्नई, कोयम्बटूर व औद्योगिक क्षेत्र)',
    effectiveDate: '01-04-2024',
    gazetteRef: 'TN Labour and Employment Dept G.O. (2D) No. 2024',
    rates: {
      unskilled: { daily: 580, monthly: 15080, label: 'Unskilled', labelHindi: 'திறனற்றவர் (अकुशल)' },
      semiSkilled: { daily: 635, monthly: 16510, label: 'Semi-Skilled', labelHindi: 'அரை-திறன் பெற்றவர் (अर्ध-कुशल)' },
      skilled: { daily: 695, monthly: 18070, label: 'Skilled', labelHindi: 'திறன் பெற்றவர் (कुशल)' },
      highlySkilled: { daily: 760, monthly: 19760, label: 'Highly Skilled', labelHindi: 'உயர் திறன் (अति-कुशल)' },
    },
    specialProvisions: [
      'காப்பீடு மற்றும் பி.எஃப் சலுகைகள் கட்டாயம்.',
      'இரட்டிப்பு கூடுதல் நேர ஊதியம் (2x Overtime).',
    ],
  },
];

