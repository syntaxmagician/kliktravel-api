import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kliktravel.id';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'KlikTravel Admin';

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: UserRole.ADMIN, fullName: adminName },
    create: {
      email: adminEmail,
      fullName: adminName,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const regions = [
    {
      key: 'indonesia',
      slug: 'indonesia',
      featuredImageGradient: 'from-[#E0F2FE] to-[#7DD3FC]',
      nameId: 'Indonesia',
      nameEn: 'Indonesia',
      subtitleId:
        'Negeri kepulauan megah dengan ribuan budaya, pantai eksotis, dan petualangan tanpa batas.',
      subtitleEn:
        'A magnificent archipelago with thousands of cultures, exotic beaches, and endless adventure.',
      sortOrder: 0,
      subDestinations: [
        { slug: 'bali', nameId: 'Bali', nameEn: 'Bali', sortOrder: 0 },
        { slug: 'bromo', nameId: 'Gunung Bromo', nameEn: 'Mount Bromo', sortOrder: 1 },
        { slug: 'labuan-bajo', nameId: 'Labuan Bajo', nameEn: 'Labuan Bajo', sortOrder: 2 },
        { slug: 'raja-ampat', nameId: 'Raja Ampat', nameEn: 'Raja Ampat', sortOrder: 3 },
      ],
    },
    {
      key: 'japan',
      slug: 'japan',
      featuredImageGradient: 'from-[#7DD3FC] to-[#0284C7]',
      nameId: 'Jepang',
      nameEn: 'Japan',
      subtitleId:
        'Harmoni sempurna antara tradisi kuno dan inovasi futuristik di negeri sakura.',
      subtitleEn:
        'Perfect harmony of ancient tradition and futuristic innovation in the land of sakura.',
      sortOrder: 1,
      subDestinations: [
        { slug: 'tokyo', nameId: 'Tokyo', nameEn: 'Tokyo', sortOrder: 0 },
        { slug: 'kyoto', nameId: 'Kyoto', nameEn: 'Kyoto', sortOrder: 1 },
        { slug: 'osaka', nameId: 'Osaka', nameEn: 'Osaka', sortOrder: 2 },
      ],
    },
  ];

  for (const region of regions) {
    const { subDestinations, ...data } = region;
    const saved = await prisma.region.upsert({
      where: { key: data.key },
      update: data,
      create: data,
    });
    await prisma.subDestination.deleteMany({ where: { regionId: saved.id } });
    await prisma.subDestination.createMany({
      data: subDestinations.map((s) => ({ ...s, regionId: saved.id })),
    });
  }

  await prisma.journey.upsert({
    where: { slug: 'komodo-sailing' },
    update: {},
    create: {
      slug: 'komodo-sailing',
      durationDays: 5,
      priceRaw: 24500000,
      countriesCount: 1,
      image:
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200',
      imageGradient: 'from-[#38BDF8] to-[#0369A1]',
      gallery: [],
      sortOrder: 0,
      contentId: {
        title: 'Ekspedisi Berlayar Komodo',
        destination: 'Indonesia',
        subtitle:
          'Pelayaran phinisi privat melintasi pantai pasir merah muda, sabana berbatu, dan habitat naga prasejarah.',
        durationLabel: '5 Hari',
        dates: '12 — 16 Agu 2026',
        airline: 'Garuda Indonesia',
        price: 'IDR 24.5 JT',
        travelMonth: 'Agu 2026',
        travelStyle: 'Petualangan Bahari',
        introHeading: 'MENGARUNGI ALAM NAGA.',
        introDescription:
          'Memulai perjalanan menggunakan kapal Phinisi kayu mewah menjelajahi pulau-pulau terpencil di kepulauan Komodo.',
        chapters: [
          {
            id: 'c1',
            title: 'Berlayar',
            text: 'Naik phinisi dan menjelajahi pulau-pulau terpencil.',
            layout: 'left',
          },
        ],
        itinerary: [
          {
            day: 'Hari 1',
            title: 'Labuan Bajo',
            description: 'Kedatangan dan boarding phinisi.',
          },
        ],
        highlights: ['Komodo', 'Pink Beach', 'Manta Point'],
        accommodations: [
          { name: 'Phinisi Cabin', city: 'Labuan Bajo', roomType: 'Deluxe' },
        ],
        flights: { airline: 'Garuda Indonesia', route: ['CGK', 'LBJ'] },
        inclusions: ['Kapal phinisi', 'Makan penuh', 'Guide'],
        exclusions: ['Tiket pesawat', 'Asuransi'],
        faqs: [
          {
            q: 'Apakah cocok untuk pemula?',
            a: 'Ya, itinerary dirancang ramah untuk semua level.',
          },
        ],
      },
      contentEn: {
        title: 'Komodo Sailing Expedition',
        destination: 'Indonesia',
        subtitle:
          'Private phinisi sailing across pink beaches, rocky savannas, and prehistoric dragon habitats.',
        durationLabel: '5 Days',
        dates: '12 — 16 Aug 2026',
        airline: 'Garuda Indonesia',
        price: 'IDR 24.5 JT',
        travelMonth: 'Aug 2026',
        travelStyle: 'Marine Adventure',
        introHeading: 'SAILING THE LAND OF DRAGONS.',
        introDescription:
          'Board a luxury wooden phinisi and explore remote islands of the Komodo archipelago.',
        chapters: [
          {
            id: 'c1',
            title: 'Set Sail',
            text: 'Board the phinisi and explore remote islands.',
            layout: 'left',
          },
        ],
        itinerary: [
          {
            day: 'Day 1',
            title: 'Labuan Bajo',
            description: 'Arrival and phinisi boarding.',
          },
        ],
        highlights: ['Komodo', 'Pink Beach', 'Manta Point'],
        accommodations: [
          { name: 'Phinisi Cabin', city: 'Labuan Bajo', roomType: 'Deluxe' },
        ],
        flights: { airline: 'Garuda Indonesia', route: ['CGK', 'LBJ'] },
        inclusions: ['Phinisi boat', 'Full board meals', 'Guide'],
        exclusions: ['Flights', 'Insurance'],
        faqs: [
          {
            q: 'Is it beginner-friendly?',
            a: 'Yes, the itinerary suits all experience levels.',
          },
        ],
      },
    },
  });

  await prisma.openTrip.upsert({
    where: { slug: 'tokyo' },
    update: {},
    create: {
      slug: 'tokyo',
      featuredImage:
        'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1200',
      gallery: [],
      sortOrder: 0,
      contentId: {
        name: 'Tokyo',
        tagline: 'Simfoni Teknologi Modern & Budaya Klasik Jepang',
        duration: '5 Hari 4 Malam',
        price: 'Mulai Rp 16.800.000 / pax',
        hotelRating: '4★ Shinjuku Hotel',
        highlights: [
          'Kuil Sensoji Asakusa',
          'Shibuya Crossing',
          'Gunung Fuji & Danau Kawaguchiko',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Kedatangan di Tokyo & Check-in Shinjuku',
            activities: ['Penjemputan Bandara', 'Check-in Hotel'],
            description: 'Setibanya di Tokyo, check-in hotel Shinjuku.',
            hotel: 'Shinjuku Washington Hotel / Setara',
            image:
              'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=800',
          },
        ],
        inclusions: ['Hotel 4★', 'Transportasi lokal', 'Tour guide'],
        exclusions: ['Tiket pesawat internasional', 'Makan siang'],
      },
      contentEn: {
        name: 'Tokyo',
        tagline: 'A Symphony of Modern Tech & Classic Japanese Culture',
        duration: '5 Days 4 Nights',
        price: 'From Rp 16.800.000 / pax',
        hotelRating: '4★ Shinjuku Hotel',
        highlights: [
          'Sensoji Temple Asakusa',
          'Shibuya Crossing',
          'Mount Fuji & Lake Kawaguchiko',
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Tokyo & Shinjuku Check-in',
            activities: ['Airport pickup', 'Hotel check-in'],
            description: 'Arrive in Tokyo and check in at Shinjuku hotel.',
            hotel: 'Shinjuku Washington Hotel / Similar',
            image:
              'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=800',
          },
        ],
        inclusions: ['4★ hotel', 'Local transport', 'Tour guide'],
        exclusions: ['International flights', 'Lunch'],
      },
    },
  });

  await prisma.journalArticle.upsert({
    where: { slug: 'the-rhythm-of-water' },
    update: {},
    create: {
      slug: 'the-rhythm-of-water',
      image:
        'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1200',
      categoryID: 'Cerita Perjalanan',
      categoryEN: 'Travel Stories',
      titleID: 'Ritme Air di Amazon',
      titleEN: 'The Rhythm of Water in the Amazon',
      excerptID:
        'Perjalanan mendalam ke cekungan Amazon di mana waktu tidak diukur dengan jam.',
      excerptEN:
        'A deep journey into the Amazon basin where time is not measured by clocks.',
      contentID:
        'Amazon menawarkan ketenangan yang tak tertandingi bagi jiwa petualang.',
      contentEN:
        'The Amazon offers unparalleled serenity for the adventurous soul.',
      dateID: '14 Jul 2026',
      dateEN: 'Jul 14, 2026',
      readTimeID: '6 mnt membaca',
      readTimeEN: '6 min read',
      featured: true,
    },
  });

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Rian Dewantara',
        role: 'Travel Enthusiast',
        rating: 5,
        reviewID:
          'Pelayanan KlikTravel sangat luar biasa! Itinerary terencana dengan sangat rapi.',
        reviewEN:
          "KlikTravel's service was outstanding! The itinerary was beautifully planned.",
        trip: 'Tokyo Explorer Open Trip',
        approved: true,
        sortOrder: 0,
      },
      {
        name: 'Amelia Putri',
        role: 'Corporate Executive',
        rating: 5,
        reviewID: 'Perjalanan private ke Labuan Bajo sangat berkesan.',
        reviewEN: 'Our private trip to Labuan Bajo was unforgettable.',
        trip: 'Labuan Bajo Private Phinisi',
        approved: true,
        sortOrder: 1,
      },
    ],
  });

  const settings: { key: string; value: object }[] = [
    { key: 'siteName', value: { value: 'KlikTravel.ID' } },
    { key: 'whatsapp', value: { value: '+6281234567890' } },
    { key: 'email', value: { value: 'info@kliktravel.id' } },
    { key: 'instagram', value: { value: '@kliktravelid' } },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  console.log('Seed OK');
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
