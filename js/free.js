(function () {
    'use strict';
    window.addEventListener('load', function () {
        initEventListener();
        populateSelect();
        initBookDatePicker();
        initBirthDatePicker();
        addressAutoComplete();
    }, false);
})();

function getParams(form) {
    return {
        email: form.email.value,
        firstname: form.firstname.value,
        lastname: form.lastname.value,
        phone: form.phone.value,
        number: Math.random() * 100000 | 0,
        birthdate: form.birthdate.value,
        birthname: form.birthname.value,
        region: form.region.value,
        typevisit: form.typevisit.value,
        bookingChooseDate: form.bookingdate.value,
        bookedCurrentDate: "",
        addressStreet: form.address.value,
        addressZip: form.zip.value,
        addressCity: form.city.value
    };
}