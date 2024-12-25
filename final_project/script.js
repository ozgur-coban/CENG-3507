const addAndSync = (key, object) => {
  localStorage.setItem(key, JSON.stringify(object));
  // console.log("synced", key, object);
};
const loadDataFromLocalStorage = () => {
  const farmerData = localStorage.getItem("farmerArray");
  const rawBerryData = localStorage.getItem("rawBerryObject");
  const rawInputData = localStorage.getItem("rawInput");
  const purchaseData = localStorage.getItem("purchaseInfoArray");
  const productCategoriesData = localStorage.getItem("productCategoriesObject");
  const customerData = localStorage.getItem("customerArray");
  const orderData = localStorage.getItem("orderArray");
  const categoryTotalRevenueData = localStorage.getItem("categoryTotalRevenue");

  if (farmerData) farmerArray.push(...JSON.parse(farmerData));
  if (rawBerryData) Object.assign(rawBerryObject, JSON.parse(rawBerryData));
  if (rawBerryData) {
    rawInput = parseInt(rawInputData);
  }
  if (purchaseData) purchaseInfoArray.push(...JSON.parse(purchaseData));
  if (productCategoriesData) {
    Object.assign(productCategoriesObject, JSON.parse(productCategoriesData));
  }
  if (customerData) customerArray.push(...JSON.parse(customerData));
  if (orderData) orderArray.push(...JSON.parse(orderData));
  if (categoryTotalRevenueData)
    Object.assign(categoryTotalRevenue, JSON.parse(categoryTotalRevenueData));

  // console.log("farmerArray", farmerArray);
  // console.log("rawBerryObject", rawBerryObject);
  // console.log("rawInput", rawInput);
  // console.log("purchaseInfoArray", purchaseInfoArray);
  // console.log("productCategoriesObject", productCategoriesObject);
  // console.log("customerArray", customerArray);
  // console.log("orderArray", orderArray);
  // console.log("categoryTotalRevenue", categoryTotalRevenue);
};

const currentDate = new Date();
const farmerArray = [];
let rawInput = 0;

// localStorage.setItem("farmerArray", JSON.stringify(farmerArray));
const checkPhoneNumber = (phoneNumber) => {
  if (/^\d{10}$/.test(phoneNumber)) {
    return true;
  } else {
    alert("enter a valid phone number");
    return false;
  }
};

const toggleHtmlElement = (element) => {
  element.style.display = element.style.display === "none" ? "block" : "none";
};

const addFarmer = (id, name, surname, phoneNumber, location) => {
  farmerArray.push({
    farmerId: id,
    farmerName: name.trim(),
    farmerSurname: surname.trim(),
    farmerPhoneNumber: phoneNumber,
    farmerLocation: location,
  });
};

const updateFarmer = (farmerId, name, surname, phoneNumber, location) => {
  const farmer = findFarmer(farmerId);

  if (farmer && checkPhoneNumber(phoneNumber)) {
    farmer.farmerName = name.trim();
    farmer.farmerSurname = surname.trim();
    farmer.farmerPhoneNumber = phoneNumber;
    farmer.farmerLocation = location;
  }
  addAndSync("farmerArray", farmerArray);
};

const findFarmer = (farmerId, showAlert = true) => {
  const farmer = farmerArray.find((farmer) => farmer.farmerId === farmerId);

  if (!farmer) {
    if (showAlert) alert("Farmer cannot be found");
    return null;
  }
  return farmer;
};

const findFarmerByName = (name, showAlert = true) => {
  const farmer = farmerArray.find((farmer) => farmer.farmerName === name);
  if (!farmer) {
    if (showAlert) alert("Farmer cannot be found");
    return null;
  }
  return farmer;
};

const findFarmerByLocation = (location, showAlert = true) => {
  const farmer = farmerArray.find(
    (farmer) => farmer.farmerLocation === location
  );
  if (!farmer) {
    if (showAlert) alert("Farmer cannot be found");
    return null;
  }
  return farmer;
};

const deleteFarmer = (farmerId) => {
  const farmer = findFarmer(farmerId);

  farmerArray.splice(farmerArray.indexOf(farmer), 1);

  addAndSync("farmerArray", farmerArray);
};

const handleAddFarmer = () => {
  const farmerId = parseInt(document.getElementById("farmer-id").value);

  if (isNaN(farmerId)) {
    alert("enter a valid id");
    return;
  }
  if (findFarmer(farmerId, false)) {
    alert("cant be more than 1 farmer with same id");
    return;
  }

  const farmerName = document.getElementById("farmer-name").value;
  const farmerSurname = document.getElementById("farmer-surname").value;
  const farmerPhoneNumber = parseInt(
    document.getElementById("farmer-phone").value
  );
  const farmerLocation = document.getElementById("farmer-location").value;

  if (!farmerName || !farmerSurname || !farmerPhoneNumber || !farmerLocation) {
    alert("fill all the fields");
    return;
  }
  if (!checkPhoneNumber(document.getElementById("farmer-phone").value)) {
    alert("enter a valid phone number");
    return;
  }
  addFarmer(
    farmerId,
    farmerName,
    farmerSurname,
    farmerPhoneNumber,
    farmerLocation
  );
  populateGeneralFarmerTable();
  addAndSync("farmerArray", farmerArray);
};

const handleDeleteFarmer = () => {
  const farmerId = parseInt(document.getElementById("farmer-id").value);
  deleteFarmer(farmerId);

  populateGeneralFarmerTable();
  addAndSync("farmerArray", farmerArray);
};

const handleUpdateFarmer = () => {
  const farmerId = parseInt(document.getElementById("farmer-id").value);
  updateFarmer(farmerId);

  populateGeneralFarmerTable();
  addAndSync("farmerArray", farmerArray);
};

const handleSearchFarmer = () => {
  const farmerName = document.getElementById("search-input").value;

  if (farmerName) {
    populateSearchTableWithName(farmerName);
  }
};

const handleSearchFarmerByLocation = () => {
  const farmerLocation = document.getElementById("search-input").value;

  if (farmerLocation) {
    populateSearchTableWithLocation(farmerLocation);
  }
};

const toggleUpdateFarmerModal = (farmerId) => {
  const updateFarmerModal = document.getElementById("updateFarmerModal");
  toggleHtmlElement(updateFarmerModal);

  document.getElementById("submit-update-farmer").onclick = () => {
    const farmerName =
      document.getElementById("update-farmer-name").value || undefined;
    const farmerSurname =
      document.getElementById("update-farmer-surname").value || undefined;
    const farmerPhoneNumber =
      parseInt(document.getElementById("update-farmer-phone").value) ||
      undefined;
    const farmerLocation =
      document.getElementById("update-farmer-location").value || undefined;
    updateFarmer(
      farmerId,
      farmerName,
      farmerSurname,
      farmerPhoneNumber,
      farmerLocation
    );

    populateGeneralFarmerTable();
    toggleHtmlElement(updateFarmerModal);
  };
};

