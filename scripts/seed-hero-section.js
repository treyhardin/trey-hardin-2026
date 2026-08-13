import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'vs8d5hbw',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_STUDIO_TOKEN,
});

async function seedHeroSection() {
  const existing = await sanityClient.fetch(
    '*[_type == "heroSection"][0]',
  );

  if (existing) {
    console.log('heroSection document already exists (id:', existing._id, ')');
    return;
  }

  console.log('Creating heroSection singleton...');

  await sanityClient.create({
    _id: 'heroSection',
    _type: 'heroSection',
    heading: 'Design Lead & Creative Technologist',
    images: [],
  });

  console.log('Done — heroSection created with empty images array.');
  console.log('Add images in Sanity Studio under "Hero Section".');
}

seedHeroSection().catch(console.error);
