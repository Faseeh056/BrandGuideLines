<script lang="ts">
	import Navbar from './Navbar.svelte';
	import Hero from './Hero.svelte';
	import Services from './Services.svelte';
	import About from './About.svelte';
	import Footer from './Footer.svelte';
	
	export let brandData: any;
	export let images: {
		hero: string | null;
		gallery: string[];
	};
	export let content: Record<string, any>;
	
	$: brandName = brandData?.brand_name || brandData?.brandName || 'MONO';
	$: brandInitial = brandName.charAt(0).toUpperCase();
	$: primaryColor = brandData?.colorPalette?.[0] || brandData?.brandColors?.[0] || '#030213';
	$: heroImage = images?.hero || '';
	$: aboutImage = images?.gallery?.[0] || '';
	$: menuItems = content?.menuItems || ['Sofas', 'Chairs', 'Tables', 'Collections'];
	$: categories = content?.categories || [
		{ icon: 'Sofa', title: 'Sofas', description: 'Premium sectionals and couches in monochrome elegance.' },
		{ icon: 'Armchair', title: 'Chairs', description: 'Iconic seating designs that blend form and function.' },
		{ icon: 'Table2', title: 'Tables', description: 'Dining and coffee tables with clean, minimalist lines.' },
		{ icon: 'Bed', title: 'Beds', description: 'Sleek bedroom furniture for restful sanctuaries.' },
		{ icon: 'Lamp', title: 'Lighting', description: 'Statement pieces that illuminate with sophistication.' },
		{ icon: 'ShoppingBag', title: 'Accessories', description: 'Curated decor items to complete your minimal space.' }
	];
</script>

<div class="min-h-screen bg-white">
	<Navbar 
		{brandName} 
		{brandInitial} 
		{primaryColor}
		menuItems={content?.menuItems || ['Sofas', 'Chairs', 'Tables', 'Collections']}
	/>
	<Hero
		{heroImage}
		heroTitle={content?.heroTitle || `Welcome to ${brandName}`}
		heroDescription={content?.heroDescription || `Discover our curated collection.`}
		heroBadge={content?.heroBadge || 'Featured Collection'}
		ctaPrimary={content?.ctaPrimary || 'Explore Collection'}
		ctaSecondary={content?.ctaSecondary || 'View Lookbook'}
		{primaryColor}
		stats={content?.stats || []}
	/>
	<Services
		sectionTitle={content?.servicesTitle || 'Shop by Category'}
		sectionDescription={content?.servicesDescription || 'Every piece designed to enhance your space'}
		{primaryColor}
		categories={content?.categories || []}
	/>
	<About
		{aboutImage}
		aboutTitle={content?.aboutTitle || `Why Choose ${brandName}`}
		aboutDescription={content?.aboutDescription || 'We believe in quality and excellence.'}
		features={content?.features || []}
		{primaryColor}
	/>
	<Footer
		{brandName}
		{brandInitial}
		brandDescription={content?.footerDescription || `${brandName} - Quality products for modern living.`}
		{primaryColor}
	/>
</div>

