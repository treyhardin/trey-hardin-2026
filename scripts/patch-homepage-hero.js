/**
 * Patch the existing homepage document to add heroHeading and heroImages fields.
 * Run with: npx sanity exec --with-user-token scripts/patch-homepage-hero.js
 */
import { createClient } from '@sanity/client';

const sanityClient = createClient({
	projectId: 'vs8d5hbw',
	dataset: 'production',
	apiVersion: '2025-01-01',
	useCdn: false,
	token: process.env.SANITY_STUDIO_TOKEN,
});

async function patchHomepageHero() {
	// Get the homepage document
	const homepage = await sanityClient.fetch(`*[_type == "homepage"][0]`);

	if (!homepage) {
		console.log('No homepage document found — nothing to patch.');
		process.exit(0);
		return;
	}

	console.log('Found homepage document:', homepage._id);

	// Find an existing image asset to reuse for hero
	const anyAsset = await sanityClient.fetch(`*[_type == "sanityImage"][0]`);
	
	let imageRef = null;
	if (anyAsset && anyAsset.image && anyAsset.image.asset && anyAsset.image.asset._ref) {
		imageRef = anyAsset.image.asset._ref;
		console.log('Found image ref from sanityImage:', imageRef);
	}

	// Patch the homepage to add hero fields
	const patchData = {
		heroHeading: 'Design lead. Creative technologist. Brand builder.',
	};

	if (imageRef) {
		patchData.heroImages = [
			{
				_type: 'sanityImage',
				image: {
					_type: 'image',
					asset: {
						_key: 'asset_ref',
						_type: 'reference',
						_ref: imageRef,
					},
				},
				alt: 'Hero cycling image',
			},
		];
	}

	await sanityClient.patch('homepage').set(patchData).commit();

	console.log('✅ Homepage patched with hero fields');
	console.log('   heroHeading:', patchData.heroHeading);
	console.log('   heroImages:', patchData.heroImages ? `${patchData.heroImages.length} image(s)` : 'none (no image assets found)');
}

patchHomepageHero().catch((err) => {
	console.error('Failed to patch homepage:', err.message);
	process.exit(1);
});