const addFarmerButton = document
  .getElementById("add-farmer-button")
  .addEventListener("click", handleAddFarmer);

const searchByNameButton = document
  .getElementById("search-by-name-button")
  .addEventListener("click", handleSearchFarmer);

const searchByLocationButton = document
  .getElementById("search-by-location-button")
  .addEventListener("click", handleSearchFarmerByLocation);

const populateGeneralFarmerTable = () => {
  const farmerTable = document
    .getElementById("farmer-table")
    .querySelector("tbody");
  farmerTable.innerHTML = "";
  farmerArray.forEach((farmer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <tr>
            <td>${farmer.farmerId}</td>
            <td>${farmer.farmerName}</td>
            <td>${farmer.farmerSurname}</td>
            <td>${farmer.farmerPhoneNumber}</td>
            <td>${farmer.farmerLocation}</td>
            <td><button class="delete-btn" data-farmer-id="${farmer.farmerId}">Delete</button></td>
            <td><button class="update-btn" data-farmer-id="${farmer.farmerId}">Update</button></td>
        </tr>
    `;
    farmerTable.appendChild(row);
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const farmerId = parseInt(button.getAttribute("data-farmer-id"));
      deleteFarmer(farmerId);
      addAndSync("farmerArray", farmerArray);
      populateGeneralFarmerTable();
    });
  });

  const updateButtons = document.querySelectorAll(".update-btn");
  updateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const farmerId = parseInt(button.getAttribute("data-farmer-id"));
      toggleUpdateFarmerModal(farmerId);
      addAndSync("farmerArray", farmerArray);
      populateGeneralFarmerTable();
    });
  });
};

const populateSearchTableWithName = (farmerName) => {
  const searchTable = document
    .getElementById("search-table")
    .querySelector("tbody");
  searchTable.innerHTML = "";

  const farmersWithName = farmerArray.filter(
    (farmer) => farmer.farmerName === farmerName.trim()
  );

  farmersWithName.forEach((farmer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <tr>
            <td>${farmer.farmerId}</td>
            <td>${farmer.farmerName}</td>
            <td>${farmer.farmerSurname}</td>
            <td>${farmer.farmerPhoneNumber}</td>
            <td>${farmer.farmerLocation}</td>
        </tr>
    `;
    searchTable.appendChild(row);
  });
};

const populateSearchTableWithLocation = (farmerLocation) => {
  const searchTable = document
    .getElementById("search-table")
    .querySelector("tbody");
  searchTable.innerHTML = "";

  const farmersWithLocation = farmerArray.filter(
    (farmer) => farmer.farmerLocation === farmerLocation.trim()
  );

  farmersWithLocation.forEach((farmer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <tr>
            <td>${farmer.farmerId}</td>
            <td>${farmer.farmerName}</td>
            <td>${farmer.farmerSurname}</td>
            <td>${farmer.farmerPhoneNumber}</td>
            <td>${farmer.farmerLocation}</td>
        </tr>
    `;
    searchTable.appendChild(row);
  });
};

const populateLocationTable = () => {
  const searchTable = document
    .getElementById("search-table")
    .querySelector("tbody");
  searchTable.innerHTML = "";
  farmerArray.forEach((farmer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <tr>
            <td>${farmer.farmerId}</td>
            <td>${farmer.farmerName}</td>
            <td>${farmer.farmerSurname}</td>
            <td>${farmer.farmerPhoneNumber}</td>
            <td>${farmer.farmerLocation}</td>
        </tr>
    `;
    searchTable.appendChild(row);
  });
};

// end of 1,1

const purchaseInfoArray = [];
// localStorage.setItem("purchaseInfoArray", JSON.stringify(purchaseInfoArray));
const addPurchaseInfo = (
  purchaseId,
  farmerId,
  datePurchased,
  quantityPurchased,
  pricePerUnit
) => {
  purchaseInfoArray.push({
    purchaseId,
    farmerId,
    datePurchased,
    quantityPurchased,
    pricePerUnit,
    totalSpent: quantityPurchased * pricePerUnit,
  });
  addAndSync("purchaseInfoArray", purchaseInfoArray);
};

const findPurchaseInfo = (purchaseId, showAlert = true) => {
  const purchaseInfo = purchaseInfoArray.find(
    (purchaseInfo) => purchaseInfo.purchaseId === purchaseId
  );

  if (!purchaseInfo) {
    if (showAlert) alert("Farmer cannot be found");
    return null;
  }
  return purchaseInfo;
};

const handleAddPurchaseInfo = (formId) => {
  // Get the form element based on the dynamic formId
  const form = document.getElementById(formId);

  if (!form) {
    console.error(`Form with id ${formId} not found!`);
    return;
  }

  // Extract the numeric suffix from formId, e.g., "1" from "add-purchase-info-form-1"
  const formIndex = formId.match(/\d+$/)[0]; // This will match the last digits of the formId

  // Select input fields using dynamically generated IDs based on formIndex
  const purchaseIdInput = form.querySelector(`#purchase-id-${formIndex}`);
  const farmerIdInput = form.querySelector(
    `#farmer-id-for-purchase-${formIndex}`
  );
  const datePurchasedInput = form.querySelector(`#date-purchased-${formIndex}`);
  const quantityPurchasedInput = form.querySelector(
    `#quantity-purchased-${formIndex}`
  );
  const pricePerUnitInput = form.querySelector(`#price-per-unit-${formIndex}`);

  // Check if any input field is missing
  if (
    !purchaseIdInput ||
    !farmerIdInput ||
    !datePurchasedInput ||
    !quantityPurchasedInput ||
    !pricePerUnitInput
  ) {
    console.error("Some form fields are missing!");
    return;
  }

  // Get the values from the input fields
  const purchaseId = parseInt(purchaseIdInput.value);
  const farmerId = parseInt(farmerIdInput.value);
  const datePurchased = datePurchasedInput.value;
  const quantityPurchased = parseFloat(quantityPurchasedInput.value);
  const pricePerUnit = parseFloat(pricePerUnitInput.value);

  // Validate the form fields
  if (isNaN(purchaseId) || isNaN(farmerId)) {
    alert("Enter a valid ID");
    return;
  }

  if (!datePurchased || isNaN(quantityPurchased) || isNaN(pricePerUnit)) {
    alert("Fill all the fields");
    return;
  }

  if (findPurchaseInfo(purchaseId, false)) {
    alert("Can't have more than 1 farmer with the same ID");
    return;
  }

  const farmerToBeAssigned = findFarmer(farmerId, false);
  if (!farmerToBeAssigned) {
    alert("Farmer cannot be found");
    return;
  }

  // Add the purchase info
  addPurchaseInfo(
    purchaseId,
    farmerId,
    datePurchased,
    quantityPurchased,
    pricePerUnit
  );

  // Populate the purchase info table
  populatePurchaseInfoTable(purchaseInfoArray);

  // Update the raw input
  rawInput = rawInput + quantityPurchased;
  addAndSync("rawInput", rawInput);
  addAndSync("purchaseInfoArray", purchaseInfoArray);
  updateRawBerryObject();
  updateTotalRawInputDisplay();

  // Clear input fields after submission
  purchaseIdInput.value = "";
  farmerIdInput.value = "";
  datePurchasedInput.value = "";
  quantityPurchasedInput.value = "";
  pricePerUnitInput.value = "";
};

