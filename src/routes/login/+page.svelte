<script lang="ts">
	import { productConfigStoreSnapshot } from '../../lib/store/product-config';
	import { loginStoreSnapshot } from '../../lib/store/login';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Loader from '../../components/Loader.svelte';
	import { metaConfigStoreSnapshot } from '$lib/store/meta-config';
	import type { PinCredentials, PasswordCredentials } from '../../lib/store/types/login';

	let loginMode = '';
	let email = '';
	let password = '';
	let inputElement: HTMLInputElement;

	onMount(() => {
		productConfigStoreSnapshot.subscribe((value) => {
			loginMode = value.authType === 'PWD' ? 'password' : 'pin';
		});
		loginStoreSnapshot.subscribe((value) => {
			if (value.authToken) {
				goto('/brands');
			}
		});
	});

	const handleSubmit = () => {
		let loginPayload: PinCredentials | PasswordCredentials = {} as
			| PinCredentials
			| PasswordCredentials;
		if (loginMode === 'password') {
			(loginPayload as PasswordCredentials).username = email;
			(loginPayload as PasswordCredentials).password = password;
		} else {
			(loginPayload as PinCredentials).pin = password;
		}
		loginStoreSnapshot.handleLogin(
			`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.auth.session.login']}`,
			loginPayload,
			loginMode
		);
	};
</script>

{#if !$productConfigStoreSnapshot.authType}
	<Loader></Loader>
{:else}
	<div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<img
				alt="Your Company Logo"
				src={$productConfigStoreSnapshot.companyLogo}
				class="mx-auto h-16 w-auto"
			/>
			<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
				Sign in to your account
			</h2>
			<p class="text-center text-sm text-gray-500">Please enter your credentials</p>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
				{#if $productConfigStoreSnapshot.authType === 'PWD'}
					<div>
						<label for="username" class="block text-sm font-medium leading-6 text-gray-900">
							Email address
						</label>
						<div class="mt-2">
							<input
								bind:value={email}
								id="username"
								name="username"
								type="email"
								required
								autoComplete="email"
								placeholder="Enter your email address"
								class="px-2.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				{/if}

				<div>
					<div class="flex items-center justify-between">
						<label for="authKey" class="block text-sm font-medium leading-6 text-gray-900">
							{$productConfigStoreSnapshot.authType === 'PWD' ? 'Password' : 'Access Code'}
						</label>
					</div>
					<div class="mt-2 flex">
						<input
							bind:value={password}
							bind:this={inputElement}
							on:focusin={() => (inputElement.type = 'text')}
							on:focusout={() => (inputElement.type = 'password')}
							id="authKey"
							name="authKey"
							type="password"
							required
							placeholder={$productConfigStoreSnapshot.authType === 'PWD'
								? 'Enter your password'
								: 'Enter your access code'}
							autoComplete="current-password"
							class="px-2.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<p class="text-red-600 text-center w-full text-sm">
					{$loginStoreSnapshot.loginErrorMessage}
				</p>

				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						{#if $loginStoreSnapshot.loginApiCalled}
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
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
						{:else}
							Sign In
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
