// simpleviewer/App.jsx
//
// Main application component for SimpleViewer SPA.
// Handles application header, saved search loading, filtering, refreshing, exporting, and error display.

import { useLayoutEffect, useState, SystemIcon } from '@uif-js/core';
import { ContentPanel, StackPanel, ApplicationHeader, TextBox, Button, ToolBar, Text, BannerPanel, BannerMessage } from '@uif-js/component';
import SearchResult from './components/SearchResult';
import * as SavedSearch from './data/SavedSearch';
import config from './config';

export default function App() {

	// Is needed to trigger the refresh whenever the refresh rsults button is clicked
	const [refreshCount, setRefreshCount] = useState(0);

	const [loading, setLoading] = useState(false);

	// Is needed for the DataGrid. Storing it in state ensures that UIF will re-render the DataGrid when
	// new column definitions are loaded (e.g. after refresh or new saved search).
	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);

	// Is needed for the client-side filter, without re-fetching data from the saved search
	const [filterText, setFilterText] = useState('');

	// Holds the current error or notice message to display in the BannerMessage.
	// When set, it triggers the UI to show a dismissible message to the user.
	const [bannerMessage, setBannerMessage] = useState(null);

	/**
	 * Loads the saved search with config + criteria
	 */
	const loadSearch = async () => {
		// Sets the loading state to true so the UI can show a loading indicator or skeleton.
		setLoading(true);

		// Clear it in order to 'reset' the DataGrid, both for setColumns and setRows
		setColumns([]);
		setRows([]);

		// Clear any existing error/notice message
		setBannerMessage(null);

		try {
			// Execute the saved search with optional additional filters from config.
			// The result includes column metadata and row data, formatted for the DataGrid.
			// Once fetched, we update the UI state to display the new search results.
			const { columns, rows } = await SavedSearch.fetchSearchResults(config.savedSearchId, config.savedSearchCriteria);
			setColumns(columns);
			setRows(rows);

			if (rows.length === 0) {
				setBannerMessage({
					type: BannerMessage.Type.INFO,
					message: 'No results found for this saved search.'
				});
			}
		} catch (err) {
			setColumns([]);
			setRows([]);
			setBannerMessage({
				type: BannerMessage.Type.ERROR,
				message: `Error loading saved search: ${err.message || 'Unknown error'}`
			});
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Re-run the saved search whenever the refreshCount changes.
	 * This allows the "Refresh Results" button to re-trigger data loading without changing other state.
	 * useLayoutEffect(() => {
	 */
	useLayoutEffect(() => {
		loadSearch();
	}, [refreshCount]);

	/**
	 * Client-side filter
	 */
	const filteredRows = rows.filter(row =>
		Object.values(row).some(value =>
			String(value ?? '').toLowerCase().includes(filterText.toLowerCase())
		)
	);

	/**
	 * Export to CSV
	 */
	const exportCsv = () => {
		if (!filteredRows.length) return;

		const csvRows = [];
		const headers = columns.map(col => col.label);
		csvRows.push(headers.join(','));

		filteredRows.forEach(row => {
			const values = columns.map(col => `"${(row[col.binding] ?? '').replace(/"/g, '""')}"`);
			csvRows.push(values.join(','));
		});

		const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', 'export.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<ContentPanel>
			<StackPanel.Vertical outerGap={StackPanel.GapSize.MEDIUM}>
				<StackPanel.Item shrink={0}>
					<ApplicationHeader title={config.applicationTitle} subtitle={config.applicationSubtitle} icon={config.applicationIcon} />
				</StackPanel.Item>

				<StackPanel.Item shrink={0}>
					<BannerPanel manual={true} position={BannerPanel.Position.RELATIVE}>
						{bannerMessage && (
							<BannerMessage
								type={bannerMessage.type}
								title={bannerMessage.type === BannerMessage.Type.ERROR ? 'Error' : 'Notice'}
								showCloseButton={true}
								on={{ [BannerMessage.Event.CLOSED]: () => setBannerMessage(null) }}
							>
								{bannerMessage.message}
							</BannerMessage>
						)}
					</BannerPanel>
				</StackPanel.Item>

				<StackPanel.Item shrink={0}>
					<ToolBar>
						<ToolBar.Group>
							<TextBox
								placeholder="Filter rows..."
								text={filterText}
								onTextChanged={({ text }) => setFilterText(text)}
								size={TextBox.Size.XL}
							/>
						</ToolBar.Group>
						<ToolBar.Group>
							<Button
								label="Refresh Results"
								icon={SystemIcon.REFRESH}
								visualStyle={Button.VisualStyle.TOOLBAR}
								action={() => setRefreshCount(count => count + 1)}
							/>
							<Button
								label="Export To CSV"
								icon={SystemIcon.SAVE}
								visualStyle={Button.VisualStyle.TOOLBAR}
								action={exportCsv}
								enabled={filteredRows.length > 0}
							/>
						</ToolBar.Group>
					</ToolBar>
				</StackPanel.Item>

				<StackPanel.Item grow={1}>
					<ContentPanel>
						<SearchResult loading={loading} columns={columns} rows={filteredRows} />
					</ContentPanel>
				</StackPanel.Item>
			</StackPanel.Vertical>
		</ContentPanel>
	);
}