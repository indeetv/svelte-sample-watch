<script>
	import { goto } from '$app/navigation';
	import { loginStoreSnapshot } from '$lib/store/login';
	import { metaConfigStoreSnapshot } from '$lib/store/meta-config';

	const handleLogout = async () => {
		await loginStoreSnapshot.handleLogout(
			`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.auth.session.logout']}`,
			{ refresh_token: $loginStoreSnapshot.refreshToken }
		);
		await goto('/login');
	};
</script>

<nav class="bg-white border-gray-200 dark:bg-gray-900">
	<div class="flex flex-wrap items-center justify-between mx-auto p-4">
		<div class="flex items-center space-x-3 rtl:space-x-reverse">
			<img
				src="https://indee.tv/wp-content/themes/indee/images/favicons/favicon_192x192.png"
				class="h-8"
				alt="Flowbite Logo"
			/>
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
				Indee Svelte Demo App
			</span>
		</div>
		<div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
			<button
				on:click={handleLogout}
				type="button"
				class="text-white w-24 bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:outline-none focus-visible:outline-indigo-600 font-medium rounded-lg text-sm px-4 py-2 text-center"
			>
				{#if $loginStoreSnapshot.logoutApiCalled}
					<div class="w-full items-center flex justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"
								><animateTransform
									attributeName="transform"
									dur="0.75s"
									repeatCount="indefinite"
									type="rotate"
									values="0 12 12;360 12 12"
								/></path
							></svg
						>
					</div>
				{:else}
					Log out
				{/if}
			</button>
		</div>
	</div>
</nav>
