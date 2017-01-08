
/*
 * Google layer using Google Maps API
 */

/* global google: true */

L.Google = L.Class.extend({
    includes: L.Mixin.Events,

    options: {
        minZoom: 0,
        maxZoom: 18,
        tileSize: 256,
        subdomains: 'abc',
        errorTileUrl: '',
        attribution: '',
        opacity: 1,
        continuousWorld: false,
        noWrap: false,
        mapOptions: {
            backgroundColor: '#dddddd'
        }
    },

    // Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
    initialize: function (type, options) {
        var _this = this;

        this._ready = L.Google.isGoogleMapsReady();

        L.Util.setOptions(this, options);

        this._googleApiPromise = this._ready ? Promise.resolve(window.google) : L.Google.createGoogleApiPromise();

        this._googleApiPromise
            .then(function () {
                _this._ready = true;
                _this._initMapObject();
                _this._update();
            });

        this._type = type || 'SATELLITE';
    },

    onAdd: function (map, insertAtTheBottom) {
        var _this = this;
        this._googleApiPromise
            .then(function () {
                _this._map = map;
                _this._insertAtTheBottom = insertAtTheBottom;

                // create a container div for tiles
                _this._initContainer();
                _this._initMapObject();

                // set up events
                map.on('viewreset', _this._reset, _this);

                _this._limitedUpdate = L.Util.limitExecByInterval(_this._update, 150, _this);
                map.on('move', _this._update, _this);

                map.on('zoomanim', _this._handleZoomAnim, _this);

                //20px instead of 1em to avoid a slight overlap with google's attribution
                map._controlCorners.bottomright.style.marginBottom = '20px';

                _this._reset();
                _this._update();
            });
    },

    onRemove: function (map) {
        map._container.removeChild(this._container);

        map.off('viewreset', this._reset, this);

        map.off('move', this._update, this);

        map.off('zoomanim', this._handleZoomAnim, this);

        map._controlCorners.bottomright.style.marginBottom = '0em';
    },

    getAttribution: function () {
        return this.options.attribution;
    },

    setOpacity: function (opacity) {
        this.options.opacity = opacity;
        if (opacity < 1) {
            L.DomUtil.setOpacity(this._container, opacity);
        }
    },

    setElementSize: function (e, size) {
        e.style.width = size.x + 'px';
        e.style.height = size.y + 'px';
    },

    _initContainer: function () {
        var tilePane = this._map._container,
            first = tilePane.firstChild;

        if (!this._container) {
            this._container = L.DomUtil.create('div', 'leaflet-google-layer leaflet-top leaflet-left');
            this._container.id = '_GMapContainer_' + L.Util.stamp(this);
            this._container.style.zIndex = 'auto';
        }

        tilePane.insertBefore(this._container, first);

        this.setOpacity(this.options.opacity);
        this.setElementSize(this._container, this._map.getSize());
    },

    _initMapObject: function () {
        if (!this._ready || !this._container) return;
        this._google_center = new google.maps.LatLng(0, 0);
        var map = new google.maps.Map(this._container, {
            center: this._google_center,
            zoom: 0,
            tilt: 0,
            mapTypeId: google.maps.MapTypeId[this._type],
            disableDefaultUI: true,
            keyboardShortcuts: false,
            draggable: false,
            disableDoubleClickZoom: true,
            scrollwheel: false,
            streetViewControl: false,
            styles: this.options.mapOptions.styles,
            backgroundColor: this.options.mapOptions.backgroundColor
        });

        var _this = this;
        this._reposition = google.maps.event.addListenerOnce(map, 'center_changed',
            function () { _this.onReposition(); });
        this._google = map;

        google.maps.event.addListenerOnce(map, 'idle',
            function () { _this._checkZoomLevels(); });
        google.maps.event.addListenerOnce(map, 'tilesloaded',
            function () { _this.fire('load'); });
        //Reporting that map-object was initialized.
        this.fire('MapObjectInitialized', {mapObject: map});
    },

    _checkZoomLevels: function () {
        //setting the zoom level on the Google map may result in a different zoom level than the one requested
        //(it won't go beyond the level for which they have data).
        // verify and make sure the zoom levels on both Leaflet and Google maps are consistent
        if ((this._map.getZoom() !== undefined) && (this._google.getZoom() !== this._map.getZoom())) {
            //zoom levels are out of sync. Set the leaflet zoom level to match the google one
            this._map.setZoom(this._google.getZoom());
        }
    },

    _reset: function () {
        this._initContainer();
    },

    _update: function () {
        if (!this._google) return;
        this._resize();

        var center = this._map.getCenter();
        var _center = new google.maps.LatLng(center.lat, center.lng);

        this._google.setCenter(_center);
        if (this._map.getZoom() !== undefined)
            this._google.setZoom(Math.round(this._map.getZoom()));

        this._checkZoomLevels();
    },

    _resize: function () {
        var size = this._map.getSize();
        if (this._container.style.width === size.x &&
            this._container.style.height === size.y)
            return;
        this.setElementSize(this._container, size);
        this.onReposition();
    },


    _handleZoomAnim: function (e) {
        var center = e.center;
        var _center = new google.maps.LatLng(center.lat, center.lng);

        this._google.setCenter(_center);
        this._google.setZoom(Math.round(e.zoom));
    },


    onReposition: function () {
        if (!this._google) return;
        google.maps.event.trigger(this._google, 'resize');
    }
});

