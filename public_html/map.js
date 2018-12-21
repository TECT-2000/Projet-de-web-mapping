/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function () {
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
        visible: true,
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
            },
        })
    });
    var overlay = new ol.Overlay({
        element: document.getElementById('overlay'),
        positioning: 'bottom-center'
    });
    var map = new ol.Map({
        target: 'map',
        layers: [/*administrativeLayer,*/ administrativeLayerTiled,
            dishesLayers, //dishesLayersTiled
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([13.05979, 3.75732]),
            zoom: 6
        }),
        controls: ol.control.defaults().extend([
            //new ol.control.Attribution(),
            new ol.control.ScaleLine({
                units: 'degrees',
                minwidth: 100
            }),
            new ol.control.MousePosition({
                coordinateFormat: function (coordinates) {
                    var coord_x = coordinates[0].toFixed(3);
                    var coord_y = coordinates[1].toFixed(3);
                    return coord_x + ', ' + coord_y;
                }, target: 'coordinates'}),
            new ol.control.ZoomSlider(),
            new ol.control.OverviewMap({
                collapsible: false
            }),
            new ol.control.FullScreen()
        ]),
        interactions: ol.interaction.defaults({
            shiftDragZoom: true
        }).extend([
            new ol.interaction.Select({
                layers: [dishesLayers]
            }),
            new ol.interaction.DragRotateAndZoom()
        ])

                //controls: ol.control.defaultControls(),
    });
    map.on("click", function (event) {
        // extract the spatial coordinate of the click event in map projection units
        var coord = event.coordinate;
        // transform it to decimal degrees
        var degrees = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
        // format a human readable version
        var hdms = ol.coordinate.toStringHDMS(degrees);
        // update the overlay element's content
        var element = overlay.getElement();
        element.innerHTML = hdms;
        // position the element (using the coordinate in the map's projection)
        overlay.setPosition(coord);
        // and add it to the map
        map.addOverlay(overlay);
    });

    var visible = new ol.dom.Input(document.getElementById('visible'));
    visible.bindTo('checked', administrativeLayerTiled, 'visible');
});