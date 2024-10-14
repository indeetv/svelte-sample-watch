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

<table class="min-w-full border-collapse border border-gray-200">
	<thead>
		<tr>
			{#if tableData.length > 0}
				{#if 'name' in tableData[0]}
					<th class="border border-gray-300 p-2 capitalize text-gray-700 bg-gray-200">name</th>
				{/if}
				{#each getNonNameHeaders(tableData[0]) as header}
					<th class="border border-gray-300 p-2 capitalize text-gray-700 bg-gray-200">{header}</th>
				{/each}
			{/if}
		</tr>
	</thead>
	<tbody>
		{#each tableData as item, index}
			<tr>
				{#if 'name' in item}
					<td class="border border-gray-300 p-2">
						<button class="text-blue-500 underline" on:click={() => handleNameClick(item.key)}>
							{item.name}
						</button>
					</td>
				{/if}
				{#each getNonNameHeaders(item) as header}
					<td class="border border-gray-300 p-2">
						{#if header === 'poster' || header === 'logo' || header === 'header'}
							<img src={item[header]} alt="Poster" class="w-24 object-cover rounded-lg" />
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
