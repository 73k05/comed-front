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
        number: Math.random() * 100000 | 0,
        region: form.region.value,
        bookingChooseDate: form.bookingdate.value,
        bookedCurrentDate: "",
    };
}

function initStripe() {
// Create a Stripe client.
    var stripe = Stripe('pk_live_Qk0OOId1FvqJCPY7WqCGRZjy00ZeFmTASh');

// Create an instance of Elements.
    var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

// Create an instance of the card Element.
    var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

// Handle real-time validation errors from the card Element.
    card.on('change', function (event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

// Handle form submission.
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', function (event) {
            preventEvents(event);

            form.classList.add("was-validated");
            if (form.checkValidity() === false) {
                return;
            }

            stripe.createToken(card).then(function (result) {
                if (result.error) {
                    // Inform the user if there was an error.
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server.
                    stripeTokenHandler(result.token);
                }
            });
        },
        false);

// Submit the form with the token ID.
    function stripeTokenHandler(token) {
        // Insert the token ID into the form so it gets submitted to the server
        var form = document.getElementById('payment-form');
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeToken');
        hiddenInput.setAttribute('value', token.id);
        form.appendChild(hiddenInput);

        // Send mail
        disableBookButton(form);
        sendMail(form);
    }
}