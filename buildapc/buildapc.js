const budgetButtons = document.querySelectorAll("[data-budget]");
const filterButtons = document.querySelectorAll("[data-filter]");
const budgetAmount = document.getElementById("budget-amount");
const budgetRemaining = document.getElementById("budget-remaining");
const budgetWarning = document.getElementById("budget-warning");
const productCards = document.querySelectorAll(".product-card");
const cartItemsDiv = document.getElementById("cart-items");
const cartTotalDiv = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");

let selectedBudget = null;
let selectedFilter = "all";
let cart = [];

productCards.forEach((card) => {
  const productName = card.querySelector("h3").textContent;
  const productPrice = card.querySelector(".product-price").textContent;
  const priceValue = parseInt(productPrice.replace("$", ""));
  
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Add to Cart";
  button.className = "add-to-cart-btn";
  button.addEventListener("click", () => addToCart(productName, priceValue));
  
  card.appendChild(button);
});

function addToCart(productName, price) {
  cart.push({ name: productName, price: price, id: Date.now() });
  updateCartDisplay();
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartDisplay();
}

function updateCartDisplay() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    
    const itemName = document.createElement("span");
    itemName.textContent = `${item.name} - ${formatCurrency(item.price)}`;
    
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeFromCart(item.id));
    
    cartItem.appendChild(itemName);
    cartItem.appendChild(removeBtn);
    cartItemsDiv.appendChild(cartItem);
    
    total += item.price;
  });

  cartTotalDiv.textContent = `${formatCurrency(total)}`;
  updateBudgetRemaining(total);
}

function updateBudgetRemaining(cartTotal) {
  if (selectedBudget !== null) {
    const remaining = selectedBudget - cartTotal;
    if (budgetRemaining) {
      budgetRemaining.textContent = `${formatCurrency(remaining)} remaining`;
    }
    if (budgetWarning) {
      const warningSpan = document.getElementById("budget-warning");
      if (remaining < 0) {
        warningSpan.textContent = `Over budget by ${formatCurrency(Math.abs(remaining))}`;
        warningSpan.className = "budget-warning over-budget";
      } else {
        warningSpan.textContent = `${formatCurrency(remaining)} remaining in budget`;
        warningSpan.className = "budget-warning within-budget";
      }
    }
  }
}

clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCartDisplay();
});

budgetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedBudget = Number(button.dataset.budget);
    budgetButtons.forEach((btn) => btn.classList.toggle("active", btn === button));

    if (budgetAmount) {
      budgetAmount.textContent = `$${selectedBudget}`;
    }
    updateBudgetRemaining(cart.reduce((sum, item) => sum + item.price, 0));
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    applyCategoryFilter();
  });
});

function applyCategoryFilter() {
  productCards.forEach((card) => {
    const category = card.dataset.category;
    if (selectedFilter === "all" || category === selectedFilter) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function formatCurrency(value) {
  return `$${value.toFixed(0)}`;
}
