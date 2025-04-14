# Geologic Map of Ice Age Trail App

This interactive application displays a geologic map of the Ice Age Trail. It features detailed datasets on geology, trail segments, parking, camping, potable water, and more. Users can perform spatial queries on selected trail segments to highlight nearby features and get an aggregated summary via a popup. A Survey123 link is also provided for users to report trail issues.

## Features

- **Interactive Map:**  
  Displays a basemap (ArcGIS API for JavaScript v4.25) centered on Marathon County with multiple geologic and trail-related feature layers.

- **Spatial Query Widget:**  
  - **Segment Lookup:** Auto-complete functionality helps users find and select specific trail segments.
  - **Buffer Query:** Users can define a buffer (in meters) around a selected trail segment.
  - **Results Popup:** Features within the buffer are highlighted with a teal-blue outline, and query results are summarized in a popup window.
  
- **Feature Layers:**  
  The app includes layers for:
  - Bedrock Geology
  - Glacial Geology
  - Trail Sections & Connecting Routes
  - Parking Areas
  - Camping Areas
  - Potable Water
  - Trail Communities
  - Trail Hazards & Maintenance Issues

- **Report Issue:**  
  A **Report Trail Issue** button redirects users to a Survey123 form to report hazards or maintenance needs.

- **Responsive UI Elements:**  
  Includes a welcome modal, layer list, basemap gallery, locate widget, and search widget for enhanced user interaction.

## Technology Stack

- **ArcGIS API for JavaScript v4.25:**  
  Provides mapping functionality, feature layers, and UI widgets.
- **HTML5, CSS3, and JavaScript:**  
  Used for the application structure, styling, and client-side logic.
- **Survey123:**  
  Integrated link for reporting trail issues.

## Installation

1. **Clone or Download the Repository:**

   ```bash
   git clone https://github.com/yourusername/ice-age-trail-app.git
