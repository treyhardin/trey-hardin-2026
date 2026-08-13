import { Lenis } from 'lenis';

const lenis = new Lenis({
	duration: 1.2,
	easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
	orientation: 'vertical',
	smoothWheel: true,
});

function raf(time) {
	lenis.raf(time);
	requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
