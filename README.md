
# SimpleViewer SPA

## Overview

SimpleViewer SPA is a NetSuite Single Page Application (SPA) built using NetSuite’s UIF (User Interface Framework) platform. It is designed to provide a flexible, reusable saved search viewer to allow users (even those with limited NetSuite roles, like Vendor Center users) to view and export saved search results.

This SPA is fully configurable using a `config.js` file, making it easy to deploy for various purposes without modifying the core code.

## Features

- Render any saved search results
- Define and append additional saved search criteria dynamically
- View data in a dynamic and interactive DataGrid
- Filter results client-side using a text box
- Export filtered results to CSV
- Display user-friendly error or info messages using BannerPanel / BannerMessage
- Define application header title, subtitle, and icon

## Deployment & Usage

### 1. Configure the SPA

Before deploying, adjust the `config.js` file in the `simpleviewer/` directory.

```javascript
// simpleviewer/config.js
import { SystemIcon } from '@uif-js/core';

export default {
	savedSearchId: 'customsearch_active_customers',
	applicationTitle: 'SimpleViewer',
	applicationSubtitle: 'My Customers',
	applicationIcon: SystemIcon.PERSON,

	// Additional filters to be appended to the saved search
	savedSearchCriteria: [
		{
			name: 'salesrep',
			operator: 'IS',
			values: ['CURRENT_USER'] // Use "CURRENT_USER" to automatically use the runtime user id
		}
	]
};
```

**Notes:**
- The `savedSearchId` is mandatory.
- `applicationTitle`, `applicationSubtitle`, and `applicationIcon` are optional but recommended.
- `savedSearchCriteria` The savedSearchCriteria property is optional. 
  - If omitted, no additional filters will be applied. 
  - If no criteria is needed but the property is defined, provide an empty array ```[]``` to ensure proper processing. 

### 2. Deployment

Deploy the SimpleViewer SPA into your NetSuite account using the SuiteCloud Development Framework.

+ `npm i` to install required dependencies
+ `suitecloud account:setup` to set up the  account where the app is to be deployed
+ `npm run build` to build the project inside a new `build` directory
+ `npm run deploy` to bundle the built app into the `/src/FileCabinet/SuiteApps` folder and deploy it into the configured account

#### Directory structure (Example)

```
simpleviewer/
├── SpaClient.js
├── SpaServer.js
├── App.jsx
├── config.js
├── /components
│   ├── SearchResult.jsx
├── /data
│   └── SavedSearch.js
```

### 3. Running the SPA

Once deployed, access the Suitelet URL.

The app will automatically:
- Load the saved search defined in `config.js`
- Apply any additional saved search criteria
- Render the result into the DataGrid
- Allow client-side filtering and CSV export

## Dynamic User ID Filter

You can define `CURRENT_USER` as a value in `savedSearchCriteria` values. During runtime, this is replaced with the user id (passed from `SpaServer.js` into the `App.jsx` via context).

This allows use-cases like:
- Viewing only data relevant to the logged-in user
- Vendor Center users seeing only their related records

## Error Handling

Errors such as invalid saved search or empty results are gracefully handled using the `BannerPanel` and `BannerMessage` components. This keeps the user informed without breaking the application.

## CSV Export

Users can easily export filtered results by clicking the "Export to CSV" button.

This uses client-side logic only (no SuiteScript call), ensuring quick and seamless export of what is visible in the DataGrid.

## Refreshing Saved Search Results

A "Refresh Results" button is available (uses same button as previously used for "Load Saved Search").
This forces reloading of saved search results, useful when saved search criteria may have changed.

## Limitations

- Currently only supports loading saved search results (SuiteQL support can be added later).
- For multi-instance deployments, additional setup is required. Not only must the SPA id be unique, but also the associated object metadata file (such as `custspa_simpleviewer.xml`) must be duplicated and adjusted accordingly to reflect a new SPA ID and related metadata. This is a fundamental requirement for SPAs in NetSuite, unlike Suitelets where script deployments can easily be duplicated and configured with script parameters.