// Event listener for form button clicks
document.querySelectorAll(".add-purchase-info-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const formId = button.closest("form").id; // Get the form ID dynamically
    handleAddPurchaseInfo(formId);
  });
});

const populatePurchaseInfoTable = (filteredArray = purchaseInfoArray) => {
  const purchaseInfoTable = document
    .getElementById("purchase-info-table")
    .querySelector("tbody");
  purchaseInfoTable.innerHTML = "";
  filteredArray.forEach((purchaseInfo) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <tr>
            <td>${purchaseInfo.purchaseId}</td>
            <td>${purchaseInfo.farmerId}</td>
            <td>${purchaseInfo.datePurchased}</td>
            <td>${purchaseInfo.quantityPurchased}</td>
            <td>${purchaseInfo.pricePerUnit}</td>
            <td>${purchaseInfo.totalSpent}</td>
        </tr>
    `;
    purchaseInfoTable.appendChild(row);
  });
};
document
  .getElementById("search-by-farmer-id-button")
  .addEventListener("click", () => {
    document.getElementById("search-container").style.display = "block";
    document.getElementById("filter-container").style.display = "none";
  });

document
  .getElementById("perform-search-button")
  .addEventListener("click", () => {
    const farmerId = parseInt(
      document.getElementById("search-farmer-id").value
    );
    const filteredArray = purchaseInfoArray.filter(
      (purchase) => purchase.farmerId === farmerId
    );
    if (filteredArray.length === 0) {
      alert("No purchases found for this Farmer ID.");
    }
    populatePurchaseInfoTable(filteredArray);
  });

// Sort by Date
document.getElementById("sort-by-date-button").addEventListener("click", () => {
  const sortedArray = [...purchaseInfoArray].sort((a, b) => {
    const dateA = new Date(a.datePurchased);
    const dateB = new Date(b.datePurchased);
    return dateA - dateB; // Ascending order
  });
  populatePurchaseInfoTable(sortedArray);
});

// Filter by Purchase Amount
document
  .getElementById("filter-by-amount-button")
  .addEventListener("click", () => {
    document.getElementById("filter-container").style.display = "block";
    document.getElementById("search-container").style.display = "none";
  });

document
  .getElementById("perform-filter-button")
  .addEventListener("click", () => {
    const minAmount = parseFloat(
      document.getElementById("filter-amount").value
    );
    const filteredArray = purchaseInfoArray.filter((purchase) => {
      const totalPrice = purchase.quantityPurchased * purchase.pricePerUnit;
      return totalPrice > minAmount;
    });
    if (filteredArray.length === 0) {
      alert("No purchases found above this amount.");
    }
    populatePurchaseInfoTable(filteredArray);
  });

function calculateTotalCost(records) {
  return records.reduce((total, record) => {
    return total + record.totalSpent;
  }, 0);
}
function filterRecordsByDate(records, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return records.filter((record) => {
    const purchaseDate = new Date(record.datePurchased);
    return purchaseDate >= start && purchaseDate <= end;
  });
}

function calculateExpensesForPeriod(records, period) {
  const { startDate, endDate } = getPeriodDates(period);

  const filteredRecords = filterRecordsByDate(records, startDate, endDate);
  return calculateTotalCost(filteredRecords);
}

document.getElementById("calculate-expenses").addEventListener("click", () => {
  const period = document.getElementById("time-period").value;
  const expenses = calculateExpensesForPeriod(purchaseInfoArray, period);
  document.getElementById("results").innerText = `Total Expenses: ${expenses}`;
});

const updateTotalRawInputDisplay = () => {
  const totalRawInputElement = document.getElementById("total-raw-input");
  const totalRawInputElementTwo = document.getElementById("total-raw-input-2");
  const rawInput = JSON.parse(localStorage.getItem("rawInput")) || 0; // Get the current value from localStorage
  totalRawInputElement.textContent = rawInput; // Update the display
  totalRawInputElementTwo.textContent = rawInput;
};

// start of module 2

const productCategoriesObject = {
  hundredGrams: {
    categoryWeight: 0.1,
    categoryPrice: 2,
    categoryDemand: 1000 * 0.1,
    categoryRemaining: 0,
    categoryMinRemaining: 1000 * 0.1,
  },
  halfKg: {
    categoryWeight: 0.5,
    categoryPrice: 5,
    categoryDemand: 200 * 0.5,
    categoryRemaining: 0,
    categoryMinRemaining: 200 * 0.5,
  },
  oneKg: {
    categoryWeight: 1,
    categoryPrice: 10,
    categoryDemand: 100 * 1,
    categoryRemaining: 0,
    categoryMinRemaining: 100 * 1,
  },
  twoKg: {
    categoryWeight: 2,
    categoryPrice: 20,
    categoryDemand: 50 * 2,
    categoryRemaining: 0,
    categoryMinRemaining: 50 * 2,
  },
  fiveKg: {
    categoryWeight: 5,
    categoryPrice: 40,
    categoryDemand: 20 * 5,
    categoryRemaining: 0,
    categoryMinRemaining: 20 * 5,
  },
  tenKg: {
    categoryWeight: 10,
    categoryPrice: 80,
    categoryDemand: 10 * 10,
    categoryRemaining: 0,
    categoryMinRemaining: 10 * 10,
  },
};

// localStorage.setItem(
//   "productCategoriesObject",
//   JSON.stringify(productCategoriesObject)
// );

const addPremiumCategory = (event) => {
  event.preventDefault(); // Prevent the form from refreshing the page

  const categoryName = document.getElementById("categoryName").value;
  const categoryWeight = parseFloat(
    document.getElementById("categoryWeight").value
  );
  const categoryPrice = parseFloat(
    document.getElementById("categoryPrice").value
  );
  const categoryDemand = parseFloat(
    document.getElementById("categoryDemand").value
  );
  const categoryRemaining = parseFloat(
    document.getElementById("categoryRemaining").value
  );
  const categoryMinRemaining = parseFloat(
    document.getElementById("categoryMinRemaining").value
  );
  // Error check for category name
  if (!categoryName || categoryName.trim() === "") {
    alert("Category name is required.");
    return;
  }

  // Error check for non-negative numbers
  if (isNaN(categoryWeight) || categoryWeight <= 0) {
    alert("Category weight must be a positive number.");
    return;
  }
  if (isNaN(categoryPrice) || categoryPrice <= 0) {
    alert("Category price must be a positive number.");
    return;
  }
  if (isNaN(categoryDemand) || categoryDemand < 0) {
    alert("Category demand must be a non-negative number.");
    return;
  }
  if (isNaN(categoryRemaining) || categoryRemaining < 0) {
    alert("Category remaining must be a non-negative number.");
    return;
  }
  if (isNaN(categoryMinRemaining) || categoryMinRemaining < 0) {
    alert("Category minimum remaining must be a non-negative number.");
    return;
  }

  const newCategory = {
    categoryWeight: categoryWeight,
    categoryPrice: categoryPrice,
    categoryDemand: categoryDemand,
    categoryRemaining: categoryRemaining,
    categoryMinRemaining: categoryMinRemaining,
  };

  // Add the new category to the productCategoriesObject with the provided name
  productCategoriesObject[categoryName] = newCategory;
  categoryTotalRevenue[categoryName] = {
    revenue: 0,
    unitPrice: newCategory.categoryPrice,
    quantitySold: 0,
  };
  // Save the updated productCategoriesObject in localStorage
  addAndSync("productCategoriesObject", productCategoriesObject);
  addAndSync("categoryTotalRevenue", categoryTotalRevenue);
  populateAllTables();
};

// Attach the event listener to the form
document
  .getElementById("categoryForm")
  .addEventListener("submit", addPremiumCategory);

const calculateAdvisedTotalRemainingRawInput = () => {
  let totalMinRemaining = 0;
  for (let category in productCategoriesObject) {
    totalMinRemaining += productCategoriesObject[category].categoryMinRemaining;
  }
  // it is advised to keep at least this amount of raw input , this ensures at least  having the double of the current demand
  return totalMinRemaining;
};

const displayDemandForCategory = (categoryName) => {
  const category = productCategoriesObject[categoryName];
  if (!category) {
    alert("Category not found!");
    return;
  }
  document.getElementById("demand-category").innerText =
    category.categoryDemand;
};

function satisfyMinRemaining() {
  let totalMinRemaining = 0;

  for (let category in productCategoriesObject) {
    const object = productCategoriesObject[category];
    if (object.categoryRemaining < object.categoryMinRemaining) {
      totalMinRemaining +=
        object.categoryMinRemaining - object.categoryRemaining;
    }
  }

  if (rawInput >= totalMinRemaining) {
    // If there is enough raw input to meet all minimum requirements
    for (let category in productCategoriesObject) {
      const categoryObj = productCategoriesObject[category];
      if (categoryObj.categoryRemaining < categoryObj.categoryMinRemaining) {
        const usedAmount =
          categoryObj.categoryMinRemaining - categoryObj.categoryRemaining;
        categoryObj.categoryRemaining = categoryObj.categoryMinRemaining;
        rawInput -= usedAmount;
      }
    }
  } else {
    // If there is not enough raw input to meet all minimum requirements
    alert(
      "Not enough raw input to meet all minimum requirements. Please restock."
    );
  }

  addAndSync("rawInput", rawInput);
  updateRawBerryObject();
  updateTotalRawInputDisplay();
  addAndSync("productCategoriesObject", productCategoriesObject);
  populateQuantityRemainingForAllCategoriesTable();
}
document
  .getElementById("satisfy-min-remaining-btn")
  .addEventListener("click", satisfyMinRemaining);

function processPurchase(categoryName, quantityBought) {
  const category = productCategoriesObject[categoryName];
  if (!category) {
    alert("Category not found!");
    return false;
  }

  const amountBoughtInKg = quantityBought * category.categoryWeight;

  if (amountBoughtInKg >= category.categoryRemaining) {
    alert("Not enough raw input available for the purchase.");
    return false;
  }

  // 1. Decrease categoryRemaining
  category.categoryRemaining -= amountBoughtInKg;

  // 2. Smoother proportional adjustment
  const initialRemaining = category.categoryRemaining + amountBoughtInKg;
  const proportion = amountBoughtInKg / initialRemaining;

  // Use a damping factor to smooth the increase
  const dampingFactor = 0.5;

  // Smooth demand increase
  const demandIncrease = category.categoryDemand * proportion * dampingFactor;
  category.categoryDemand += demandIncrease;

  // Smooth price increase
  const priceIncrease = category.categoryPrice * proportion * dampingFactor;
  category.categoryPrice += priceIncrease;

  // Sync changes and update tables
  addAndSync("productCategoriesObject", productCategoriesObject);
  populateOrderHistoryTable();
  return true;
}

const calculateTotalPrice = (categoryName, amountBought) => {
  const category = productCategoriesObject[categoryName];
  const amountBoughtInKg = amountBought * category.categoryWeight;
  if (!category) {
    alert("Category not found!");
    return;
  }
  if (amountBoughtInKg >= category.categoryRemaining) {
    alert("Not enough raw input available for the purchase2.");
    return;
  }

  const totalPrice = category.categoryPrice * amountBought;
  return totalPrice;
};

const setCategoryPriceManually = (categoryName, newPrice) => {
  const category = productCategoriesObject[categoryName];
  const correctedPrice = parseInt(newPrice);
  if (!category) {
    alert("Category not found!");
    return;
  }
  if (isNaN(correctedPrice)) {
    alert("enter a valid price");
    return;
  }
  category.categoryPrice = correctedPrice;
  addAndSync("productCategoriesObject", productCategoriesObject);
};

const populateQuantityRemainingForAllCategoriesTable = () => {
  // Get the table body element
  const tableBody = document.querySelector("#quantity-remaining-table tbody");

  // Clear the table body before appending new rows
  tableBody.innerHTML = "";

  // Loop through the categories and create a row for each
  Object.entries(productCategoriesObject).forEach(
    ([categoryName, category]) => {
      // Create a new row
      const row = document.createElement("tr");

      // Create category name cell
      const categoryCell = document.createElement("td");
      categoryCell.textContent = categoryName;
      row.appendChild(categoryCell);

      // Create remaining quantity cell
      const remainingCell = document.createElement("td");
      remainingCell.textContent = `${category.categoryRemaining} kg`; // Remaining quantity
      row.appendChild(remainingCell);
      // Create remaining quantity cell
      const categoryPriceCell = document.createElement("td");
      categoryPriceCell.textContent = `${category.categoryPrice} `; // Remaining quantity
      row.appendChild(categoryPriceCell);

      // Create update button cell
      const addRawInputCell = document.createElement("td");
      const addRawInputButton = document.createElement("button");
      addRawInputButton.textContent = "Add Raw Input";
      addRawInputButton.addEventListener("click", () => {
        const rawInputToAdd = prompt(
          `Enter the raw material to be added to ${categoryName}:`,
          0
        );
        if (rawInputToAdd !== null && !isNaN(rawInputToAdd)) {
          const weightedAmount = rawInputToAdd * category.categoryWeight;
          if (weightedAmount > rawInput) {
            alert("Not enough raw material to add");
            return;
          }
          rawInput -= weightedAmount;
          category.categoryRemaining += weightedAmount;
          addAndSync("rawInput", rawInput);
          updateRawBerryObject();
          updateTotalRawInputDisplay();
          addAndSync("productCategoriesObject", productCategoriesObject);
          populateQuantityRemainingForAllCategoriesTable(); // Refresh table
        }
      });
      addRawInputCell.appendChild(addRawInputButton);
      row.appendChild(addRawInputCell);

      // Create add raw input button cell
      const updateInputCell = document.createElement("td");
      const updateInputButton = document.createElement("button");
      updateInputButton.textContent = "Update Category Price";
      updateInputButton.addEventListener("click", () => {
        const updatedPrice = prompt(`Enter the new price for ${categoryName}:`);
        if (updatedPrice !== null && !isNaN(updatedPrice)) {
          setCategoryPriceManually(categoryName, updatedPrice);
          addAndSync("productCategoriesObject", productCategoriesObject);
          populateQuantityRemainingForAllCategoriesTable(); // Refresh table
        }
      });
      updateInputCell.appendChild(updateInputButton);
      row.appendChild(updateInputButton);

      // Append the row to the table body
      tableBody.appendChild(row);

      addAndSync("productCategoriesObject", productCategoriesObject);
    }
  );
};

// start of module 3

const customerArray = [];
const orderArray = [];
// localStorage.setItem("customerArray", JSON.stringify(customerArray));
// localStorage.setItem("orderArray", JSON.stringify(orderArray));

const addCustomer = (id, name, surname, phoneNumber, location) => {
  customerArray.push({
    customerId: id,
    customerName: name.trim(),
    customerSurname: surname.trim(),
    customerPhoneNumber: phoneNumber,
    customerLocation: location,
  });
  addAndSync("customerArray", customerArray);
};

const addOrder = (
  id,
  customer,
  productCategory,
  quantity,
  totalPrice,
  orderedDate = new Date().toLocaleDateString()
) => {
  orderArray.push({
    orderId: id,
    customerInformation: {
      customerName: customer.customerName,
      customerSurname: customer.customerSurname,
      customerLocation: customer.customerLocation,
      customerPhoneNumber: customer.customerPhoneNumber,
    },
    orderedProductCategory: productCategory,
    quantityOrdered: quantity,
    revenueOfOrder: totalPrice,
    orderDate: orderedDate,
  });
  addAndSync("orderArray", orderArray);
};

const findCustomer = (id, showAlert = true) => {
  const customer = customerArray.find((customer) => customer.customerId === id);
  if (!customer) {
    if (showAlert) alert("Customer cannot be found");
    return null;
  }
  return customer;
};

const findOrder = (id, showAlert = true) => {
  const order = orderArray.find((order) => order.orderId === id);
  if (!order) {
    if (showAlert) alert("Order cannot be found");
    return null;
  }
  return order;
};

const handleAddCustomer = () => {
  const customerId = parseInt(document.getElementById("customer-id").value);

  if (isNaN(customerId)) {
    alert("Enter a valid ID.");
    return;
  }

  if (findCustomer(customerId, false)) {
    alert("Cannot have more than one customer with the same ID.");
    return;
  }

  const customerName = document.getElementById("customer-name").value;
  const customerSurname = document.getElementById("customer-surname").value;
  const customerPhoneNumber = parseInt(
    document.getElementById("customer-phone").value
  );
  const customerLocation = document.getElementById("customer-location").value;

  if (
    !customerName ||
    !customerSurname ||
    !customerPhoneNumber ||
    !customerLocation
  ) {
    alert("Please fill in all the fields.");
    return;
  }

  if (!checkPhoneNumber(document.getElementById("customer-phone").value)) {
    alert("Enter a valid phone number.");
    return;
  }

  addCustomer(
    customerId,
    customerName,
    customerSurname,
    customerPhoneNumber,
    customerLocation
  );
  addAndSync("customerArray", customerArray);
};

document
  .getElementById("add-customer-button")
  .addEventListener("click", handleAddCustomer);

// Function to populate the dropdown
const populateCustomerDropdown = () => {
  const dropdown = document.getElementById("customer-dropdown");

  // Clear existing options
  dropdown.innerHTML =
    '<option value="" disabled selected>Select a customer</option>';

  // Populate dropdown with customer data
  customerArray.forEach((customer) => {
    const option = document.createElement("option");
    option.value = customer.customerId; // Use customer ID as the value

    option.textContent = `${customer.customerName} (${customer.customerLocation})`; // Display name and location
    dropdown.appendChild(option);
  });
};

// Event handler for "Use Selected Customer" button
const handleCustomerSelection = () => {
  const dropdown = document.getElementById("customer-dropdown");
  const selectedCustomerId = parseInt(dropdown.value);

  if (!selectedCustomerId) {
    alert("Please select a customer.");
    return;
  }

  // Find the selected customer in the array
  const selectedCustomer = customerArray.find(
    (customer) => customer.customerId === parseInt(selectedCustomerId)
  );

  if (selectedCustomer) {
    return selectedCustomer;
  } else {
    alert("Customer not found.");
  }
};

const customerDropdown = document.getElementById("customer-dropdown");

// Event listener for dropdown changes
customerDropdown.addEventListener("change", () => {
  const selectedCustomer = handleCustomerSelection();

  // Perform actions with the selected customer
});

const handleAddOrder = (
  category,
  quantity,
  totalPrice,
  orderedDate = new Date().toLocaleDateString()
) => {
  const customer = handleCustomerSelection();
  if (!customer) {
    alert("Please select a customer.");
    return;
  }
  const orderId = orderArray.length + 1;
  addOrder(orderId, customer, category, quantity, totalPrice, orderedDate);

  addAndSync("orderArray", orderArray);
};

const handleBuyFromStock = () => {
  const quantityToBuy = parseInt(
    document.getElementById("quantity-to-buy").value
  );

  const categoryToBuy = document.getElementById("category-to-buy").value;
  // Get the selected date from the date picker
  const orderDateInput = document.getElementById("order-date").value;
  const orderedDate = orderDateInput
    ? new Date(orderDateInput).toLocaleDateString() // Use selected date
    : new Date().toLocaleDateString(); // Default to today's date if none selected

  if (isNaN(quantityToBuy)) {
    alert("Please enter a valid quantity to buy.");
    return;
  }
  if (quantityToBuy <= 0) {
    alert("Please enter a valid quantity to buy.");
    return;
  }
  if (!handleCustomerSelection()) {
    alert("Please select a customer.");
    return;
  }
  if (productCategoriesObject[categoryToBuy] === undefined) {
    alert("Please select a valid category.");
    return;
  }

  if (processPurchase(categoryToBuy, quantityToBuy) !== undefined) {
    const totalPrice = calculateTotalPrice(categoryToBuy, quantityToBuy);
    handleAddOrder(categoryToBuy, quantityToBuy, totalPrice, orderedDate);
    alert(`Total Price: ${totalPrice}`);
    // satisfyMinRemaining();

    for (let category in categoryTotalRevenue) {
      updateCategoryTotalRevenue(category);
    }

    addAndSync("categoryTotalRevenue", categoryTotalRevenue);
    addAndSync("orderArray", orderArray);
    addAndSync("customerArray", customerArray);
    addAndSync("productCategoriesObject", productCategoriesObject);
    populateQuantityRemainingForAllCategoriesTable();
    populateOrderHistoryTable();
    populateCategoryDemandTable();
    populateCategoryRevenueTable();
  } else {
    alert(
      "Purchase could not be processed. Please check the category and stock availability."
    );
  }
};

document
  .getElementById("buy-from-stock-button")
  .addEventListener("click", () => {
    handleBuyFromStock();
  });

const categoryTotalRevenue = {
  hundredGrams: {
    revenue: 0,
    unitPrice: productCategoriesObject.hundredGrams.categoryPrice,
    quantitySold: 0,
  },
  halfKg: {
    revenue: 0,
    unitPrice: productCategoriesObject.halfKg.categoryPrice,
    quantitySold: 0,
  },
  oneKg: {
    revenue: 0,
    unitPrice: productCategoriesObject.oneKg.categoryPrice,
    quantitySold: 0,
  },
  twoKg: {
    revenue: 0,
    unitPrice: productCategoriesObject.twoKg.categoryPrice,
    quantitySold: 0,
  },
  fiveKg: {
    revenue: 0,
    unitPrice: productCategoriesObject.fiveKg.categoryPrice,
    quantitySold: 0,
  },
  tenKg: {
    revenue: 0,
    unitPrice: productCategoriesObject.tenKg.categoryPrice,
    quantitySold: 0,
  },
};

// localStorage.setItem(
//   "categoryTotalRevenue",
//   JSON.stringify(categoryTotalRevenue)
// );

const updateCategoryTotalRevenue = (category) => {
  // Calculate total revenue and quantity sold for the specified category
  if (productCategoriesObject[category] === undefined) {
    alert("Please select a valid category.");
    return;
  }
  const { revenue, quantitySold } = orderArray.reduce(
    (acc, order) => {
      if (order.orderedProductCategory === category) {
        acc.revenue += order.revenueOfOrder;
        acc.quantitySold += order.quantityOrdered;
      }
      return acc;
    },
    { revenue: 0, quantitySold: 0 }
  );

  // Update the categoryTotalRevenue object
  categoryTotalRevenue[category].revenue = revenue;
  categoryTotalRevenue[category].quantitySold = quantitySold;
  categoryTotalRevenue[category].unitPrice =
    productCategoriesObject[category].categoryPrice;

  populateCategoryRevenueTable();
  addAndSync("categoryTotalRevenue", categoryTotalRevenue);
};

const populateCategoryRevenueTable = () => {
  const tableBody = document
    .getElementById("category-revenue-table")
    .querySelector("tbody");

  // Clear existing rows
  tableBody.innerHTML = "";

  let totalRevenue = 0; // Initialize total revenue

  for (let categoryName in categoryTotalRevenue) {
    const category = categoryTotalRevenue[categoryName];
    const revenue = category.revenue;
    const row = document.createElement("tr");

    totalRevenue += revenue; // Add to total revenue

    row.innerHTML = `
      <td>${categoryName}</td>
      <td>${category.quantitySold}</td>
      <td>${revenue.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  }

  // Display the total revenue
  const totalRevenueDisplay = document.getElementById("total-revenue-display");
  totalRevenueDisplay.textContent = `Total Revenue Across All Categories: $${totalRevenue.toFixed(
    2
  )}`;
};
const calculateTotalRevenueAcrossAllCategories = () => {
  let totalRevenue = 0;
  for (let category in categoryTotalRevenue) {
    totalRevenue += categoryTotalRevenue[category].revenue;
  }
  return totalRevenue;
};

const populateOrderHistoryTable = (filteredOrders = orderArray) => {
  const orderHistoryTable = document
    .getElementById("order-history-table")
    .querySelector("tbody");
  orderHistoryTable.innerHTML = "";

  filteredOrders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.customerInformation.customerName}</td>
      <td>${order.customerInformation.customerSurname}</td>
      <td>${order.customerInformation.customerPhoneNumber}</td>
      <td>${order.customerInformation.customerLocation}</td>
      <td>${order.orderedProductCategory}</td>
      <td>${order.quantityOrdered}</td>
      <td>${order.revenueOfOrder}</td>
      <td>${order.orderDate}</td>
    `;
    orderHistoryTable.appendChild(row);
  });
};
const filterOrders = () => {
  const customerNameFilter = document
    .getElementById("filter-customer-name")
    .value.toLowerCase();
  const categoryFilter = document
    .getElementById("filter-category")
    .value.toLowerCase();

  const filteredOrders = orderArray.filter((order) => {
    const matchesCustomerName = order.customerInformation.customerName
      .toLowerCase()
      .includes(customerNameFilter);
    const matchesCategory = order.orderedProductCategory
      .toLowerCase()
      .includes(categoryFilter);
    return matchesCustomerName && matchesCategory;
  });

  populateOrderHistoryTable(filteredOrders);
};

// Add event listeners for the filter inputs
document
  .getElementById("filter-customer-name")
  .addEventListener("input", filterOrders);
document
  .getElementById("filter-category")
  .addEventListener("input", filterOrders);
// end of module 3

// start of module 4
const getPeriodDates = (period) => {
  const today = new Date();
  let startDate, endDate;

  switch (period) {
    case "lastDay":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1); // 1 day ago
      startDate.setHours(0, 0, 0, 0); // Start of the previous day
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999); // End of today
      break;

    case "lastWeek":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7); // 7 days ago (1 week)
      startDate.setHours(0, 0, 0, 0); // Start of the week
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999); // End of today
      break;

    case "lastMonth":
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1); // 1 month ago
      startDate.setDate(1); // First day of the previous month
      startDate.setHours(0, 0, 0, 0); // Start of the previous month
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999); // End of today
      break;

    case "lastQuarter":
      const currentQuarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today);
      startDate.setMonth(currentQuarter * 3 - 3); // Start of the previous quarter
      startDate.setDate(1); // First day of the previous quarter
      startDate.setHours(0, 0, 0, 0); // Start of the quarter
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999); // End of today
      break;

    case "lastYear":
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1); // 1 year ago
      startDate.setMonth(0); // January 1st of last year
      startDate.setDate(1); // First day of last year
      startDate.setHours(0, 0, 0, 0); // Start of the year
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999); // End of today
      break;

    default:
      startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0); // Default to today
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999); // End of today
  }

  return { startDate, endDate };
};

const calculateRevenueOfOrdersFromPeriod = (period) => {
  const { startDate, endDate } = getPeriodDates(period);

  const filteredOrders = orderArray.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= startDate && orderDate <= endDate;
  });

  const totalRevenue = filteredOrders.reduce(
    (total, order) => total + order.revenueOfOrder,
    0
  );

  return totalRevenue;
};
// Accept period as parameter
const filterOrderHistoryByPeriod = (period) => {
  const { startDate, endDate } = getPeriodDates(period);
  const filteredOrders = orderArray.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= startDate && orderDate <= endDate;
  });
  populateOrderHistoryTable(filteredOrders);
  return filteredOrders;
};

// Listen for change on the order-period select input and pass the period to other functions
// Function to update the total income display for order period
const displayTotalIncomeForOrderPeriod = (period) => {
  const revenue = calculateRevenueOfOrdersFromPeriod(period);
  document.getElementById("total-income").innerText = revenue;
};

// Function to update the expenses display for order period
const displayExpensesForOrderPeriod = (period) => {
  const expenses = calculateExpensesForPeriod(purchaseInfoArray, period);
  document.getElementById("expenses").innerText = expenses;
};

// Function to update the tax display for order period
const displayTaxForOrderPeriod = (period) => {
  const income = calculateOverallIncomeFromPeriod(period);
  const tax = calculateTax(income);
  document.getElementById("tax").innerText = tax;
};

// Function to update the net income display for order period
const displayNetIncomeForOrderPeriod = (period) => {
  const netIncome = calculateNetIncomeFromPeriod(period);
  document.getElementById("net-income").innerText = netIncome;
};

// Listen for change on the order-period select input and pass the period to other functions
document.getElementById("order-period").addEventListener("change", (e) => {
  const selectedPeriod = e.target.value;

  // Update the total income, expenses, tax, and net income for the selected period
  displayTotalIncomeForOrderPeriod(selectedPeriod);
  displayExpensesForOrderPeriod(selectedPeriod);
  displayTaxForOrderPeriod(selectedPeriod);
  displayNetIncomeForOrderPeriod(selectedPeriod);
});

// Accept period as parameter
const calculateOverallIncomeFromPeriod = (period) => {
  const listOfOrdersInPeriod = filterOrderHistoryByPeriod(period);
  const amountOfExpensesInPeriod = calculateExpensesForPeriod(
    purchaseInfoArray,
    period
  );

  const overallRevenue = listOfOrdersInPeriod.reduce((total, order) => {
    return total + order.revenueOfOrder;
  }, 0);
  const overAllIncome = overallRevenue - amountOfExpensesInPeriod;
  return overAllIncome;
};

// Accept period as parameter
const calculateTax = (income) => {
  const taxRate = 0.2;
  const taxAmount = income * taxRate;
  return taxAmount;
};

// Accept period as parameter
const calculateNetIncomeFromPeriod = (period) => {
  const overAllIncome = calculateOverallIncomeFromPeriod(period);
  const taxToApply = calculateTax(overAllIncome);

  const netIncome = overAllIncome - taxToApply;
  return netIncome;
};

// Accept period as parameter
const displayNetIncome = (period) => {
  const netIncome = calculateNetIncomeFromPeriod(period);
  document.getElementById("net-income").innerText = netIncome;
  document.getElementById("net-income-for-report").innerText = netIncome;
};

// end of module 4

// start of module 5
const findClosestPurchase = () => {
  const futurePurchases = purchaseInfoArray.filter(
    (item) => new Date(item.datePurchased) >= currentDate
  );
  const closestPurchase = futurePurchases.reduce((closest, current) => {
    const currentDiff = Math.abs(current.datePurchased - currentDate);
    const closestDiff = Math.abs(closest.datePurchased - currentDate);
    return currentDiff < closestDiff ? current : closest;
  }, futurePurchases[0]);
  return closestPurchase;
};

const rawBerryObject = {
  freshBerry: {
    quantity: rawInput,
    minRemaining: calculateAdvisedTotalRemainingRawInput(),
    closestRestockDate: findClosestPurchase()?.datePurchased,
  },
};

const updateRawBerryObject = () => {
  rawBerryObject.freshBerry.quantity = rawInput;
  rawBerryObject.freshBerry.minRemaining =
    calculateAdvisedTotalRemainingRawInput();
  rawBerryObject.freshBerry.closestRestockDate =
    findClosestPurchase()?.datePurchased;

  addAndSync("rawBerryObject", rawBerryObject);
};

// localStorage.setItem("rawBerryObject", JSON.stringify(rawBerryObject));
const populateCategoryDemandTable = () => {
  const tableBody = document
    .getElementById("category-demand-table")
    .querySelector("tbody");

  // Clear the existing rows
  tableBody.innerHTML = "";

  // Populate with new rows
  for (const [categoryName, categoryData] of Object.entries(
    productCategoriesObject
  )) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${categoryName}</td>
      <td>${categoryData.categoryDemand}</td>
    `;
    tableBody.appendChild(row);
  }
};
// end of module 5
// start of module 6
// Get the select element for the time period
const timePeriodSelect = document.getElementById("time-period-for-report");

