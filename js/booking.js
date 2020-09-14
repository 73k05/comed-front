function getTemplate() {
    return 'commissionmedicale_template';
}

function addressAutoComplete() {
    if (typeof places === 'undefined') {
        return;
    }
    var placesAutocomplete = places({
        appId: 'pl9H5MQZCSC6',
        apiKey: 'ee11756711dbc7e6d011b9bc6e8bf981',
        container: document.getElementById('address'),
        countries: ['fr'],
        language: 'fr',

        templates: {
            value: function (suggestion) {
                return suggestion.name;
            }
        }
    }).configure({
        type: 'address'
    });
    placesAutocomplete.on('change', function resultSelected(e) {
        document.getElementById('city').value = e.suggestion.city || '';
        document.getElementById('zip').value = e.suggestion.postcode || '';
    });
}

function onBookingSuccess(form) {
    $.ajax('https://73k05.xyz:3030/booking/new', {
        data: JSON.stringify(getParams(form)),
        contentType: 'application/json',
        type: 'POST',
        success: onBookingAddSuccess
    });
}

function onBookingAddSuccess() {
    console.log("Added to BOoked _o/");
    showSuccesMessage();
}