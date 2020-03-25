let map,
    infoWindow;

/**
 * Iterate over each location and extract the locations that contain the 
 * category that the user selected from the dropdown
 */
function filterByCategory(category) {
    let filteredLocations = locations.filter(function(location) {
        return location.category === category;
    });

    return filteredLocations;
}

function initMap() {
    infowindow = new google.maps.InfoWindow;
    let selectBox = document.getElementById("options");
    let type = selectBox.options[selectBox.selectedIndex].value;
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 9,
        center: {
            lat:35.6762,
            lng:139.6503
        }
    });

    // Get the subset of locations, based on the user's input (selection from the dropdown)
    filteredLocations = filterByCategory(type);

    // Set an array of letters so that we can label each marker
    let labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    /**
     * Iterate over all of the locations inside of the `filterLocations` array,
     * and we will create a new `google.maps.Marker` for each of those locations.
     * We will also assign a label to the newly created marker.
     * 
     * These markers will be stored in an array call `markers`
     */
    let markers = filteredLocations.map(function(location, i) {
        let marker = new google.maps.Marker({
            position: location.coords,
            label: labels[i % labels.length]
        });

        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                infowindow.setContent('<a href="' + location.website + '" target="_blank">' + location.name + '</a>');
                infowindow.open(map, marker);
            }
        })(marker));

        return marker;
    });

    // Set the marker cluster image for instances where multiple markers are close together
    let markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}