// Function to handle the change event and trigger calculations based on selected period
timePeriodSelect.addEventListener("change", (e) => {
  const selectedPeriod = e.target.value;

  // Calculate overall income, expenses, tax, and net income for the selected period
  const overallIncome = calculateOverallIncomeFromPeriod(selectedPeriod);
  const expenses = calculateExpensesForPeriod(
    purchaseInfoArray,
    selectedPeriod
  );
  const tax = calculateTax(overallIncome);
  const netIncome = calculateNetIncomeFromPeriod(selectedPeriod);
  // Get quantity sold for each category based on the selected period
  const categorySalesData =
    getQuantityOfSoldForCategoriesOnPeriod(selectedPeriod);
  const filteredOrders = filterOrdersForReport(selectedPeriod);

  // Display the results in HTML elements
  document.getElementById(
    "overall-income-for-report"
  ).innerText = `Overall Income: $${overallIncome.toFixed(2)}`;
  document.getElementById(
    "expenses-for-report"
  ).innerText = `Expenses: $${expenses.toFixed(2)}`;
  document.getElementById("tax-for-report").innerText = `Tax: $${tax.toFixed(
    2
  )}`;
  document.getElementById(
    "net-income-for-report"
  ).innerText = `Net Income: $${netIncome.toFixed(2)}`;
  // Display the results in a table
  displayCategorySalesData(categorySalesData);
  populateOrderHistoryTableForReport(filteredOrders);
});

