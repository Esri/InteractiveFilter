define([
  "dojo/ready",
  "dojo/_base/declare",

  "dojo/query",
  "dojo/_base/lang",
  "dojo/_base/kernel",
  "dojo/dom-construct",
  "dijit/registry",
  "esri/arcgis/utils",
  "esri/lang",
  "dojo/on",
  "application/Drawer",
  "application/Filter",
  "dojo/dom-class",
  "esri/dijit/LocateButton",
  "esri/dijit/HomeButton"
], function (
  ready, declare, query, lang, kernel, domConstruct, registry, arcgisUtils, esriLang, on, Drawer, Filter, domClass, LocateButton, HomeButton) {
  return declare("", null, {
    config: {},
    theme: null,
    color: null,
    startup: function (config) {

      document.documentElement.lang = kernel.locale;
      // config will contain application and user defined info for the template such as i18n strings, the web map id
      // and application id
      // any url parameters and any application specific configuration information.
      if (config) {
        this.config = config;
        // responsive drawer
        this._drawer = new Drawer({
          showDrawerSize: 850,
          // Pixel size when the drawer is automatically opened
          borderContainer: "border_container",
          // border container node id
          contentPaneCenter: "cp_center",
          // center content pane node id
          contentPaneSide: "cp_left",
          // side content pane id
          toggleButton: "toggle_button",

          // button node to toggle drawer id
          direction: this.config.i18n.direction // i18n direction "ltr" or "rtl"
        });
        // startup drawer
        this._drawer.startup();

        // document ready
        ready(lang.hitch(this, function () {
          if (this.config.sharedThemeConfig && this.config.sharedThemeConfig.attributes && this.config.sharedThemeConfig.attributes.theme) {
            var sharedTheme = this.config.sharedThemeConfig.attributes;

            this.config.color = sharedTheme.theme.text.color;
            this.config.theme = sharedTheme.theme.body.bg;
          }
          // Create and add custom style sheet
          if (this.config.customstyle) {
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(this.config.customstyle));
            document.head.appendChild(style);
          }

          //supply either the webmap id or, if available, the item info
          var itemInfo = this.config.itemInfo || this.config.webmap;

          this._createWebMap(itemInfo);
          this._updateTheme();
        }));
      } else {
        var error = new Error("Main:: Config is not defined");
        this.reportError(error);
      }

    },
    reportError: function (error) {
      // remove loading class from body
      domClass.remove(document.body, "app-loading");
      domClass.add(document.body, "app-error");
      // an error occurred - notify the user. In this example we pull the string from the
      // resource.js file located in the nls folder because we've set the application up
      // for localization. If you don't need to support multiple languages you can hardcode the
      // strings here and comment out the call in index.html to get the localization strings.
      // set message
      var node = document.getElementById("loading_message");
      if (node) {
        if (this.config && this.config.i18n) {
          node.innerHTML = this.config.i18n.map.error + ": " + error.message;
        } else {
          node.innerHTML = "Unable to create map: " + error.message;
        }
      }
      return error;
    },
    _mapLoaded: function () {
      var filter = new Filter({
        map: this.map,
        layers: this.config.response.itemInfo.itemData.operationalLayers,
        filterDropdown: this.config.filterDropdown,
        toggleFilterVisibility: this.config.toggleFilterVisibility,
        button_text: this.config.button_text,
        webmap: this.config.response,
        displayClear: this.config.displayClear || false,
        displayZoom: this.config.displayZoom || false,
        filterOnLoad: this.config.filterOnLoad || false,
        filterInstructions: this.config.filterInstructions || null,
        uniqueVals: this.config.uniqueVals || false
      });
      filter.createFilterContent().then(lang.hitch(this, function (content) {
        registry.byId("cp_left").set("content", content);
      }));

      //Add the geocoder if search is enabled
      if (this.config.search) {
        //Add the location search widget
        require(["esri/dijit/Search", "esri/tasks/locator", "application/SearchSources"], lang.hitch(this, function (Search, Locator, SearchSources) {
          if (!Search && !Locator && !SearchSources) {
            return;
          }

          var searchOptions = {
            map: this.map,
            useMapExtent: this.config.searchExtent,
            itemData: this.config.response.itemInfo.itemData
          };

          if (this.config.searchConfig) {
            searchOptions.applicationConfiguredSources = this.config.searchConfig.sources || [];
          } else if (this.config.searchLayers) {
            var configuredSearchLayers = (this.config.searchLayers instanceof Array) ? this.config.searchLayers : JSON.parse(this.config.searchLayers);
            searchOptions.configuredSearchLayers = configuredSearchLayers;
            searchOptions.geocoders = this.config.locationSearch ? this.config.helperServices.geocode : [];
          }
          var searchSources = new SearchSources(searchOptions);
          var createdOptions = searchSources.createOptions();

          if (this.config.searchConfig && this.config.searchConfig.activeSourceIndex) {
            createdOptions.activeSourceIndex = this.config.searchConfig.activeSourceIndex;
          }
          createdOptions.enableButtonMode = true;

          var search = new Search(createdOptions, domConstruct.create("div"));

          search.startup();

          if (search && search.domNode) {
            domConstruct.place(search.domNode, "search");
          }

        }));
      } else {
        domClass.add(document.getElementById("toggle_button"), "nosearch");
      }

      //Add the location button if enabled
      if (this.config.locate && document.location.protocol === "https:") {
        var location = new LocateButton({
          map: this.map
        }, domConstruct.create("div", {
          id: "locateDiv"
        }, "mapDiv"));
        location.startup();
      } else {
        domClass.add(document.body, "no-locate");
      }

      //Add the home button if configured
      if (this.config.home) {
        var homeButton = new HomeButton({
          map: this.map
        }, domConstruct.create("div", {
          id: "homeDiv"
        }, "mapDiv"));
        homeButton.startup();
      }

      // Add legend if enabled
      if (this.config.legend) {
        // Do we have layers to display in the legend?
        var legendLayers = arcgisUtils.getLegendLayers(this.config.response);
        if (legendLayers && legendLayers.length && legendLayers.length > 0) {
          require(["esri/dijit/Legend", "dojo/mouse", "dojo/fx", "dojo/_base/fx"], lang.hitch(this, function (Legend, mouse, coreFx, baseFx) {
            var legend = new Legend({
              map: this.map,
              layerInfos: legendLayers
            }, "legendDiv");
            legend.startup();

            // Show the legend open or closed
            // depending on config options.
            if (this.config.legendOpen) {
              query(".legend").removeClass("hide");
              domClass.add(document.getElementById("cp_center"), "noscroll");
            } else {
              //closed when loading
              domClass.remove(document.getElementById("submenu"), "hide");
            }

            var menuBtn = document.getElementById("submenu");
            var legendNode = document.getElementById("legend");

            on(document.getElementById("close-submenu"), "click", function () {
              //prevent scroll
              domClass.remove(document.getElementById("cp_center"), "noscroll");

              domClass.remove(menuBtn, "hide");
              query(".legend").addClass("hide");
              coreFx.combine([
                baseFx.fadeIn({
                  node: menuBtn
                }), baseFx.fadeOut({
                  node: legendNode
                })
              ]).play();
            });
            on(document.getElementById("submenu"), "click", function () {
              //prevent scroll
              domClass.add(document.getElementById("cp_center"), "noscroll");
              domClass.add(menuBtn, "hide");
              query(".legend").removeClass("hide");
              coreFx.combine([
                baseFx.fadeIn({
                  node: legendNode
                }), baseFx.fadeOut({
                  node: menuBtn
                })
              ]).play();
            });
          }));
        }
      }
    },

    //create a map based on the input web map id
    _createWebMap: function (itemInfo) {
      itemInfo = this._setExtent(itemInfo);
      var mapOptions = {};
      mapOptions = this._setLevel(mapOptions);
      mapOptions = this._setCenter(mapOptions);
      arcgisUtils.createMap(itemInfo, "mapDiv", {
        mapOptions: mapOptions,
        editable: false,
        layerMixins: this.config.layerMixins || [],
        usePopupManager: true,
        bingMapsKey: this.config.bingmapskey
      }).then(lang.hitch(this, function (response) {

        this.map = response.map;
        // remove loading class from body
        domClass.remove(document.body, "app-loading");
        this.config.response = response;
        domClass.add(this.map.infoWindow.domNode, "light");
        //define the application title
        var title = this.config.title || response.itemInfo.item.title;
        document.getElementById("title").innerHTML = title;
        document.title = title;

        // make sure map is loaded
        if (this.map.loaded) {
          // do something with the map
          this._mapLoaded();
        } else {
          on.once(this.map, "load", lang.hitch(this, function () {
            // do something with the map
            this._mapLoaded();
          }));
        }
      }), lang.hitch(this, function (error) {
        //an error occurred - notify the user. In this example we pull the string from the
        //resource.js file located in the nls folder because we've set the application up
        //for localization. If you don't need to support multiple languages you can hardcode the
        //strings here and comment out the call in index.html to get the localization strings.
        if (this.config && this.config.i18n) {
          alert(this.config.i18n.map.error + ": " + error.message);
        } else {
          alert("Unable to create map: " + error.message);
        }
      }));
    },

    _updateTheme: function () {
      var styles = {
        theme: this.config.theme,
        color: this.config.color,
        buttonColor: this.config.buttonColor,
        buttonBg: this.config.buttonBg,
        bodyBg: this.config.bodyBg,
        bodyColor: this.config.bodyColor
      };

      var themeCss = esriLang.substitute(styles, ".bg{background-color:${theme};color:${color};} .fc{color:${color};} .esriPopup .pointer{backgroundColor:${theme};} .esriPopup .titlePane{background-color:${theme};color:${color};} .esriPopup .titleButton{color:${color};} #container{background-color:${bodyBg}; color:${bodyColor};} .content-pane-left{background-color:${bodyBg};} .submitButton{background-color:${buttonBg}; color:${buttonColor}}");
      if (themeCss) {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(themeCss));
        document.head.appendChild(style);
      }
      registry.byId("border_container").resize();

    },
    _setLevel: function (options) {
      var level = this.config.level;
      //specify center and zoom if provided as url params
      if (level) {
        options.zoom = level;
      }
      return options;
    },

    _setCenter: function (options) {
      var center = this.config.center;
      if (center) {
        var points = center.split(",");
        if (points && points.length === 2) {
          options.center = [parseFloat(points[0]), parseFloat(points[1])];
        }
      }
      return options;
    },

    _setExtent: function (info) {
      var e = this.config.extent;
      //If a custom extent is set as a url parameter handle that before creating the map
      if (e) {
        var extArray = e.split(",");
        var extLength = extArray.length;
        if (extLength === 4) {
          info.item.extent = [
            [parseFloat(extArray[0]), parseFloat(extArray[1])],
            [parseFloat(extArray[2]), parseFloat(extArray[3])]
          ];
        }
      }
      return info;
    }
  });
});
