const budgetButtons = document.querySelectorAll("[data-budget]");
const filterButtons = document.querySelectorAll("[data-filter]");
const budgetAmount = document.getElementById("budget-amount");
const budgetRemaining = document.getElementById("budget-remaining");
const budgetWarning = document.getElementById("budget-warning");
const productCards = document.querySelectorAll(".product-card");

let selectedBudget = null;
let selectedFilter = "all";

budgetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedBudget = Number(button.dataset.budget);
    budgetButtons.forEach((btn) => btn.classList.toggle("active", btn === button));

    if (budgetAmount) {
      budgetAmount.textContent = `$${selectedBudget}`;
    }
    if (budgetRemaining) {
      budgetRemaining.textContent = `${formatCurrency(selectedBudget)} remaining`;
    }
    if (budgetWarning) {
      budgetWarning.textContent = "Budget selected. Add items to the cart to stay within it.";
      budgetWarning.className = "budget-warning within-budget";
    }
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
