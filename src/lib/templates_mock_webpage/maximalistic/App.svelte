<script lang="ts">
	import Hero from './Hero.svelte';
	import About from './About.svelte';
	import Products from './Products.svelte';
	import Testimonials from './Testimonials.svelte';
	import Gallery from './Gallery.svelte';
	import Footer from './Footer.svelte';
	
	export let brandData: any;
	export let images: {
		hero: string | null;
		gallery: string[];
	};
	export let content: Record<string, any>;
	
	$: brandName = brandData?.brand_name || brandData?.brandName || 'FOOD BRAND';
	$: accentColor = brandData?.colorPalette?.[0] || '#f59e0b';
	$: secondaryColor = brandData?.colorPalette?.[1] || '#ec4899';
	$: heroImages = images?.gallery?.slice(0, 3) || [];
	$: aboutImages = images?.gallery?.slice(0, 3) || [];
	$: galleryImages = images?.gallery?.map((url: string, i: number) => ({
		url,
		likes: Math.floor(Math.random() * 2000) + 500,
		comments: Math.floor(Math.random() * 200) + 50
	})) || [];
</script>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-yellow-50">
	<Hero
		{heroImages}
		heroTitle={content?.heroTitle || 'FLAVOR EXPLOSION'}
		heroSubtitle={content?.heroSubtitle || 'IN EVERY BITE!'}
		heroDescription={content?.heroDescription || '🌟 Handcrafted with passion, served with love. Experience the ultimate food journey that will tantalize your taste buds and leave you craving for more!'}
		heroBadge={content?.heroBadge || 'Premium Quality Since 2020'}
		ctaPrimary={content?.ctaPrimary || 'Order Now 🍴'}
		ctaSecondary={content?.ctaSecondary || 'View Menu 📖'}
		{accentColor}
		{secondaryColor}
		stats={content?.stats || []}
	/>
	<About
		{aboutImages}
		aboutTitle={content?.aboutTitle || 'OUR STORY OF'}
		aboutSubtitle1={content?.aboutSubtitle1 || 'DELICIOUS'}
		aboutSubtitle2={content?.aboutSubtitle2 || 'EXCELLENCE!'}
		aboutDescription1={content?.aboutDescription1 || '🎨 Born from a passion for creating extraordinary food experiences, we blend traditional recipes with modern culinary innovation.'}
		aboutDescription2={content?.aboutDescription2 || '🌈 Our commitment to using only the freshest, locally-sourced ingredients ensures that every bite is bursting with authentic flavors.'}
		{accentColor}
		{secondaryColor}
	/>
	<Products
		products={content?.products || []}
		sectionTitle={content?.productsTitle || 'SIGNATURE CREATIONS'}
		sectionSubtitle={content?.productsSubtitle || '✨'}
		sectionDescription={content?.productsDescription || '🎯 Handpicked favorites that will make your taste buds dance with joy!'}
		{accentColor}
		{secondaryColor}
	/>
	<Testimonials
		testimonials={content?.testimonials || []}
		stats={content?.testimonialStats || []}
		{accentColor}
		{secondaryColor}
	/>
	<Gallery
		{galleryImages}
		{accentColor}
		{secondaryColor}
	/>
	<Footer
		brandName={brandName}
		brandPart1={brandName.split(' ')[0] || 'FOOD'}
		brandPart2={brandName.split(' ').slice(1).join(' ') || 'BRAND'}
		brandDescription={content?.footerDescription || `🌟 Serving happiness one dish at a time since 2020!`}
		{accentColor}
		{secondaryColor}
		contactAddress={content?.contactAddress || '123 Food Street, Culinary City'}
		contactPhone={content?.contactPhone || '+1 (555) 123-4567'}
		contactEmail={content?.contactEmail || 'hello@foodbrand.com'}
	/>
</div>

