(function(app) {
    'use strict';

    var $window = $(window);
    var $document = $(document);
    var $html = $('html');
    var $body = $('body');
    var $map = $('#map');

    function changeEventFunc(func) {
        return function(e) {
            var $input = $(this);
            return func.call(this, $input.val(), $input.prop('checked'));
        };
    };

    var BAD_POLYGON_OPTIONS = {
        'clickable': false,
        'fillColor': '#333',
        'fillOpacity': 0.4,
        'strokeWeight': 0
    };

    function ll(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    };

    function polygon(map, options, path) {
        return new google.maps.Polygon(_.extend({'path': path, 'map': map}, options));
    };

    var SAN_MATEO = ll(37.562992, -122.325525);

    var map = app.map = new google.maps.Map($map[0], {
        'center': SAN_MATEO,
        'disableDefaultUI': true,
        'keyboardShortcuts': true,
        'mapTypeId': google.maps.MapTypeId.ROADMAP,
        'minZoom': 10,
        'noClear': true,
        'scaleControl': true,
        'zoom': 14
    });
    $window.resize(_.debounce(function() {
        google.maps.event.trigger(map, 'resize');
    }, 200)); // ms

    var layers = {
        'transit': new google.maps.TransitLayer(),
        'traffic': new google.maps.TrafficLayer(),
        'bicycling': new google.maps.BicyclingLayer()
    };
    $body.on('change', 'input[name=layer]', changeEventFunc(function(value, checked) {
        layers[value].setMap(checked ? map : null);
    }));

    var drawingManager = app.drawingManager = new google.maps.drawing.DrawingManager({
        'polygonOptions': {
            'fillColor': '#6199df',
            'fillOpacity': 0.4,
            'strokeWeight': 0
        }
    });
    $body.on('change', 'input[name=draw]', changeEventFunc(function(value, checked) {
        drawingManager.setOptions({
            'drawingMode': google.maps.drawing.OverlayType[value],
            'map': checked ? map : null
        });
    }));
    app.polygons = [];
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
        app.polygons.push(polygon);
    });

    // north central, san mateo
    polygon(map, BAD_POLYGON_OPTIONS, [
        ll(37.57073925708963, -122.31443881988525),
        ll(37.58386779351807, -122.32877254486084),
        ll(37.57468486365453, -122.34276294708252),
        ll(37.57203180640091, -122.33864307403564),
        ll(37.56995691371416, -122.33512401580810),
        ll(37.56764385045342, -122.33066082000732),
        ll(37.56570490384997, -122.32812881469727),
        ll(37.56359581690638, -122.32628345489502),
        ll(37.56322161782477, -122.32598304748535)
    ]);

    $body.on('submit', 'form.url', function(e) {
        e.preventDefault();
        var response = $.ajax(this.action, {'type': 'post', 'data': $(this).serialize()});
        response.done(function(d) {
            var marker = new google.maps.Marker({
                'map': map,
                'position': ll(d.lat, d.lng)
            });
            var url = d.url;
            google.maps.event.addListener(marker, 'click', function() {
                window.open(url);
            });
        });
        this.reset();
        document.activeElement.blur();
    });

})(this.app = this.app || {});
