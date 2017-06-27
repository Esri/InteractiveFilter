{
	"configurationSettings": [{
		"category": "General",
		"fields": [{
			"type": "webmap",
			"label": "Select a map"
		}, 
		{
			"placeHolder": "Defaults to map title",
			"label": "Application title",
			"fieldName": "title",
			"type": "string",
			"tooltip": "Defaults to map title"
		}, {
			"type": "appproxies"
		}]
	}, {
		"category": "Theme",
		"fields": [{
			"type": "subcategory",
			"label": "Colors"
		}, {
			"type": "color",
			"fieldName": "theme",
			"tooltip": "Color theme to use",
			"label": "Header background color",
			"sharedThemeProperty": "header.background"
		}, {
			"type": "color",
			"fieldName": "color",
			"tooltip": "Header Text color",
			"label": "Header Text Color",
			"sharedThemeProperty": "header.text"
		}, {
			"type": "color",
			"fieldName": "bodyColor",
			"tooltip": "Panel body text color",
			"label": "Panel Text Color",
			"sharedThemeProperty": "body.text"
		}, {
			"type": "color",
			"fieldName": "bodyBg",
			"tooltip": "Panel body background color",
			"label": "Panel Background Color",
			"sharedThemeProperty": "body.background"
		}, {
			"type": "color",
			"fieldName": "buttonColor",
			"tooltip": "Button color",
			"label": "Button Text Color",
			"sharedThemeProperty": "button.text"
		}, {
			"type": "color",
			"fieldName": "buttonBg",
			"tooltip": "Button color",
			"label": "Button Color",
			"sharedThemeProperty": "button.background"
		}, {
			"type": "subcategory",
			"label": "Custom Layout Options"
		}, {
			"type": "paragraph",
			"value": "Use the Custom css option to paste css that overwrites rules in the app."
		}, {
			"type": "string",
			"fieldName": "customstyle",
			"tooltip": "Custom css",
			"label": "Custom css"
		}]
	}, {
		"category": "<b>Options</b>",
		"fields": [{
			"type": "paragraph",
			"value": "Add one or more of the following widgets to the application."
		}, {
			"type": "boolean",
			"fieldName": "home",
			"label": "Full extent button"
		}, {
			"type": "boolean",
			"fieldName": "locate",
			"label": "Location button"
		}, {
			"type": "boolean",
			"fieldName": "legend",
			"label": "Legend"
		}, {
			"type": "boolean",
			"fieldName": "legendOpen",
			"label": "Open legend on load"
		}]
	}, {
		"category": "Filter",
		"fields": [{
			"type": "paragraph",
			"value": "Use the filter text to provide instructions that explains to users how to use the filter.  This could also include descriptive text about the map."
		}, {
			"placeHolder": "Filter the layer by specifying values.",
			"label": "Filter Text",
			"fieldName": "filterInstructions",
			"type": "string",
			"tooltip": "Specify filter instructions"
		}, {
			"type": "subcategory",
			"label": "Filter Buttons"
		}, {
			"placeHolder": "Defaults to Apply",
			"label": "Filter button Text",
			"fieldName": "button_text",
			"type": "string",
			"tooltip": "Enter button text"
		}, {
			"type": "paragraph",
			"value": "Display a zoom button that allows application users to zoom to the filtered results. Only applicable for hosted feature services"
		}, {
			"type": "boolean",
			"fieldName": "displayZoom",
			"label": "Display zoom button"
		}, {
			"type": "paragraph",
			"value": "Display a clear button that allows application users to remove the applied filter."
		}, {
			"type": "boolean",
			"fieldName": "displayClear",
			"label": "Display clear button"
		}, {
			"type": "subcategory",
			"label": "Filter Behavior"
		}, {
			"type": "boolean",
			"fieldName": "filterOnLoad",
			"label": "Apply filters when app loads."
		}, {
			"type": "paragraph",
			"value": "Set Display dropdown to true if your app contains multiple filters and you want to display a dropdown list of the filters and allow application users to select and view the options for one filter at a time."
		}, {
			"type": "boolean",
			"fieldName": "filterDropdown",
			"label": "Display dropdown"
		}, {
			"type": "paragraph",
			"value": "Set Filter by layer to true to apply only the filters associated with that layer. When false filters associated with all layers will be applied."
		}, {
			"type": "boolean",
			"fieldName": "toggleFilterVisibility",
			"label": "Filter by layer"
		}, {
			"type": "paragraph",
			"value": "When true string values will appear in a dropdown list of unique values."
		}, {
			"type": "boolean",
			"fieldName": "uniqueVals",
			"label": "Display unique values in dropdown list"
		}]
	}, {
		"category": "Search",
		"fields": [{
			"type": "paragraph",
			"value": "Enable search to allow users to find a location or data in the map. Configure the search settings to refine the experience in your app by setting the default search resource, placeholder text, etc."
		}, {
			"type": "boolean",
			"fieldName": "search",
			"label": "Enable search tool"
		}, {
			"type": "search",
			"fieldName": "searchConfig",
			"label": "Configure search tool"
		}]
	}
	],
	"values": {
		"home": true,
		"locate": true,
		"search": true,
		"color": "#fff",
		"theme": "#666",
		"bodyBg": "#fff",
		"bodyColor": "#666",
		"buttonColor": "#fff",
		"buttonBg": "#666",
		"filterDropdown": false,
		"filterOnLoad": true,
		"displayZoom": false,
		"displayClear": false,
		"toggleFilterVisibility": false,
		"legend": false,
		"legendOpen": false,
		"uniqueVals": false
	}
}