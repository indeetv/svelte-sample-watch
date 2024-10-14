<script lang="ts">
	import { goto } from '$app/navigation';

	export let tableData: Array<Record<string, any>> = [];
	export let pageToRedirect: string = '';
	export let queryNameToAdd: string = '';
	export let preserveQueryParams: string = '';

	const handleNameClick = (name: string) => {
		const encodedName = encodeURIComponent(name);
		goto(
			`/${pageToRedirect}?${queryNameToAdd}=${encodedName}${preserveQueryParams ? `&${preserveQueryParams}` : ''}`
		);
	};

	const getNonNameHeaders = (item: Record<string, any>) =>
		Object.keys(item).filter((header) => header !== 'name');
</script>

<table
	class="table-auto w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400"
>
	<thead class="text-xs text-blue-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
		<tr>
			{#if tableData.length > 0}
				{#if 'name' in tableData[0]}
					<th class="px-6 py-3">name</th>
				{/if}
				{#each getNonNameHeaders(tableData[0]) as header}
					<th class="px-6 py-3">{header}</th>
				{/each}
			{/if}
		</tr>
	</thead>
	<tbody>
		{#each tableData as item, index}
			<tr
				on:click={() => handleNameClick(item.key)}
				class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
			>
				{#if 'name' in item}
					<td
						class="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
					>
						<button class="text-blue-500 underline">
							{item.name}
						</button>
					</td>
				{/if}
				{#each getNonNameHeaders(item) as header}
					<td
						class="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
					>
						{#if header === 'poster' || header === 'logo' || header === 'header'}
							{#if item[header]}
								<div class="flex justify-center">
									<img src={item[header]} alt="Poster" class="w-16 object-cover rounded-lg" />
								</div>
							{:else}
								<span
									class="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded capitalize"
								>
									{header} Image Unavailable
								</span>
							{/if}
						{:else if header === 'expired'}
							{#if item[header] === true}
								<span class="bg-red-200 text-red-950 text-xs font-medium me-2 px-2.5 py-0.5 rounded"
									>Expired</span
								>
							{:else}
								<span
									class="bg-green-200 text-green-950 text-xs font-medium me-2 px-2.5 py-0.5 rounded"
									>Active</span
								>
							{/if}
						{:else}
							{item[header]}
						{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
