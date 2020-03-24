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
    var selectBox = document.getElementById("options");
    var type = selectBox.options[selectBox.selectedIndex].value;
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
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
        return new google.maps.Marker({
            position: location.coords,
            label: labels[i % labels.length]
        });
    });

    // Set the marker cluster image for instances where multiple markers are close together
    let markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    
    /**
     * Iterate over each marker and create a new infoWindow for each marker. Inside,
     * we'll iterate over each of the locations, so that each infoWindow can contain information
     * about the location. In this instance, the name and website address
     */
    for (let marker of markers) {
        for (let location of filteredLocations) {
            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    infowindow.setContent('<a href="' + location.website + '" target="_blank">' + location.name + '</a>');
                    infowindow.open(map, marker);
                }
            })(marker));
        }
    }
}