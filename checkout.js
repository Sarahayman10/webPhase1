// Retrieve subtotal from localStorage and set initial values
let subtotal = parseFloat(localStorage.getItem('cartTotal')) || 0;
let deliveryFee = 23.50;
let currentTip = 0;
let discount = 0;

// Update the order summary function
function updateSummary() {
    let total = subtotal + deliveryFee + currentTip - discount;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('delivery').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('tip').textContent = `$${currentTip.toFixed(2)}`;
    document.getElementById('discount').textContent = `$${discount.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Add tip to the total
function addTip(amount) {
    currentTip += amount;
    alert(`Tip added: $${amount}. Total tip: $${currentTip}`);
    updateSummary();
}

// Toggle visibility of Visa details
document.getElementById('visaRadio').addEventListener('change', function () {
    document.getElementById('visaDetails').style.display = 'block';
});

document.querySelector('input[name="paymentMethod"][value="Cash"]').addEventListener('change', function () {
    document.getElementById('visaDetails').style.display = 'none';
});

// Apply promo code and update the discount
document.getElementById('applyPromoBtn').addEventListener('click', function () {
    let promoCode = document.getElementById('promoCode').value.trim();
    if (promoCode === 'FIRST10') {
        discount = 10;
        alert('Promo code applied. You saved $10!');
        updateSummary();
    } else {
        alert('Invalid promo code.');
        discount = 0; // Reset discount if the promo is invalid
    }
});

// Initial summary update on page load
updateSummary();

// Redirect on valid form submission
function redirectToAfterCheck(event) {
    event.preventDefault();

    // Retrieve form values
    const address = document.getElementById('address').value.trim();
    const deliveryTime = document.getElementById('deliveryTime').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const promoCode = document.getElementById('promoCode').value.trim();
    const tipAmount = currentTip;

    // Validate required fields
    if (!address || !deliveryTime || !paymentMethod) {
        alert('Please complete all required fields.');
        return;
    }

    // Collect Visa details if needed
    let cardNumber = "", expiryDate = "", cvv = "";
    if (paymentMethod === 'Visa') {
        cardNumber = document.getElementById('cardNumber').value;
        expiryDate = document.getElementById('expiryDate').value;
        cvv = document.getElementById('cvv').value;

        const cardNumberValid = /^\d{16}$/.test(cardNumber);
        const expiryDateValid = /^\d{2}\/\d{2}$/.test(expiryDate);
        const cvvValid = /^\d{3}$/.test(cvv);

        if (!cardNumberValid || !expiryDateValid || !cvvValid) {
            alert('Please enter valid Visa card details.');
            return;
        }
    }

    // Save order details to localStorage
    const orderDetails = {
        deliveryAddress: address,
        deliveryTime: deliveryTime,
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        promoCode: promoCode,
        tipAmount: tipAmount,
        subtotal: subtotal,
        delivery: deliveryFee,
        discount: discount,
        total: subtotal + deliveryFee + tipAmount - discount
    };
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    console.log("Form is valid; redirecting to aftercheck.html");
   window.location.href="aftercheck.html";
}
