(function () {
    'use strict';
    window.addEventListener('load', function () {
        // initEventListener(false);
        populateSelect();
        initBookDatePicker();
        initStripe();
    }, false);
})();

function getParams(form) {
    return {
        email: form.email.value,
        firstname: form.firstname.value,
        lastname: form.lastname.value,
        phone: "",
        number: Math.random() * 100000 | 0,
        birthdate: "",
        birthname: "",
        region: form.region.value,
        typevisit: "",
        bookingChooseDate: form.bookingdate.value,
        bookedCurrentDate: "",
        addressStreet: "",
        addressZip: "",
        addressCity: "",
        boost: true
    };
}

function initStripe() {

// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to

    /* ------- UI helpers ------- */


// Show a spinner on payment submission
    const loading = function (isLoading) {
        if (isLoading) {
            // Disable the button and show a spinner
            document.querySelector("button").disabled = true;
            document.querySelector("#spinner").classList.remove("hidden");
            document.querySelector("#button-text").classList.add("hidden");
        } else {
            document.querySelector("button").disabled = false;
            document.querySelector("#spinner").classList.add("hidden");
            document.querySelector("#button-text").classList.remove("hidden");
        }
    };
// Show the customer the error from Stripe if their card fails to charge
    const showError = function (errorMsgText) {
        loading(false);
        const errorMsg = document.querySelector("#card-error");
        errorMsg.textContent = errorMsgText;
        setTimeout(function () {
            errorMsg.textContent = "";
        }, 4000);
    };
// Shows a success message when the payment is complete
    const orderComplete = function (paymentIntentId) {
        loading(false);
        document
            .querySelector(".alert-success a")
            .setAttribute(
                "href",
                "https://dashboard.stripe.com/test/payments/" + paymentIntentId
            );
        document.querySelector(".alert-success").classList.remove("hidden");

        const form = document.getElementById("payment-form");
        disableBookButton(form);
        addNewBooking(form);
    };
// prompt the user to enter authentication details without leaving your page.
    const payWithCard = function (stripe, card, clientSecret) {
        loading(true);
        stripe
            .confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card
                }
            })
            .then(function (result) {
                if (result.error) {
                    // Show error to your customer
                    showError(result.error.message);
                } else {
                    // The payment succeeded!
                    orderComplete(result.paymentIntent.id);
                }
            });
    };
// Create a Stripe client.
    const stripe = Stripe('pk_live_Qk0OOId1FvqJCPY7WqCGRZjy00ZeFmTASh');

// Disable the button until we have Stripe set up on the page
    document.querySelector("button").disabled = true;
    fetch("https://73k05.xyz:3030/booking/create-payment-intent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (result) {
            return result.json();
        })
        .then(function (data) {
            console.log(data);
            const form = document.getElementById("payment-form");
            enableBookButton(form);
            const elements = stripe.elements();
            const style = {
                base: {
                    color: "#32325d",
                    fontFamily: 'Arial, sans-serif',
                    fontSmoothing: "antialiased",
                    fontSize: "16px",
                    "::placeholder": {}
                },
                invalid: {
                    fontFamily: 'Arial, sans-serif',
                    color: "#fa755a",
                }
            };
            const card = elements.create("card", {style: style});
            // Stripe injects an iframe into the DOM
            card.mount("#card-element");
            card.on("change", function (event) {
                // Disable the Pay button if there are no card details in the Element
                document.querySelector("button").disabled = event.empty;
                document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
            });

            form.addEventListener("submit", function (event) {
                preventEvents(event);
                form.classList.add("was-validated");
                if (form.checkValidity() === false) {
                    return;
                }
                // Complete payment when the submit button is clicked
                payWithCard(stripe, card, data.clientSecret);
            });
        });
}