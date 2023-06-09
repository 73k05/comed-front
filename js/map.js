(function () {
    'use strict';
    var map = L.map('mapid').setView([45.7741, 3.0605], 6);
    L.tileLayer('https://api.mapbox.com/styles/v1/73k05/ck8kdu10z0bnp1jmnatgfhyt7/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiNzNrMDUiLCJhIjoiY2s4a2FwM3FzMGcyMjNtcXEzYWpydzFjMiJ9.lIIsNlB9khxZUlmmkp8f9Q', {
        maxZoom: 18,
        id: 'ck8kdu10z0bnp1jmnatgfhyt7',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
    //GEt dep availability list
    $.getJSON("https://73k05.xyz:3030/department_availabilities", function (departmentAvailabilityList) {
        //Get dep list in map
        $.getJSON("./resources/depmaps/departements.geojson", function (departmentJson) {
            L.geoJSON(departmentJson, {
                style: function (feature) {
                    let departmentAvailability = getDepartment(feature.properties.code, departmentAvailabilityList);
                    let firstOpenSlot = "";
                    let isBookingOpen = false;
                    if (departmentAvailability) {
                        firstOpenSlot = departmentAvailability["bookingFirstOpenSlotDate"];
                        if (firstOpenSlot) {
                            firstOpenSlot = firstOpenSlot.$date;
                        }
                        isBookingOpen = departmentAvailability["bookingOpen"];
                    }
                    const todayDate = new Date();
                    todayDate.setHours(0);
                    const todayDateTimestamp = todayDate.getTime();
                    if (firstOpenSlot >= todayDateTimestamp && isBookingOpen) {
                        return {color: "#78995D"};
                    }
                    //Booking closed but date open
                    if (firstOpenSlot >= todayDateTimestamp || isBookingOpen) {
                        return {color: "#28499B"};
                    }
                    //Booking closed
                    return {color: "#ff0000"};
                }, onEachFeature: onEachFeature
            }).addTo(map);

            //Bind popup to display name & availability
            function onEachFeature(feature, layer) {
                const departmentAvailability = getDepartment(feature.properties.code, departmentAvailabilityList);
                let popupText = `<p><b> ${feature.properties.nom} (${feature.properties.code})</b><br/>`;
                let firstOpenSlot = departmentAvailability ? departmentAvailability["bookingFirstOpenSlotDate"] : "";
                if (firstOpenSlot) {
                    firstOpenSlot = firstOpenSlot.$date;
                    firstOpenSlot = new Date(firstOpenSlot);
                    firstOpenSlot = ((firstOpenSlot.getDate() > 9) ? firstOpenSlot.getDate() : ('0' + firstOpenSlot.getDate())) + '/' + ((firstOpenSlot.getMonth() > 8) ? (firstOpenSlot.getMonth() + 1) : ('0' + (firstOpenSlot.getMonth() + 1))) + '/' + firstOpenSlot.getFullYear();
                }
                if (firstOpenSlot && departmentAvailability["bookingOpen"] === true) {
                    popupText = `${popupText}<b style='color:#78995D;'>Ouvert</b> prochain créneau le <b>${firstOpenSlot}</b></p>`;
                } else if (firstOpenSlot) {
                    popupText = `${popupText}<b style='color:#28499B;'>Fermé</b>  prochain créneau le <b>${firstOpenSlot}</b></p>`;
                } else {
                    popupText = `${popupText}<b style='color:#ff0000;'>Fermé</b></p>`;
                }
                var departmentBookUrl = departmentAvailability ? departmentAvailability["departmentBookUrl"] : "";
                popupText = `${popupText}<p> Réserver sur <b><a href='./index.html'>CoMed</a></b><br/>`;
                popupText = `${popupText}Réserver sur <a href='${departmentBookUrl}' target='_blank'>gouv</a></p>`;
                layer.bindPopup(popupText);
            }
        });
    });
})();

function getDepartment(departmentCode, departmentList) {
    let departmentToReturn = {};
    $.each(departmentList, function (index, department) {
        if (department._id.length < 2) {
            department._id = "0" + department._id;
        }
        if (department._id == departmentCode) {
            departmentToReturn = department;
            return false;
        }
    });
    return departmentToReturn;
}