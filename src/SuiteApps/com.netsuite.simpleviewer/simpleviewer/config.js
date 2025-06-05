// simpleviewer/config.js
//
// SPA Configuration for SimpleViewer.
// Controls deployment-specific parameters such as which saved search to run, title/subtitle/icons, and dynamic saved search criteria.
//
// How to use:
// - savedSearchId: REQUIRED. Internal ID of the saved search to run.
// - applicationTitle: Optional. Title for the Application Header.
// - applicationSubtitle: Optional. Subtitle for the Application Header.
// - applicationIcon: Optional. Application Header icon (SystemIcon).
// - savedSearchCriteria: Optional. Additional filters to be applied when running the saved search.
//   Leave undefined or empty array [] if no extra filters needed.
// - You can use the special value "CURRENT_USER" in a filter's values to automatically substitute the runtime user ID.

import { SystemIcon } from '@uif-js/core';

export default {
	savedSearchId: 'customsearch_active_customers',
	applicationTitle: 'SimpleViewer',
	applicationSubtitle: 'My Customers',
	applicationIcon: SystemIcon.PERSON,

	// Optional: Additional criteria to append to saved search
	savedSearchCriteria: [
		// {
		// 	name: 'salesrep',
		// 	operator: 'IS',
		// 	values: ['CURRENT_USER'] // dynamically replaced with runtime user ID from SpaServer
		// }
	]
};