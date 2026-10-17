let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price, image) {
    cart.push({
        name: name,
        price: price,
        image: image
    });

    saveCart();
    updateBag();
    openBag();
}

function openBag() {
    const sidebar = document.getElementById('bagSidebar');
    const overlay = document.getElementById('bagOverlay');

    if (sidebar) {
        sidebar.style.right = '0';
    }

    if (overlay) {
        overlay.style.display = 'block';
    }
}

function closeBag() {
    const sidebar = document.getElementById('bagSidebar');
    const overlay = document.getElementById('bagOverlay');

    if (sidebar) {
        sidebar.style.right = '-420px';
    }

    if (overlay) {
        overlay.style.display = 'none';
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateBag();
    renderCheckout();
}

function updateBag() {
    const bagItems = document.getElementById('bagItems');
    const bagSummary = document.getElementById('bagSummary');
    const bagTotal = document.getElementById('bagTotal');

    if (!bagItems || !bagSummary || !bagTotal) {
        return;
    }

    if (cart.length === 0) {
        bagItems.innerHTML = '<p class="bag-empty">Your bag is empty.</p>';
        bagSummary.style.display = 'none';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(function(item, index) {
        total += item.price;

        html += `
            <div class="bag-item">
                <img src="../images/${item.image}" alt="${item.name}" class="bag-item-img">
                <div style="flex:1;">
                    <p class="bag-item-name">${item.name}</p>
                    <p class="bag-item-price">$${item.price}.00</p>
                </div>
                <button class="bag-remove-btn" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
    });

    bagItems.innerHTML = html;
    bagTotal.textContent = '$' + total.toFixed(2);
    bagSummary.style.display = 'block';
}

function goToCheckout() {
    window.location.href = 'checkout.html';
}

function renderCheckout() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (!checkoutItems || !checkoutTotal) {
        return;
    }

    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p>Your bag is empty.</p>';
        checkoutTotal.textContent = '$0.00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(function(item, index) {
        total += item.price;

        html += `
            <div class="checkout-item">
                <img src="../images/${item.image}" alt="${item.name}" class="checkout-item-img">
                <div style="flex:1;">
                    <p class="bag-item-name">${item.name}</p>
                    <p class="bag-item-price">$${item.price}.00</p>
                </div>
                <button class="bag-remove-btn" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
    });

    checkoutItems.innerHTML = html;
    checkoutTotal.textContent = '$' + total.toFixed(2);
}

function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert('Your bag is empty.');
        return;
    }

    alert('Thank you for shopping with SWN Skin!');
    cart = [];
    saveCart();
    window.location.href = 'shop.html';
}

document.addEventListener('DOMContentLoaded', function() {
    updateBag();
    renderCheckout();
});

// Shop search
const searchInput = document.getElementById('searchInput');
const productCards = document.querySelectorAll('.product-card');

function filterShopProducts(query) {
  productCards.forEach(function (card) {
    const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
    const productDesc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';

    if (
      query === '' ||
      productName.includes(query) ||
      productDesc.includes(query)
    ) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', function () {
    filterShopProducts(this.value.trim().toLowerCase());
  });
}