import App from './App.svelte';


const isDebug = new URLSearchParams(location.search).has('debug');

const app = new App({
	target: document.body,
	props: {
		isDebug: isDebug,
		boardWidth: 10,
		boardHeight: 10
	}
});

export default app;
