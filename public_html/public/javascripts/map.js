/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function () {
    var format = 'image/png';


    var administrativeLayerTiled = new ol.layer.Image({
        visible: true,
        name: 'administrative-boundaries',
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cameroun/wms',
            params: {'FORMAT': format,
                "transparent":true,
                'VERSION': '1.1.1',
                "LAYERS": 'cameroun:cm_2018-08-01_wgs84_administrative-boundaries_polygons_admin-le',
                "exceptions": 'application/vnd.ogc.se_inimage',
            }
        })
    });
    var dishesLayers = new ol.layer.Image({
        name: 'hydrography_artificial_lines_drains-ditches',
        attribution: "hydrographie",
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: 'http://localhost:8080/geoserver/cameroun/wms',
            params: {'FORMAT': format,
                'VERSION': '1.1.1',
                "transparent":true,
                tiled: true,
                "LAYERS": 'cameroun:cm_2018-08-01_wgs84_hydrography_artificial_lines_drains-ditches',
                "exceptions": 'application/vnd.ogc.se_inimage'
            }
        })
    });
    var overlay = new ol.Overlay({
        element: document.getElementById('overlay'),
        positioning: 'bottom-center'
    });
    var map = new ol.Map({
        target: 'vmap-world1',
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
            /*new ol.control.OverviewMap({
                collapsible: false
            }),*/
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
    
    document.getElementById('osmCheck').addEventListener("change",function(){changeVisibility("hydrography_artificial_lines_drains-ditches")});
    document.getElementById('couche0').addEventListener("change",function(){changeVisibility("administrative-boundaries")});
    
    function changeVisibility(name){
        var layer_name=name;
        map.getLayers().forEach(function(lyr){
            if(lyr.get('name')===layer_name){
                var is_visible=lyr.get("visible");
                lyr.setVisible(!is_visible);
            }
        });
    }
});