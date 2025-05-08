# SimpleViewer SPA - Technical Overview

---

## Overview

SimpleViewer SPA is a NetSuite Single Page Application (SPA) built using NetSuite’s UIF (User Interface Framework). It provides a flexible way to view Saved Search results with a configurable approach that allows dynamic filtering, CSV export, and personalized user-based data display.

The SPA is designed to be deployment-friendly by using a `config.js` file to control saved search, application header, and additional search criteria.

## Directory Structure (Base Path: simpleviewer)

```
simpleviewer/
├── SpaServer.js
├── SpaClient.js
├── App.jsx
├── config.js
├── /components
│   └── SearchResult.jsx
├── /data
│   └── SavedSearch.js
```

---

## Application Initialization (SPA Startup)

**Relevant Scripts:**
- simpleviewer/SpaClient.js
- simpleviewer/App.jsx
- simpleviewer/data/SavedSearch.js

**Process:**

1. `SpaClient.js` initializes the SPA and renders `App.jsx` using `context.setContent(<App />)`.
2. `App.jsx` reads the configuration from `config.js` to determine which saved search to load and how the ApplicationHeader should appear (title, subtitle, icon).
3. `App.jsx` triggers `SavedSearch.fetchSearchResults` with savedSearchId and optional additional criteria (`savedSearchCriteria`).
4. Saved search results (columns + rows) are returned and stored in state.
5. `SearchResult.jsx` renders the DataGrid with the returned data.
6. The SPA is ready for user interaction.

## Filtering DataGrid (Textbox Filter)

**Relevant Scripts:**
- simpleviewer/App.jsx
- simpleviewer/components/SearchResult.jsx

**Process:**

1. User types in the filter TextBox.
2. `App.jsx` filters the rows locally based on the filter text.
3. Filtered results are passed to `SearchResult.jsx`.
4. `SearchResult.jsx` re-renders the DataGrid with only matching rows.

**Note:** This is a client-side filter and does not re-execute the Saved Search.

## Refreshing Saved Search Results (Refresh Button)

**Relevant Scripts:**
- simpleviewer/App.jsx
- simpleviewer/data/SavedSearch.js

**Process:**

1. User clicks the "Refresh Results" button.
2. `App.jsx` re-invokes `SavedSearch.fetchSearchResults` using the savedSearchId and additional criteria.
3. The latest saved search results are fetched and rendered.
4. Client-side filter (if applied) remains active after refresh.

## Dynamic User Context & Additional Criteria (savedSearchCriteria)

**Relevant Scripts:**
- simpleviewer/App.jsx
- simpleviewer/config.js
- simpleviewer/data/SavedSearch.js

**Process:**

1. `config.js` defines `savedSearchCriteria` (optional) for additional filters.
2. `CURRENT_USER` placeholders are replaced with the runtime user ID during `SavedSearch.js` execution.
3. Combined filters (SavedSearch + Additional Criteria) are executed using `search.create` + `filterExpression` (ensures advanced criteria support).
4. Results respect both saved search filters and the dynamic criteria.

## CSV Export

**Relevant Scripts:**
- simpleviewer/App.jsx

**Process:**

1. User clicks "Export to CSV".
2. `App.jsx` gathers current `columns` and `filteredRows`.
3. CSV blob is generated and downloaded to the user's computer.
4. Only visible/filtered data is exported.

## Error Handling (BannerPanel and BannerMessage)

**Relevant Scripts:**
- simpleviewer/App.jsx

**Process:**

1. Errors during saved search loading or execution are caught in `App.jsx`.
2. A `bannerMessage` state is set with error info.
3. `BannerPanel` and `BannerMessage` display the error in the SPA.
4. User can dismiss the message by clicking close.

## Summary

| Action | Backend Involved | UI Component | Flow |
|--------|------------------|--------------|------|
| App Load | Yes (fetch configured saved search) | App.jsx | config.js → SavedSearch.js → App.jsx → DataGrid |
| Filter Rows | No | App.jsx + SearchResult.jsx | TextBox → Filter → DataGrid |
| Refresh Saved Search | Yes (SuiteScript SavedSearch) | App.jsx + SearchResult.jsx | Refresh Button → SavedSearch.js → App.jsx → DataGrid |
| Error Display | No (UI only) | App.jsx + BannerPanel + BannerMessage | Errors → BannerMessage (with close option) |
| Export CSV | No | App.jsx | Frontend generation → download |

## Limitations

- Currently supports only Saved Search (SuiteQL is not yet supported).
- For multi-instance deployments, additional setup is required:
    - Each SPA ID must be unique.
    - The related metadata object (e.g., `custspa_simpleviewer.xml`) must be duplicated and adjusted to create a new deployment. Unlike Suitelets, SPAs require this for each distinct deployment.

## Conclusion

The SimpleViewer SPA offers a highly flexible and user-friendly interface for viewing Saved Search results in NetSuite. Through `config.js`, deployment and customization are straightforward. Advanced saved search handling, dynamic user filters, CSV export, and interactive filtering create a complete data viewing solution with minimal configuration and no code changes required per deployment.


---