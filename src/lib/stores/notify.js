import { derived, writable } from 'svelte/store';

function createNotificationStore() {
	const notifications = writable([]);

	function send(message, type, timeout) {
		notifications.update((state) => {
			if (type === 'danger' && state.length > 0) {
				return [...state];
			}

			return [...state, { id: id(), type, message, timeout }];
		});
	}

	const { subscribe } = derived(notifications, ($notifications, set) => {
		set($notifications);

		if ($notifications.length > 0) {
			const timer = setTimeout(() => {
				notifications.update((state) => {
					state.shift();

					return state;
				});
			}, $notifications[0].timeout);
			return () => clearTimeout(timer);
		}
	});

	return {
		subscribe,
		danger: (msg) => send(msg, 'danger', 2500),
		warning: (msg, timeout) => send(msg, 'warning', timeout),
		info: (msg, timeout) => send(msg, 'info', timeout),
		success: (msg, timeout) => send(msg, 'success', timeout),
	};
}

function id() {
	return crypto.randomUUID();
}

export const notify = createNotificationStore();