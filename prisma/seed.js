const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SHRAMA SATHI AI Database...');

  // 1. Seed Welfare Schemes
  const schemes = [
    {
      code: 'ESHRAM-001',
      title: 'e-Shram Portal Registration & Social Security',
      titleHindi: 'ई-श्रम पोर्टल पंजीकरण एवं सामाजिक सुरक्षा',
      category: 'SOCIAL_SECURITY',
      targetAudience: 'असंगठित क्षेत्र के सभी श्रमिक (16-59 वर्ष)',
      eligibilitySummary: 'आयु 16-59 वर्ष, ईपीएफओ/ईएसआईसी का सदस्य न हो, असंगठित क्षेत्र में कार्यरत हो।',
      benefitsSummary: '12 अंकों का यूनिवर्सल अकाउंट नंबर (UAN), ₹2 लाख तक दुर्घटना बीमा (Accidental Cover), संकटकाल में प्रत्यक्ष लाभ अंतरण (DBT)।',
      documentsNeeded: 'आधार कार्ड, आधार लिंक मोबाइल नंबर, सक्रिय बैंक खाता पासबुक।',
      officialPortalUrl: 'https://eshram.gov.in',
    },
    {
      code: 'PMSYM-002',
      title: 'Pradhan Mantri Shram Yogi Maandhan (PM-SYM)',
      titleHindi: 'प्रधानमंत्री श्रम योगी मानधन पेंशन योजना',
      category: 'PENSION',
      targetAudience: 'स्ट्रीट वेंडर, निर्माण श्रमिक, घरेलू कामगार, कृषि मजदूर',
      eligibilitySummary: 'मासिक आय ₹15,000 से कम, प्रवेश आयु 18 से 40 वर्ष।',
      benefitsSummary: '60 वर्ष की आयु के बाद ₹3,000 प्रति माह सुनिश्चित न्यूनतम पेंशन। श्रमिक जितना योगदान करेगा, केंद्र सरकार भी उतना ही जमा करेगी।',
      documentsNeeded: 'आधार कार्ड, बचत बैंक खाता / जन-धन खाता विवरण।',
      officialPortalUrl: 'https://maandhan.in',
    },
    {
      code: 'BOCW-003',
      title: 'Building & Other Construction Workers (BOCW) Welfare Board',
      titleHindi: 'भवन एवं अन्य सन्निर्माण कर्मकार कल्याण बोर्ड',
      category: 'HOUSING',
      targetAudience: 'भवन निर्माण, पेंटर, बढ़ई, इलेक्ट्रीशियन, प्लंबर व मजदूर',
      eligibilitySummary: 'पिछले 12 महीनों में कम से कम 90 दिन निर्माण कार्य किया हो।',
      benefitsSummary: 'बच्चों की छात्रवृत्ति (₹2,000-₹25,000), साइकिल/टूलकिट सहायता, विवाह सहायता (₹51,000), प्रसूति सहायता, और पक्का आवास अनुदान।',
      documentsNeeded: 'नियोक्ता से 90 दिन कार्य का प्रमाण पत्र, आधार कार्ड, बैंक खाता, पासपोर्ट साइज फोटो।',
      officialPortalUrl: 'https://labour.gov.in',
    },
    {
      code: 'PMJAY-004',
      title: 'Ayushman Bharat - PM Jan Arogya Yojana',
      titleHindi: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना',
      category: 'HEALTH',
      targetAudience: 'गरीब और कमजोर श्रमिक परिवार',
      eligibilitySummary: 'एसईसीसी (SECC) डेटाबेस में शामिल परिवार और ई-श्रम सत्यापित गरीब श्रमिक।',
      benefitsSummary: 'प्रति परिवार प्रति वर्ष ₹5 लाख तक का मुफ्त कैशलेस द्वितीयक और तृतीयक अस्पताल उपचार।',
      documentsNeeded: 'राशन कार्ड, आधार कार्ड।',
      officialPortalUrl: 'https://pmjay.gov.in',
    },
    {
      code: 'PMSBY-005',
      title: 'Pradhan Mantri Suraksha Bima Yojana',
      titleHindi: 'प्रधानमंत्री सुरक्षा बीमा योजना (दुर्घटना बीमा)',
      category: 'ACCIDENT',
      targetAudience: 'सभी बैंक खाताधारक श्रमिक (18-70 वर्ष)',
      eligibilitySummary: 'आयु 18-70 वर्ष, बैंक खाते से ऑटो-डेबिट सहमति।',
      benefitsSummary: 'मात्र ₹20 वार्षिक प्रीमियम पर आकस्मिक मृत्यु या पूर्ण विकलांगता पर ₹2 लाख, आंशिक विकलांगता पर ₹1 लाख का कवर।',
      documentsNeeded: 'बैंक खाता, आधार कार्ड।',
      officialPortalUrl: 'https://financialservices.gov.in',
    },
  ];

  for (const scheme of schemes) {
    await prisma.welfareScheme.upsert({
      where: { code: scheme.code },
      update: scheme,
      create: scheme,
    });
  }

  // 2. Seed a Sample Worker
  const sampleWorker = await prisma.worker.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      name: 'रमेश कुमार (Ramesh Kumar)',
      phone: '9876543210',
      language: 'hi',
      state: 'उत्तर प्रदेश (Uttar Pradesh)',
      district: 'लखनऊ (Lucknow)',
      occupation: 'निर्माण श्रमिक (Construction Mason)',
      dailyWage: 650.0,
      eShramCardNumber: 'UAN-9843-1204-5512',
    },
  });

  // 3. Seed Sample Grievance
  await prisma.grievance.create({
    data: {
      workerId: sampleWorker.id,
      workerName: sampleWorker.name,
      workerPhone: sampleWorker.phone || '9876543210',
      category: 'WAGE_THEFT',
      title: '2 माह का बकाया वेतन भुगतान नहीं किया गया',
      description: 'साइट सुपरवाइजर ने पिछले दो महीनों (60 कार्य दिवस) की मजदूरी रोक रखी है। बार-बार मांगने पर काम से निकालने की धमकी दी जा रही है।',
      employerName: 'स्टार इंफ्रा डेवलपर्स प्रा. लि.',
      workplaceLocation: 'गोमती नगर एक्सटेंशन, लखनऊ',
      urgency: 'HIGH',
      status: 'INVESTIGATING',
      resolutionNotes: 'श्रम प्रवर्तन अधिकारी (LEO) द्वारा नोटिस जारी किया गया है। सुनवाई अगले मंगलवार को निर्धारित है।',
    },
  });

  // 4. Seed Sample Wage Entry
  await prisma.wageEntry.create({
    data: {
      workerId: sampleWorker.id,
      workHours: 8.0,
      standardRate: 650.0,
      overtimeHours: 2.5,
      overtimeRate: 162.5, // 2x base hourly rate (650 / 8 * 2 = 162.5/hr)
      grossWage: 1056.25,
      epfDeduction: 0.0,
      esicDeduction: 0.0,
      netWage: 1056.25,
      paymentStatus: 'PAID',
      notes: 'साइट कंक्रीटिंग कार्य का सामान्य दिन व ओवरटाइम',
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

