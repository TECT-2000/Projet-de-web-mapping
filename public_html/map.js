/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var format = 'image/png';
//var extents = new ol.Bounds(8.34316730499268, 1.59752249717712, 16.2311973571777, 13.1404762268066);
var administrativeLayer = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileWMS({
        name: 'administrative',
        url: 'http://localhost:8080/geoserver/cameroun/wms',
        params: {'FORMAT': format,
            'VERSION': '1.1.1',
            tiled: true,
            "LAYERS": 'cameroun:cm_2018-08-01_wgs84_administrative-boundaries_polygons_admin-le',
            "exceptions": 'application/vnd.ogc.se_inimage',
            tilesOrigin: 8.34316730499268 + "," + 1.59752249717712
        }
    })
});
var administrativeLayerTiled = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://localhost:8080/geoserver/cameroun/wms',
        params: {'FORMAT': format,
            'VERSION': '1.1.1',
            "LAYERS": 'cameroun:cm_2018-08-01_wgs84_administrative-boundaries_polygons_admin-le',
            "exceptions": 'application/vnd.ogc.se_inimage',
        }
    })
});
var dishesLayers = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        ratio: 1,
        name: 'dishes',
        url: 'http://localhost:8080/geoserver/cameroun/wms',
        params: {'FORMAT': format,
            'VERSION': '1.1.1',
            tiled: true,
            "LAYERS": 'cameroun:cm_2018-08-01_wgs84_hydrography_artificial_lines_drains-ditches',
            "exceptions": 'application/vnd.ogc.se_inimage'
        }
    })
});
var dishesLayersTiled = new ol.layer.Image({
    visible: false,
    source: new ol.source.TileWMS({
        ratio: 1,
        name: 'dishes',
        url: 'http://localhost:8080/geoserver/cameroun/wms',
        params: {'FORMAT': format,
            'VERSION': '1.1.1',
            tiled: true,
            "LAYERS": 'cameroun:cm_2018-08-01_wgs84_hydrography_artificial_lines_drains-ditches',
            "exceptions": 'application/vnd.ogc.se_inimage',
            tilesOrigin: 9.55545330047607 + "," + 2.9247522354126
        }
    })
});
var map = new ol.Map({
    target: 'map',
    layers: [administrativeLayer, administrativeLayerTiled,
        dishesLayers, dishesLayersTiled
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([13.05979, 3.75732]),
        zoom: 6.3
    }),
    //controls: ol.control.defaultControls(),
});

//map.addControl(new ol.control.ZoomSlider());
        