L.Google.isGoogleMapsReady = function () {
    return !!window.google && !!window.google.maps && !!window.google.maps.Map;
};

// backwards compat
L.Google.asyncInitialize = L.Google.isGoogleMapsReady;

L.Google.maxApiChecks = 10;

L.Google.apiCheckIntervalMilliSecs = 500;

L.Google.createGoogleApiPromise = function () {
    var checkCounter = 0;
    var intervalId = null;

    return new Promise(function (resolve, reject) {
        intervalId = setInterval(function () {
            if (checkCounter >= L.Google.maxApiChecks && !L.Google.isGoogleMapsReady()) {
                clearInterval(intervalId);
                return reject(new Error('window.google not found after max attempts'));
            }
            if (L.Google.isGoogleMapsReady()) {
                clearInterval(intervalId);
                return resolve(window.google);
            }
            checkCounter++;
        }, L.Google.apiCheckIntervalMilliSecs);
    });
};

!function(window,angular){"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};angular.module("ui-leaflet").config(["$provide",function($provide){return $provide.decorator("leafletHelpers",["$delegate","leafletLayersLogger",function($delegate,leafletLayersLogger){var $log=leafletLayersLogger,_versionCompare=function(left,right){if(("undefined"==typeof left?"undefined":_typeof(left))+("undefined"==typeof right?"undefined":_typeof(right))!=="stringstring")return!1;for(var a=left.split("."),b=right.split("."),i=0,len=Math.max(a.length,b.length);i<len;i++){if(a[i]&&!b[i]&&parseInt(a[i])>0||parseInt(a[i])>parseInt(b[i]))return 1;if(b[i]&&!a[i]&&parseInt(b[i])>0||parseInt(a[i])<parseInt(b[i]))return-1}return 0},basicFunction=function(layerType){return{isLoaded:function(){return angular.isDefined(layerType)},is:function(layer){return!!this.isLoaded()&&layer instanceof layerType}}},plugins={BingLayerPlugin:basicFunction(L.BingLayer),ChinaLayerPlugin:basicFunction(L.tileLayer.chinaProvider),HeatLayerPlugin:basicFunction(L.heatLayer),LeafletProviderPlugin:basicFunction(L.TileLayer.Provider),MapboxGL:basicFunction(L.mapboxGL),UTFGridPlugin:basicFunction(L.UtfGrid),WebGLHeatMapLayerPlugin:basicFunction(L.TileLayer.WebGLHeatMap),WFSLayerPlugin:basicFunction(L.GeoJSON.WFS),YandexLayerPlugin:basicFunction(L.Yandex)};return _versionCompare(L.version,"1.0.0")===-1?plugins.GoogleLayerPlugin=basicFunction(L.Google):plugins.GoogleLayerPlugin=basicFunction(L.GridLayer.GoogleMutant),plugins.versionCompare=_versionCompare,angular.isDefined(L.esri)?angular.extend(plugins,{AGSBaseLayerPlugin:basicFunction(L.esri.basemapLayer),AGSClusteredLayerPlugin:basicFunction(L.esri.clusteredFeatureLayer),AGSDynamicMapLayerPlugin:basicFunction(L.esri.dynamicMapLayer),AGSFeatureLayerPlugin:basicFunction(L.esri.featureLayer),AGSImageMapLayerPlugin:basicFunction(L.esri.imageMapLayer),AGSHeatmapLayerPlugin:basicFunction(L.esri.heatmapFeatureLayer),AGSTiledMapLayerPlugin:basicFunction(L.esri.tiledMapLayer)}):angular.extend(plugins,{AGSBaseLayerPlugin:basicFunction(),AGSClusteredLayerPlugin:basicFunction(),AGSDynamicMapLayerPlugin:basicFunction(),AGSFeatureLayerPlugin:basicFunction(),AGSImageMapLayerPlugin:basicFunction(),AGSHeatmapLayerPlugin:basicFunction(),AGSTiledMapLayerPlugin:basicFunction()}),angular.isDefined(window.lvector)?angular.extend(plugins,{AGSLayerPlugin:basicFunction(window.lvector.AGS)}):angular.extend(plugins,{AGSLayerPlugin:basicFunction()}),angular.extend($delegate,plugins),$log.info("[ui-leaflet-layers] - Layers plugin is loaded"),$delegate}])}]),angular.module("ui-leaflet").config(["$provide",function($provide){return $provide.decorator("leafletLayerHelpers",["$delegate","$rootScope","$q","leafletHelpers","leafletLayersLogger",function($delegate,$rootScope,$q,leafletHelpers,leafletLayersLogger){var $log=leafletLayersLogger,isArray=leafletHelpers.isArray,isObject=leafletHelpers.isObject,isDefined=leafletHelpers.isDefined,errorHeader=leafletHelpers.errorHeader,utfGridCreateLayer=function(params){if(!leafletHelpers.UTFGridPlugin.isLoaded())return void $log.error(errorHeader+" The UTFGrid plugin is not loaded.");var utfgrid=new L.UtfGrid(params.url,params.pluginOptions);return utfgrid.on("mouseover",function(e){$rootScope.$broadcast("leafletDirectiveMap.utfgridMouseover",e)}),utfgrid.on("mouseout",function(e){$rootScope.$broadcast("leafletDirectiveMap.utfgridMouseout",e)}),utfgrid.on("click",function(e){$rootScope.$broadcast("leafletDirectiveMap.utfgridClick",e)}),utfgrid.on("mousemove",function(e){$rootScope.$broadcast("leafletDirectiveMap.utfgridMousemove",e)}),utfgrid};return angular.extend($delegate.layerTypes,{ags:{mustHaveUrl:!0,createLayer:function(params){if(leafletHelpers.AGSLayerPlugin.isLoaded()){var options=angular.copy(params.options);angular.extend(options,{url:params.url});var layer=new lvector.AGS(options);return layer.onAdd=function(map){this.setMap(map)},layer.onRemove=function(){this.setMap(null)},layer}}},agsBase:{mustHaveLayer:!0,createLayer:function(params){if(leafletHelpers.AGSBaseLayerPlugin.isLoaded())return L.esri.basemapLayer(params.layer,params.options)}},agsClustered:{mustHaveUrl:!0,createLayer:function(params){return leafletHelpers.AGSClusteredLayerPlugin.isLoaded()?leafletHelpers.MarkerClusterPlugin.isLoaded()?L.esri.clusteredFeatureLayer(params.url,params.options):void $log.warn(errorHeader+" The markercluster plugin is not loaded."):void $log.warn(errorHeader+" The esri clustered layer plugin is not loaded.")}},agsDynamic:{mustHaveUrl:!0,createLayer:function(params){return leafletHelpers.AGSDynamicMapLayerPlugin.isLoaded()?(params.options.url=params.url,L.esri.dynamicMapLayer(params.options)):void $log.warn(errorHeader+" The esri plugin is not loaded.")}},agsFeature:{mustHaveUrl:!0,createLayer:function(params){if(!leafletHelpers.AGSFeatureLayerPlugin.isLoaded())return void $log.warn(errorHeader+" The esri plugin is not loaded.");params.options.url=params.url;var layer=L.esri.featureLayer(params.options),load=function(){isDefined(params.options.loadedDefer)&&params.options.loadedDefer.resolve()};return layer.on("loading",function(){params.options.loadedDefer=$q.defer(),layer.off("load",load),layer.on("load",load)}),layer}},agsHeatmap:{mustHaveUrl:!0,createLayer:function(params){return leafletHelpers.AGSHeatmapLayerPlugin.isLoaded()?leafletHelpers.HeatLayerPlugin.isLoaded()?L.esri.heatmapFeatureLayer(params.url,params.options):void $log.warn(errorHeader+" The heatlayer plugin is not loaded."):void $log.warn(errorHeader+" The esri heatmap layer plugin is not loaded.")}},agsImage:{mustHaveUrl:!0,createLayer:function(params){return leafletHelpers.AGSImageMapLayerPlugin.isLoaded()?(params.options.url=params.url,L.esri.imageMapLayer(params.options)):void $log.warn(errorHeader+" The esri plugin is not loaded.")}},agsTiled:{mustHaveUrl:!0,createLayer:function(params){return leafletHelpers.AGSTiledMapLayerPlugin.isLoaded()?(params.options.url=params.url,L.esri.tiledMapLayer(params.options)):void $log.warn(errorHeader+" The esri plugin is not loaded.")}},bing:{mustHaveUrl:!1,createLayer:function(params){return leafletHelpers.BingLayerPlugin.isLoaded()?new L.BingLayer(params.key,params.options):void $log.error(errorHeader+" The Bing plugin is not loaded.")}},china:{mustHaveUrl:!1,createLayer:function(params){var type=params.type||"";return leafletHelpers.ChinaLayerPlugin.isLoaded()?L.tileLayer.chinaProvider(type,params.options):void $log.error(errorHeader+" The ChinaLayer plugin is not loaded.")}},google:{mustHaveUrl:!1,createLayer:function(params){var type=params.type||"SATELLITE";if(!leafletHelpers.GoogleLayerPlugin.isLoaded())return void $log.error(errorHeader+" The GoogleLayer plugin is not loaded.");var layer=null;return layer=leafletHelpers.versionCompare(L.version,"1.0.0")===-1?new L.Google(type.toUpperCase(),params.options):new L.GridLayer.GoogleMutant({type:type.toLowerCase()})}},heat:{mustHaveUrl:!1,mustHaveData:!0,createLayer:function(params){if(!leafletHelpers.HeatLayerPlugin.isLoaded())return void $log.error(errorHeader+" The HeatMapLayer plugin is not loaded.");var layer=new L.heatLayer;return isArray(params.data)&&layer.setLatLngs(params.data),isObject(params.options)&&layer.setOptions(params.options),layer}},here:{mustHaveUrl:!1,createLayer:function(params){var provider=params.provider||"HERE.terrainDay";if(leafletHelpers.LeafletProviderPlugin.isLoaded())return new L.TileLayer.Provider(provider,params.options)}},mapbox:{mustHaveKey:!0,createLayer:function(params){var url="//api.mapbox.com/styles/v1/{user}/{mapId}/tiles/256/{z}/{x}/{y}?access_token={apiKey}";return L.tileLayer(url,angular.extend(params.options,{mapId:params.key,user:params.user,apiKey:params.apiKey}))}},mapboxGL:{createLayer:function(params){return leafletHelpers.MapboxGL.isLoaded()?new L.mapboxGL(params.options):void $log.error(errorHeader+" The MapboxGL plugin is not loaded.")}},utfGrid:{mustHaveUrl:!0,createLayer:utfGridCreateLayer},webGLHeatmap:{mustHaveUrl:!1,mustHaveData:!0,createLayer:function(params){if(!leafletHelpers.WebGLHeatMapLayerPlugin.isLoaded())return void $log.error(errorHeader+" The WebGLHeatMapLayer plugin is not loaded.");var layer=new L.TileLayer.WebGLHeatMap(params.options);return isDefined(params.data)&&layer.setData(params.data),layer}},wfs:{mustHaveUrl:!0,mustHaveLayer:!0,createLayer:function createLayer(params){if(!leafletHelpers.WFSLayerPlugin.isLoaded())return void $log.error(errorHeader+" The WFSLayer plugin is not loaded.");var options=angular.copy(params.options);return options.crs&&"string"==typeof options.crs&&(options.crs=eval(options.crs)),new L.GeoJSON.WFS(params.url,params.layer,options)}},yandex:{mustHaveUrl:!1,createLayer:function(params){var type=params.type||"map";return leafletHelpers.YandexLayerPlugin.isLoaded()?new L.Yandex(type,params.options):void $log.error(errorHeader+" The YandexLayer plugin is not loaded.")}}}),$delegate}])}]),angular.module("ui-leaflet").service("leafletLayersLogger",["nemSimpleLogger",function(nemSimpleLogger){return nemSimpleLogger.spawn()}])}(window,angular);