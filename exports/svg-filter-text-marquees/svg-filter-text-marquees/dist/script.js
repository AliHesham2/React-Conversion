const pause_button = document.getElementById('pause');
const filters = document.getElementById('filters');

if(window.matchMedia('(prefers-reduced-motion)').matches) {
	filters.pauseAnimations();
}

pause_button.addEventListener('click',(e) => {
	const aria_pressed = pause_button.getAttribute('aria-pressed') === 'true' ? 'false' : 'true';
	pause_button.setAttribute('aria-pressed',aria_pressed);
	if(aria_pressed === 'true') {
		filters.pauseAnimations();
	} else {
		filters.unpauseAnimations();
	}
});