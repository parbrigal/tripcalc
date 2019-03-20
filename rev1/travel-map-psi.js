var gmap = gmap || {};
gmap.GMap = function(e) {
    this.element = e, this.element.innerHTML = 
    "<head><meta name='viewport' content='initial-scale=1.0, user-scalable=no'><meta charset='utf-8'><style>html,body{height:100%;width:100%;margin:0;padding:0}#travel-info{margin:3px auto}#move{background-color:#52CEB6;height:96px;margin:4px 4px 0px 2px}#map{height:100%;width:98.5%;height:363px;margin-top:5px;margin-left:5px;margin-right:5px}.controls{margin-top:10px;border:1px solid transparent;border-radius:2px 0 0 2px;box-sizing:border-box;-moz-box-sizing:border-box;height:32px;outline:none;box-shadow:0 2px 6px rgba(0,0,0,0.3)}input::placeholder{color:#2A3376}.origin-input-class input[type=text], .destination-input-class input[type=text]{padding-left:30px;background-color:#fff;font-family:'Open Sans';font-size:14px;font-weight:400;margin-left:6px;text-overflow:ellipsis;max-width:363px;width:90%;color:#2A3376}.origin-input-class,.destination-input-class{position:relative}.origin-input-class i, .destination-input-class i{position:absolute;left:0;top:8px;padding:10px 12px;color:#52CEB6}#results{display:flex;align-items:center;justify-content:center;background-color:#2A3376;height:54px}#estimated-distance-label{font-family:'Open Sans';font-size:14px;font-weight:bold;color:white}.origin-input-class #origin-input:focus,#destination-input:focus,#estimated-time{border-color:#4d90fe}input[type='text']:disabled{background-color:#ccc;font-family:'Open Sans';font-size:14px;font-weight:400;margin-left:6px;padding:0 4px 0 4px;text-overflow:ellipsis}input[type='textarea']:disabled{background-color:#ccc;font-family:'Open Sans';font-size:14px;font-weight:400;margin-left:6px;padding:0 4px 0 4px;text-overflow:ellipsis}</style><link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.5.0/css/all.css' integrity='sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU' crossorigin='anonymous'></head><body><div id=travel-info><div id='move'><div class='origin-input-class'> <input id='origin-input' class='controls' type='text' placeholder='Enter your location'> <i class='far fa-dot-circle'></i></div><div class='destination-input-class'> <input id='destination-input' class='controls' type='text' placeholder='Enter your destination'> <i class='fas fa-map-marker-alt'></i></div></div><div id='map'></div><div id='results'> <label id='estimated-distance-label'>Estimated Distance</label> <input id='distance-destination' type='hidden' class='controls' placeholder='Estimated Distance'> <input id='estimated-time' type='hidden'> <input id='origin-lat' type='hidden'> <input id='origin-lng' type='hidden'> <input id='destination-lat' type='hidden'> <input id='destination-lng' type='hidden'> <input id='place_id_origin' type='hidden'> <input id='place_id_destination' type='hidden'></div></div></body>", 
    
    $(function() {
        function e(e) {
            this.map = e, this.originPlaceId = null, this.destinationPlaceId = null, this.travelMode = "DRIVING";
            var t = document.getElementById("origin-input"),
                i = document.getElementById("destination-input");
            this.directionsService = new google.maps.DirectionsService, this.directionsDisplay = new google.maps.DirectionsRenderer, this.directionsDisplay.setMap(e), this.distanceService = new google.maps.DistanceMatrixService;
            var n = new google.maps.places.Autocomplete(t, {
                    placeIdOnly: !0
                }),
                a = new google.maps.places.Autocomplete(i, {
                    placeIdOnly: !0
                });
            this.setupPlaceChangedListener(n, "ORIG"), this.setupPlaceChangedListener(a, "DEST")
        }
        window.initialize = function() {
            new e(new google.maps.Map(document.getElementById("map"), {
                mapTypeControl: !1,
                center: {
                    lat: -26.148077,
                    lng: 28.047853
                },
                fullscreenControl: !1,
                streetViewControl: !1,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 13
            }))
        }, 
        e.prototype.setupPlaceChangedListener = function(t, i) {
            var s = this,
                d = new google.maps.Geocoder;
            t.bindTo("bounds", this.map), t.addListener("place_changed", function() {
                var e = t.getPlace();
                if (e.place_id) {
                    if ("ORIG" === i) {
                        s.originPlaceId = e.place_id;
                        var n = document.getElementById("origin-lat"),
                            a = document.getElementById("origin-lng");
                        d.geocode({
                            placeId: e.place_id
                        }, function(e, t) {
                            if ("OK" === t && e[0]) {
                                var i = e[0].geometry.location;
                                n.value = i.lat(), a.value = i.lng()
                            } else n.value = "Not found", a.value = "Not found"
                        })
                    } else {
                        s.destinationPlaceId = e.place_id;
                        var o = document.getElementById("destination-lat"),
                            l = document.getElementById("destination-lng");
                        d.geocode({
                            placeId: e.place_id
                        }, function(e, t) {
                            if ("OK" === t && e[0]) {
                                var i = e[0].geometry.location;
                                o.value = i.lat(), l.value = i.lng()
                            } else o.value = "Not found", l.value = "Not found"
                        })
                    }
                    s.route()
                } else window.alert("Please select an option from the dropdown list.")
            })
        }, 
        e.prototype.route = function() {
            if (this.originPlaceId && this.destinationPlaceId) {
                var i = this,
                    e = this.originPlaceId;
                document.getElementById("place_id_origin").value = e;
                var t = this.destinationPlaceId,
                    n = {
                        placeId: "" + e
                    },
                    a = {
                        placeId: "" + (document.getElementById("place_id_destination").value = t)
                    };
                this.distanceService.getDistanceMatrix({
                    origins: [n],
                    destinations: [a],
                    travelMode: "DRIVING",
                    unitSystem: google.maps.UnitSystem.METRIC,
                    avoidHighways: !1,
                    avoidTolls: !1
                }, function(e, t) {
                    if ("OK" !== t) alert("No results returned : " + t + ". The claim can still be saved by manually overriding the value");
                    else {
                        e.originAddresses, e.destinationAddresses;
                        var i = e.rows[0].elements,
                            n = document.getElementById("estimated-time");
                        document.getElementById("distance-destination").value = (i[0].distance.value * .001).toFixed(4) + " km", n.value = i[0].duration.text, document.getElementById("estimated-distance-label").innerText = "Estimated Distance : " + (i[0].distance.value * .001).toFixed(4) + " km"
                    }
                }), this.directionsService.route({
                    origin: {
                        placeId: this.originPlaceId
                    },
                    destination: {
                        placeId: this.destinationPlaceId
                    },
                    travelMode: this.travelMode
                }, function(e, t) {
                    "OK" === t ? i.directionsDisplay.setDirections(e) : window.alert("Google Directions request failed due to " + t + ".The record can still be saved by overriding the value of the travel claim")
                })
            }
        };
        var t = document.createElement("script");
        t.type = "text/javascript", t.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCGz8jUrjwAFbNIj7Ye1joS_DXWqvgdsRg&libraries=places&callback=initialize", document.body.appendChild(t)
    })
};
