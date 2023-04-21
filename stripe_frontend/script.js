document.addEventListener('DOMContentLoaded', function () {
	const button = document.querySelector('button');
	button.addEventListener('click', () => {
		// console.log('Checkout');

		fetch('/api/user/cart/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				clothings: [
					{ id: 1, name: 'shirt', quantity: 1 },
					{ id: 2, name: 'pants', quantity: 1 },
				],
			}),
		})
			.then((res) => {
				if (res.ok) return res.json();
				return res.json().then((json) => Promise.reject(json));
			})
			.then(({ url }) => {
				window.location = url;
			})
			.catch((e) => {
				console.log(e.error);
			});
	});
});
