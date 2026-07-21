require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Page = require('./models/Page');

const run = async () => {
  await connectDB();

  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@renewcred.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

  let admin = await Admin.findOne({ email });
  if (!admin) {
    admin = await Admin.create({ username, email, password });
    console.log(`Created admin: ${email} / ${password}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }

  const existingHome = await Page.findOne({ slug: 'home' });
  if (!existingHome) {
    await Page.create({
      title: 'Home',
      slug: 'home',
      status: 'published',
      category: 'general',
      updatedBy: admin._id,
      blocks: [
        {
          type: 'header',
          order: 0,
          data: { text: 'RenewCred: Financing the Clean Energy Transition', level: 1 },
        },
        {
          type: 'paragraph',
          order: 1,
          data: {
            text: 'RenewCred connects renewable energy projects with credit facilities, helping developers move from feasibility to commissioning faster. This entire page is served from the CMS below — nothing here is hardcoded.',
          },
        },
        {
          type: 'header',
          order: 2,
          data: { text: 'What we offer', level: 2 },
        },
        {
          type: 'list',
          order: 3,
          data: {
            ordered: false,
            items: [
              {
                text: 'Project financing',
                children: [
                  { text: 'Solar (utility-scale and rooftop)' },
                  { text: 'Wind (onshore)' },
                  { text: 'Battery storage' },
                ],
              },
              { text: 'Green bonds advisory' },
              {
                text: 'Risk assessment',
                children: [{ text: 'Credit scoring models' }, { text: 'Climate risk overlays' }],
              },
            ],
          },
        },
        {
          type: 'header',
          order: 4,
          data: { text: 'Sample loan terms', level: 2 },
        },
        {
          type: 'table',
          order: 5,
          data: {
            headers: ['Product', 'Tenure', 'Indicative Rate'],
            rows: [
              ['Solar Project Loan', '5-15 years', '8.5% - 11%'],
              ['Green Bond', '3-10 years', '7.25% - 9%'],
              ['Working Capital', '1 year', '9.5% - 12%'],
            ],
          },
        },
        {
          type: 'header',
          order: 6,
          data: { text: 'How we price risk', level: 2 },
        },
        {
          type: 'paragraph',
          order: 7,
          data: {
            text: 'Our credit score for a project blends financial and climate-exposure factors into a single weighted index.',
          },
        },
        {
          type: 'equation',
          order: 8,
          data: {
            equation: 'S = w_1 \\cdot F + w_2 \\cdot C + w_3 \\cdot R',
            displayMode: true,
          },
        },
        {
          type: 'paragraph',
          order: 9,
          data: {
            text: 'Where F is the financial health score, C is the climate-exposure score, R is the regulatory-risk score, and w1, w2, w3 are configurable weights, e.g. inline: ',
          },
        },
        {
          type: 'equation',
          order: 10,
          data: { equation: 'w_1 + w_2 + w_3 = 1', displayMode: false },
        },
      ],
    });
    console.log('Seeded sample page: /home');
  } else {
    console.log('Sample page "home" already exists, skipping.');
  }

  const existingEv = await Page.findOne({ slug: 'ev' });
  if (!existingEv) {
    await Page.create({
      title: 'EV',
      slug: 'ev',
      status: 'published',
      category: 'standards',
      icon: '🔋',
      excerpt: 'Certification standard for electric vehicle financing eligibility.',
      updatedBy: admin._id,
      blocks: [
        {
          type: 'paragraph',
          order: 0,
          data: {
            text: 'This standard defines the eligibility criteria and reporting requirements for electric-vehicle financing products listed on the RenewCred platform.',
          },
        },
        { type: 'header', order: 1, data: { text: '1.0 Introduction', level: 2 } },
        {
          type: 'paragraph',
          order: 2,
          data: {
            text: 'The EV standard establishes a shared baseline so that lenders, manufacturers, and auditors can evaluate electric-vehicle projects consistently.',
          },
        },
        { type: 'header', order: 3, data: { text: '2.0 Scope', level: 2 } },
        {
          type: 'list',
          order: 4,
          data: {
            ordered: false,
            items: [
              {
                text: 'Vehicle categories',
                children: [
                  { text: 'Passenger EVs' },
                  { text: 'Light commercial EVs' },
                  { text: 'Two- and three-wheelers' },
                ],
              },
              {
                text: 'Supporting infrastructure',
                children: [{ text: 'Charging stations' }, { text: 'Battery swap networks' }],
              },
            ],
          },
        },
        { type: 'header', order: 5, data: { text: '2.1 Future Versions', level: 3 } },
        {
          type: 'paragraph',
          order: 6,
          data: {
            text: 'Future revisions will extend coverage to heavy commercial fleets and second-life battery certification.',
          },
        },
        { type: 'header', order: 7, data: { text: '2.2 Future Versions', level: 3 } },
        {
          type: 'paragraph',
          order: 8,
          data: {
            text: 'Public consultation on the v2.0 draft is expected to open in the next reporting cycle.',
          },
        },
      ],
    });
    console.log('Seeded sample page: /ev (category: standards)');
  } else {
    console.log('Sample page "ev" already exists, skipping.');
  }

  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