const getQuantityOfSoldForCategoriesOnPeriod = (period) => {
  // Get the start and end dates for the specified period
  const { startDate, endDate } = getPeriodDates(period);

  // Initialize an object to store quantity sold for each category
  const categorySalesData = {};

  // Iterate through the order array to calculate quantity sold for each category in the given period
  orderArray.forEach((order) => {
    const orderDate = new Date(order.orderDate);
    if (orderDate >= startDate && orderDate <= endDate) {
      const category = order.orderedProductCategory;

      if (!categorySalesData[category]) {
        categorySalesData[category] = {
          quantitySold: 0,
        };
      }

      categorySalesData[category].quantitySold += order.quantityOrdered;
    }
  });

  return categorySalesData;
};

// Function to display the sales data for each category in a table format
const displayCategorySalesData = (categorySalesData) => {
  const salesContainer = document.getElementById("category-sales-container");
  salesContainer.innerHTML = ""; // Clear previous data

  // Create a table and its header
  const table = document.createElement("table");
  table.classList.add("category-sales-table");

  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const categoryHeader = document.createElement("th");
  categoryHeader.textContent = "Category";
  headerRow.appendChild(categoryHeader);

  const quantitySoldHeader = document.createElement("th");
  quantitySoldHeader.textContent = "Quantity Sold";
  headerRow.appendChild(quantitySoldHeader);

  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  // Create table body and populate it with the sales data
  const tableBody = document.createElement("tbody");

  for (const category in categorySalesData) {
    if (categorySalesData.hasOwnProperty(category)) {
      const categoryData = categorySalesData[category];

      const row = document.createElement("tr");

      const categoryCell = document.createElement("td");
      categoryCell.textContent = category;
      row.appendChild(categoryCell);

      const quantitySoldCell = document.createElement("td");
      quantitySoldCell.textContent = categoryData.quantitySold;
      row.appendChild(quantitySoldCell);

      tableBody.appendChild(row);
    }
  }

  table.appendChild(tableBody);
  salesContainer.appendChild(table);
};

