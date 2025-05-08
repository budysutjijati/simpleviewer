// simpleviewer/data/SavedSearch.js
//
// Fetches Saved Search results with dynamic criteria.
// Uses filterExpression + search.create pattern for advanced filter compatibility.
// Supports CURRENT_USER placeholders and includes debugging.

export async function fetchSearchResults(savedSearchId, additionalFilters = []) {
	return new Promise((resolve, reject) => {
		require(['N/search', 'N/runtime'], (search, runtime) => {
			try {
				const userId = runtime.getCurrentUser().id;

				// Debug log: Show current user ID
				console.log(`DEBUG: Current User ID -> ${userId}`);

				// Load the saved search
				const loadedSearch = search.load({ id: savedSearchId });

				// Extract filter expression and columns
				const loadedFilterExpression = loadedSearch.filterExpression;
				const loadedColumns = loadedSearch.columns;
				const loadedSearchType = loadedSearch.searchType;

				// Start building new filter expression
				const updatedFilters = [];

				// Add original filter expression if exists
				if (loadedFilterExpression) {
					updatedFilters.push(loadedFilterExpression);
				}

				// Add dynamic filters
				(additionalFilters || []).forEach(filter => {
					const resolvedValuesRaw = Array.isArray(filter.values) ? filter.values : [];

					const resolvedValues = resolvedValuesRaw
						.map(value => value === 'CURRENT_USER' ? userId : value)
						.filter(value => value !== undefined && value !== null);

					if (resolvedValues.length > 0) {
						// Add filter with AND
						if (updatedFilters.length > 0) {
							updatedFilters.push('AND');
						}

						updatedFilters.push([filter.name, filter.operator, resolvedValues]);
					}
				});

				// Debug log: Show final filter expression
				logSearchFilterExpression(updatedFilters);

				// Create a new search with combined filters
				const newSearch = search.create({
					type: loadedSearchType,
					filters: updatedFilters,
					columns: loadedColumns
				});

				const columns = loadedColumns.map(col => ({
					name: col.name || col.fieldId,
					label: col.label || col.name,
					binding: col.name || col.fieldId,
					type: 'text',
					stretchFactor: 1,
					minWidth: 120
				}));

				const rows = [];

				// Run the new search
				newSearch.run().each(result => {
					rows.push(convertResult(columns, result));
					return true;
				});

				resolve({ columns, rows });
			} catch (error) {
				reject(error);
			}
		});
	});
}

function convertResult(columns, result) {
	const row = {};
	columns.forEach(col => {
		const value = result.getText({ name: col.name }) ?? result.getValue({ name: col.name });
		row[col.binding] = value ?? '';
	});
	return row;
}

function logSearchFilterExpression(expression) {
	console.log('DEBUG: Final Saved Search Filter Expression --------------------');
	console.log(JSON.stringify(expression, null, 2));
	console.log('----------------------------------------------------------------');
}