/**
 * SearchResult.jsx
 * Component responsible for rendering saved search results inside a DataGrid.
 */

import { Skeleton, DataGrid, ContentPanel, StackPanel } from '@uif-js/component';
import { ArrayDataSource } from '@uif-js/core';
import { useMemo } from '@uif-js/core';

export default function SearchResult({ loading, columns, rows }) {
	const dataSource = useMemo(() => new ArrayDataSource(rows ?? []), [rows]);

	if (loading) {
		return (
			<StackPanel.Vertical>
				<StackPanel.Item grow={1}>
					<ContentPanel outerGap={ContentPanel.GapSize.S}>
						<Skeleton.Table rows={10} columns={5} />
					</ContentPanel>
				</StackPanel.Item>
			</StackPanel.Vertical>
		);
	}

	const gridColumns = columns.map((col) => ({
		name: col.name,
		label: col.label,
		binding: col.binding,
		type: col.type,
		stretchFactor: 1,
		minWidth: 120
	}));

	return (
		<ContentPanel>
			<DataGrid
				editable={false}
				columns={gridColumns}
				dataSource={dataSource}
				columnStretch={true}
			/>
		</ContentPanel>
	);
}
