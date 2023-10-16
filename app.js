require([
    "esri/Map", 
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/widgets/Expand",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/widgets/Editor",
    "esri/widgets/Legend",
    "esri/widgets/LayerList"
  ], function(Map, MapView, BasemapGallery, Locate, Search, Expand, FeatureLayer, SimpleRender, Editor, Legend, LayerList) {

   const config = {
    apiKey: "AAPKddba40c16f2c479188ee7654064642bcKj2RV3mAHrsiJS_6TRKUzkim46MXbNeE97z3bQn0zq3zyX67A3i8hBg6lEH0Fxl_",
    urls: {
        sections:"https://services.arcgis.com/EeCmkqXss9GYEKIZ/arcgis/rest/services/IAT_Segments_CR/FeatureServer",
        parking: "https://services.arcgis.com/EeCmkqXss9GYEKIZ/arcgis/rest/services/IAT_Parking/FeatureServer",
        camping: "https://services.arcgis.com/EeCmkqXss9GYEKIZ/arcgis/rest/services/IAT_Camping1/FeatureServer",
        communities: "https://services.arcgis.com/EeCmkqXss9GYEKIZ/arcgis/rest/services/Ice_Age_Trail_Communities_View/FeatureServer",
        water: "https://services.arcgis.com/EeCmkqXss9GYEKIZ/arcgis/rest/services/IAT_Potable_Water/FeatureServer",
        hazards: "https://services1.arcgis.com/kkX9mRo34fTGAX96/arcgis/rest/services/survey123_28999d44a3004264b788805abd470022_results/FeatureServer",
        mySegments: "https://services1.arcgis.com/kkX9mRo34fTGAX96/arcgis/rest/services/Completed_IAT_Segments/FeatureServer"
    },
    symbols: {
        community: "https://ecolville.github.io/TrailGuard/Generic-Trail-Community-Logo.png",
        hazard: "https://ecolville.github.io/TrailGuard/hazard.png",
    }   
   } 
    const map = new Map({
      basemap: "arcgis-light-gray" //basemap layer
    });

    //view of Wisconsin
    const view = new MapView({
      map:map,
      center: [-89.585655,  43.999906], //longitude, latitude
      zoom: 7, //zoom level
      container: "viewDiv" //Div element
    });

    //define a popup template for the sections feature layer
    const sectionsPopupTemplate = {
      title: "Section or Connecting Route",
      content: [
        {
          type: "text",
          text: "<b>Name: </b> {Segment} <br><b>Type: </b> {Status} <br>"
        },
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "length_mi",
              label: "Length",
              format: {
                places: 1,
                digitSeparator: true
              }
            }
          ]
        }
      ]
    };

    //define a popup template for the parking feature layer
    const parkingPopupTemplate = {
      title: "Parking Area",
      content: `<b>Parking Type: </b> {Parking_Type} <br>
                <b>Description: </b> {Description} <br>
                <b>Fee: </b> {Fee} <br>
                <b>Overnight Parking: </b> {Overnight_Park}<br>
                <b>Comment: </b> {Comment} <br>`
    };

    //define a popup template for the camping feature layer
    const campingPopupTemplate = {
      title: "Camping Area",
      content: `<b>Type: </b> {Camp_Type} <br>
                <b># sites: </b> {Num_sites} <br>
                <b>Water: </b> {Water} <br>
                <b>Toilet: </b> {Toilet} <br>
                <b>Showers: </b> {Showers}<br>
                <b>Description: </b> {Description}`
    };

    //define a popup template for the water feature layer
    const waterPopupTemplate = {
      title: "Potential Water Source",
      content: `<b>Potability: </b> {Potability} <br>
                <b>Reliability: </b> {Reliability} <br>
                <b>Description: </b> {Description}`
    };
    
    //function to create feature layers
    function createFeatureLayer(url, title, outFields, popupTemplate) {
        return new FeatureLayer({
          url,
          title,
          outFields,
          popupTemplate
        });
      }
      
      // create IAT sections layer
      const sections = createFeatureLayer(
        config.urls.sections,
        "IAT Sections or Connecting Routes",
        ["Segment", "length_mi", "Status"],
        sectionsPopupTemplate
      );
      map.add(sections);
    
      //create IAT parking areas layer
      const parking = createFeatureLayer(
        config.urls.parking,
        "Parking Areas",
        ["Parking_Type", "Comment", "Description", "Fee", "Overnight_Park"],
        parkingPopupTemplate
      );
      map.add(parking)

    //create camping areas layer
    const camping = createFeatureLayer(
        config.urls.camping,
        "Camping Areas",
        ["Camp_Type", "Num_Sites", "Water", "Toilet", "Showers", "Description"],
        campingPopupTemplate
    );
    map.add(camping);

    //create water layer
    const water = createFeatureLayer(
        config.urls.water,
        "Potable Water",
        ["Potability", "Reliability", "Description"],
        waterPopupTemplate
    ); 
    map.add(water);   

    //const for community icon
    const communityRenderer = {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: config.symbols.community,
        width: "18px",
        height: "18px"
      }
    };

    //add the feature layer for IAT communities
    const communities = new FeatureLayer({
      url: config.urls.communities,
      title: "Trail Communities",
      renderer: communityRenderer,
      labelingInfo: [communityLabels]
  });
  map.add(communities);

  //add popup template
  communities.popupTemplate = {
    title: "{Name}"
  }

  //create hazards layer that users can add data to
  const hazards = new FeatureLayer ({
    url: config.urls.hazard,
    title: "Trail Hazards & Maintenance Issues",
    renderer: {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: config.symbols.hazard,
        width: "20px",
        height: "20px"
      },
    }
  });
  map.add(hazards);

  //popuptemplate for the trail hazards
  hazards.popupTemplate = {
    title: "Trail Hazards and Maintenance Issue",
    content: `<b>Date of Observation: </b> {observation_date_and_time} <br>
              <b>Location: </b> {trail_segment_name} {mile_marker} <br>
              <b>Hazard/Maintenence Need: </b> {hazardmaintenance_need} <br>
              <b>Description: </b> {description}<br>
              <b>Severity of Issue: </b> {level_of_severity} <br>`
  };

  //expand widget for basemap gallery
  const bgExpand = new Expand({
    view: view,
    content: new BasemapGallery({
      view: view
    })
  });
  view.ui.add(bgExpand, "top-right");

  //create a locate widget instance and add it to the view
  const locate = new Locate({
        view: view
      });
      view.ui.add(locate, "top-left");

      // Create a Search widget instance and add it to the view
      const search = new Search({
        view: view,
        suggestionsEnabled: true,
        maxSuggestions: 3
      });
      
      //expand the search widget
     const searchExpand = new Expand({
        view: view,
        content: search,
        expandIconClass: "esri-icon-search",
        expandTooltip: "Search",
        expanded: false
      })

      //add the search widget to the top left corner of the view
        view.ui.add(searchExpand, {
          position: "top-left",
          index: 2
        });

      // Create a Legend widget instance and add it to the view
      const legend = new Legend({
        view: view,
        respectLayerVisibility: true,
      });

      const legendExpand = new Expand({
        view: view,
        content: legend,
        expandIconClass: "esri-icon-layer-list",
        expandTooltip: "Legend",
        expanded: window.innerWidth > 768 //expand in desktop mode
      });
      view.ui.add(legendExpand, "bottom-left");

     // Create a LayerList widget
      const layerList = new LayerList({
        view: view
      });

      // Put the LayerList widget into an Expand widget
      const layerListExpand = new Expand({
        view: view,
        content: layerList,
        expandIconClass: "esri-icon-layer-list",  
        expandTooltip: "Layers"  // Tooltip text for the button
      });

      // Add the Expand widget to the view
      view.ui.add(layerListExpand, "top-right");
  
      //create yellow line for mySegments
      const yellowLineSymbol = new SimpleLineSymbol({
        color: new Color([255, 255, 0]),
        width: "2px",
        style: "solid"
      });

      //render yellow line for mySegments
      const mySegmentsRenderer = new SimpleRender ({
        symbol: yellowLineSymbol
      });

      //define the popup template for the editable mySegment layer
      const mySegmentPopupTemplate = {
          title: "{SegmentName} Segment Completed",
          content: "on {DateCompleted} <br> {Length_mi} miles"
        }

      //create mySegments Feature Layer
      const mySegments = new FeatureLayer ({
        url: config.urls.mySegments,
        renderer: mySegmentsRenderer,
           
        //adding the popup here
        popupTemplate: mySegmentPopupTemplate,
        outFields: ["SegmentName", "DateCompleted", "Length_mi"],
        title: "Segment Completed"
      });

      //adding the feature layer to the map
      map.add(mySegments);

      //set the line layer's LayerInfo
      const lineInfos = {
        layer: mySegments
      }

      //create editor widget instance and add it to the view
      const editor = new Editor({
        view: view,
        layerInfos: [lineInfos]
      }); 

      //expand the editor widget
      const editorExpand = new Expand({
        view: view,
        content: editor,
        expandIconClass: "esri-icon-edit",
        expandTooltip: "Editor",
        expanded: true
      });

      //add the editor widget to the view
      view.ui.add(editorExpand, "top-right");
     
});