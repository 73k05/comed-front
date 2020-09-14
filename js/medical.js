const minimumDelayBook = 7;

function initEventListener() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName("needs-validation");
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
            "submit",
            function (event) {
                if (form.checkValidity() === false) {
                    preventEvents(event);
                } else if (form.checkValidity() === true) {
                    preventEvents(event);
                    disableBookButton(form);
                    sendMail(form);
                }
                form.classList.add("was-validated");
            },
            false
        );
    });
}


// Display Booking Date
function initBookDatePicker() {
    // Calculating the actual day date + 6 days ahead
    let nextWeekDate = new Date();
    nextWeekDate.setDate(nextWeekDate.getDate() + minimumDelayBook);
    $("#bookingDatePicker").datepicker({
        onSelect: function (date) {
        },
        format: "dd/mm/yyyy",
        startDate: nextWeekDate,
        firstDay: 1,
    });
}

function initBirthDatePicker() {
    // Calculating the actual day date - 18 years behind
    let minBirthDate = new Date()
    minBirthDate.setFullYear(new Date().getFullYear() - 18);
    $("#birthdate").datepicker({
        onSelect: function (date) {
        },
        format: "dd/mm/yyyy",
        endDate: minBirthDate,
        firstDay: 1,
    });
}

// Email JS init
(function () {
    emailjs.init("user_okaI2d5BZr9wdrnselFor");
})();

function sendMail(form) {
    if (form == undefined || !form.checkValidity()) {
        console.error(
            "Error, email empty or wrong or medical rendez-vous already sent"
        );
        return;
    }

    showProgressBar();

    emailjs.send("commissionmedicale", getTemplate(), getParams(form)).then(
        function (response) {
            hideProgressBar();
            onBookingSuccess(form);
        },
        function (error) {
            enableBookButton(form);
            console.error("Error mail...", error);
            hideProgressBar();
            showErrorMEssage();
        }
    );
}

function disableBookButton(form) {
    form.bookButton.disabled = true;
    return true;
}

function enableBookButton(form) {
    form.bookButton.disabled = false;
    return false;
}

function preventEvents(event) {
    event.preventDefault();
    event.stopPropagation();
}

function showSuccesMessage() {
    let succesMesage = document.getElementById("success-message");
    setTimeout(function () {
        succesMesage.style.display = "block";
    }, 2000);
}

function showErrorMEssage() {
    let errorMessage = document.getElementById("error-message");
    setTimeout(function () {
        errorMessage.style.display = "block";
    }, 2000);
}

function showProgressBar() {
    var progressBar = document.getElementById("progressId");
    progressBar.hidden = false;
}

function hideProgressBar() {
    var progressBar = document.getElementById("progressId");
    setTimeout(function () {
        progressBar.hidden = true;
    }, 2000);
}
