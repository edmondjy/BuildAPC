/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */


document.addEventListener("DOMContentLoaded", () => {
  const budgetButtons = document.querySelectorAll("[data-budget]");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const budgetAmountDisplay = document.getElementById("budget-amount");
  const budgetRemainingDisplay = document.getElementById("budget-remaining");
  const budgetWarningDisplay = document.getElementById("budget-warning");
  const productCards = document.querySelectorAll(".product-card");
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotalDiv = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart");
  const productListContainer = document.getElementById("product-list");
    const sortPriceDropdown = document.getElementById("sort-price");

  let selectedBudget = null;
  let selectedFilter = "all";
  let selectedPriceLimit = "all"; 
  let cart = [];

  productCards.forEach((card, index) => {
    card.dataset.originalIndex = index;

    const productName = card.querySelector("h3").textContent;
    const productPriceText = card.querySelector(".product-price").textContent;
    const priceValue = parseInt(productPriceText.replace("$", ""));
    
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Add to Build";
    button.className = "add-to-cart-btn";
    button.addEventListener("click", () => addToCart(productName, priceValue));
    
    card.appendChild(button);
  });

  // cart function
  function addToCart(productName, price) {
    cart.unshift({ name: productName, price: price, id: Date.now() });
    updateUI();
  }

  function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateUI();
  }

  function updateUI() {
    cartItemsDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      
      cartItem.innerHTML = `
        <span>${item.name} - $${item.price}</span>
        <button class="remove-button">Remove</button>
      `;

      cartItem.querySelector(".remove-button").addEventListener("click", () => removeFromCart(item.id));
      
      cartItemsDiv.appendChild(cartItem);
      total += item.price;
    });

    cartTotalDiv.textContent = `$${total}`;

    // Budget Logic
    if (selectedBudget === null) {
      budgetRemainingDisplay.textContent = "Select a budget";
      budgetWarningDisplay.textContent = "Pick a budget and add parts to the cart.";
      budgetWarningDisplay.className = "budget-warning";
    } else {
      const remaining = selectedBudget - total;
      budgetRemainingDisplay.textContent = `$${remaining}`;

      if (remaining < 0) {
        budgetWarningDisplay.textContent = `Over budget by $${Math.abs(remaining)}!`;
        budgetWarningDisplay.className = "budget-warning over-budget";
      } else {
        budgetWarningDisplay.textContent = "Your build is within budget.";
        budgetWarningDisplay.className = "budget-warning within-budget";
      }
    }
  }

  // Filter & sort logic
  function applyFilters() {
    productCards.forEach((card) => {
      const category = card.dataset.category;
      const price = parseInt(card.querySelector(".product-price").textContent.replace("$", ""));
      const matchesCategory = selectedFilter === "all" || category === selectedFilter;
      const matchesPrice = selectedPriceLimit === "all" || price <= parseInt(selectedPriceLimit);

      if (matchesCategory && matchesPrice) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  function sortProducts(order) {
    const cards = Array.from(productListContainer.querySelectorAll(".product-card"));

    cards.sort((a, b) => {
      if (order === "default") {
        return a.dataset.originalIndex - b.dataset.originalIndex;
      }

      const priceA = parseInt(a.querySelector(".product-price").textContent.replace("$", ""));
      const priceB = parseInt(b.querySelector(".product-price").textContent.replace("$", ""));

      if (order === "low-to-high") {
        return priceA - priceB;
      } else if (order === "high-to-low") {
        return priceB - priceA;
      }
      return 0; 
    });

    cards.forEach(card => productListContainer.appendChild(card));
  }

  // --- EVENT LISTENERS ---
  
  // Clear Cart
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateUI();
  });

  // Budget Buttons
  budgetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedBudget = Number(button.dataset.budget);
      budgetButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      budgetAmountDisplay.textContent = `$${selectedBudget}`;
      updateUI();
    });
  });

  // Category Filter Buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedFilter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      applyFilters();
    });
  });

  // Sorting Dropdown Listener
  if (sortPriceDropdown) {
    sortPriceDropdown.addEventListener("change", (event) => {
      sortProducts(event.target.value);
    });
  }
});