const getRemainingStockPerCategory = () => {
  const remainingStockData = [];

  for (const category in productCategoriesObject) {
    remainingStockData.push({
      categoryName: category,
      remainingStock: productCategoriesObject[category].categoryRemaining,
    });
  }

  return remainingStockData;
};

const displayRemainingStock = () => {
  const remainingStockData = getRemainingStockPerCategory();

  const stockContainer = document.getElementById("remaining-stock-container");
  stockContainer.innerHTML = ""; // Clear previous data

  remainingStockData.forEach((item) => {
    const stockRow = document.createElement("div");
    stockRow.textContent = `Category: ${item.categoryName}, Remaining Stock: ${item.remainingStock}`;
    stockContainer.appendChild(stockRow);
  });
};

// Show stock
document.getElementById("show-stock-button").addEventListener("click", () => {
  displayRemainingStock();
  document.getElementById("remaining-stock-container").style.display = "block"; // Show stock container
});

// Hide stock
document.getElementById("hide-stock-button").addEventListener("click", () => {
  document.getElementById("remaining-stock-container").style.display = "none"; // Hide stock container
});
const populateOrderHistoryTableForReport = (filteredOrders) => {
  const orderHistoryTable = document
    .getElementById("order-history-table-for-report")
    .querySelector("tbody");
  orderHistoryTable.innerHTML = ""; // Clear existing table rows

  filteredOrders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.customerInformation.customerName}</td>
      <td>${order.customerInformation.customerSurname}</td>
      <td>${order.customerInformation.customerPhoneNumber}</td>
      <td>${order.customerInformation.customerLocation}</td>
      <td>${order.orderedProductCategory}</td>
      <td>${order.quantityOrdered}</td>
      <td>${order.revenueOfOrder}</td>
      <td>${order.orderDate}</td>
    `;
    orderHistoryTable.appendChild(row);
  });
};
const filterOrdersForReport = (period) => {
  const customerNameFilter = document
    .getElementById("filter-customer-name-for-report")
    .value.toLowerCase();
  const categoryFilter = document
    .getElementById("filter-category-for-report")
    .value.toLowerCase();
  const filteredOrdersForPeriod = filterOrderHistoryByPeriod(period);

  const filteredOrders = filteredOrdersForPeriod.filter((order) => {
    const matchesCustomerName = order.customerInformation.customerName
      .toLowerCase()
      .includes(customerNameFilter);
    const matchesCategory = order.orderedProductCategory
      .toLowerCase()
      .includes(categoryFilter);
    return matchesCustomerName && matchesCategory;
  });

  populateOrderHistoryTableForReport(filteredOrders);

  return filteredOrders;
};
document
  .getElementById("filter-customer-name-for-report")
  .addEventListener("input", () => {
    const selectedPeriod = document.getElementById(
      "time-period-for-report"
    ).value;
    const filteredOrders = filterOrdersForReport(selectedPeriod);
    populateOrderHistoryTableForReport(filteredOrders);
  });

document
  .getElementById("filter-category-for-report")
  .addEventListener("input", () => {
    const selectedPeriod = document.getElementById(
      "time-period-for-report"
    ).value;
    const filteredOrders = filterOrdersForReport(selectedPeriod);
    populateOrderHistoryTableForReport(filteredOrders);
  });

// end of module 6

// Get all module sections and buttons
const modules = document.querySelectorAll("section[id^='module-']");
const buttons = document.querySelectorAll(".module-btn");

// Function to show a specific module
function showModule(targetId) {
  // Hide all modules
  modules.forEach((module) => {
    module.style.display = "none";
  });

  // Show the targeted module
  const targetModule = document.getElementById(targetId);
  if (targetModule) {
    targetModule.style.display = "block";
  }
}

// Add event listeners to buttons
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const target = button.getAttribute("data-target");
    showModule(target);
  });
});

const populateAllTables = () => {
  populateGeneralFarmerTable();
  populatePurchaseInfoTable();
  populateQuantityRemainingForAllCategoriesTable();
  populateCustomerDropdown();
  populateOrderHistoryTable();
  populateCategoryDemandTable();
  populateCategoryRevenueTable();
};

// Call this at the start

loadDataFromLocalStorage();
// Initialize by hiding all and showing the first module
showModule("module-one");
populateAllTables();
updateTotalRawInputDisplay();
