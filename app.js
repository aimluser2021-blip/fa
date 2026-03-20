const DEMO_DATA = {
  products: [
    { id: 1, name: "Sulphuric Acid", category: "Industrial Chemical", price: 850, stock: 18 },
    { id: 2, name: "Caustic Soda", category: "Cleaning Agent", price: 640, stock: 7 },
    { id: 3, name: "Hydrogen Peroxide", category: "Oxidizer", price: 920, stock: 12 },
    { id: 4, name: "Liquid Chlorine", category: "Water Treatment", price: 560, stock: 5 }
  ],
  customers: [
    { id: 1, name: "Ramesh Traders", phone: "9876543210", visits: 12, totalSpent: 14250 },
    { id: 2, name: "Star Clean Solutions", phone: "9898989898", visits: 6, totalSpent: 8650 },
    { id: 3, name: "Green Field Agro", phone: "9123456780", visits: 9, totalSpent: 11240 }
  ],
  invoices: [
    { id: "INV-1001", customerName: "Ramesh Traders", productName: "Sulphuric Acid", quantity: 3, amount: 2550, paymentMethod: "UPI", date: "2026-03-19 10:15" },
    { id: "INV-1002", customerName: "Star Clean Solutions", productName: "Caustic Soda", quantity: 2, amount: 1280, paymentMethod: "Cash", date: "2026-03-19 12:10" },
    { id: "INV-1003", customerName: "Green Field Agro", productName: "Hydrogen Peroxide", quantity: 4, amount: 3680, paymentMethod: "QR Code", date: "2026-03-20 09:20" }
  ]
};

const STORAGE_KEY = "hmf-chemical-enterprises-data";

const state = {
  data: loadData()
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(DEMO_DATA);
  } catch {
    return structuredClone(DEMO_DATA);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function renderStats() {
  const totalSales = state.data.invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalProducts = state.data.products.length;
  const lowStock = state.data.products.filter((product) => product.stock <= 7).length;
  const customers = state.data.customers.length;

  const stats = [
    { label: "Total sales", value: money(totalSales), meta: "Demo lifetime billing" },
    { label: "Products", value: totalProducts, meta: "Items in inventory" },
    { label: "Low stock alerts", value: lowStock, meta: "Products below threshold" },
    { label: "Customers", value: customers, meta: "Saved customer records" }
  ];

  document.getElementById("stats-grid").innerHTML = stats.map((item) => `
    <article class="stat-card">
      <p class="eyebrow">${item.label}</p>
      <h3>${item.value}</h3>
      <p class="muted">${item.meta}</p>
    </article>
  `).join("");
}

function renderLowStock() {
  const container = document.getElementById("low-stock-list");
  const items = state.data.products
    .filter((product) => product.stock <= 7)
    .map((product) => `
      <div class="list-item">
        <div>
          <strong>${product.name}</strong>
          <span class="muted">${product.category}</span>
        </div>
        <span class="badge low">${product.stock} left</span>
      </div>
    `).join("");

  container.innerHTML = items || `<div class="empty-state">No low-stock items right now.</div>`;
}

function renderInvoices() {
  const recent = [...state.data.invoices].slice(-4).reverse();
  document.getElementById("invoice-list").innerHTML = recent.map((invoice) => `
    <div class="list-item">
      <div>
        <strong>${invoice.id}</strong>
        <span class="muted">${invoice.customerName} • ${invoice.productName}</span>
      </div>
      <div>
        <strong>${money(invoice.amount)}</strong>
        <span class="muted">${invoice.paymentMethod}</span>
      </div>
    </div>
  `).join("");
}

function renderInventory() {
  document.getElementById("inventory-table").innerHTML = state.data.products.map((product) => `
    <tr>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${money(product.price)}</td>
      <td>${product.stock}</td>
      <td><span class="badge ${product.stock <= 7 ? "low" : "ok"}">${product.stock <= 7 ? "Low stock" : "In stock"}</span></td>
    </tr>
  `).join("");

  document.getElementById("product-select").innerHTML = state.data.products.map((product) => `
    <option value="${product.name}">${product.name} (${product.stock} in stock)</option>
  `).join("");
}

function renderCustomers() {
  document.getElementById("customer-grid").innerHTML = state.data.customers.map((customer) => `
    <article class="customer-card">
      <strong>${customer.name}</strong>
      <p>Phone: ${customer.phone}</p>
      <p>Visits: ${customer.visits}</p>
      <p>Total spent: ${money(customer.totalSpent)}</p>
    </article>
  `).join("");
}

function renderReports() {
  const totals = {
    Cash: 0,
    UPI: 0,
    "QR Code": 0
  };

  const productTotals = {};

  state.data.invoices.forEach((invoice) => {
    totals[invoice.paymentMethod] += invoice.amount;
    productTotals[invoice.productName] = (productTotals[invoice.productName] || 0) + invoice.quantity;
  });

  document.getElementById("report-stats").innerHTML = [
    { label: "Today demo sales", value: money(state.data.invoices.slice(-2).reduce((sum, item) => sum + item.amount, 0)), meta: "Latest invoice activity" },
    { label: "Average invoice", value: money(Math.round(state.data.invoices.reduce((sum, item) => sum + item.amount, 0) / state.data.invoices.length)), meta: "Across all bills" },
    { label: "Best payment mode", value: Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0], meta: "Highest collection share" },
    { label: "Top item", value: Object.entries(productTotals).sort((a, b) => b[1] - a[1])[0][0], meta: "Most units sold" }
  ].map((item) => `
    <article class="stat-card">
      <p class="eyebrow">${item.label}</p>
      <h3>${item.value}</h3>
      <p class="muted">${item.meta}</p>
    </article>
  `).join("");

  document.getElementById("payment-summary").innerHTML = Object.entries(totals).map(([method, amount]) => `
    <div class="payment-row">
      <strong>${method}</strong>
      <span>${money(amount)}</span>
    </div>
  `).join("");

  document.getElementById("product-summary").innerHTML = Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, qty]) => `
      <div class="product-row">
        <strong>${name}</strong>
        <span>${qty} units sold</span>
      </div>
    `).join("");
}

function renderLatestInvoice() {
  const latest = state.data.invoices[state.data.invoices.length - 1];
  const preview = document.getElementById("latest-invoice");
  if (!latest) {
    preview.textContent = "No invoice created yet.";
    return;
  }

  preview.classList.remove("empty-state");
  preview.innerHTML = `
    <strong>${latest.id}</strong>
    <div>Customer: ${latest.customerName}</div>
    <div>Product: ${latest.productName}</div>
    <div>Quantity: ${latest.quantity}</div>
    <div>Payment: ${latest.paymentMethod}</div>
    <div>Total: ${money(latest.amount)}</div>
    <div>Date: ${latest.date}</div>
  `;
}

function renderAll() {
  renderStats();
  renderLowStock();
  renderInvoices();
  renderInventory();
  renderCustomers();
  renderReports();
  renderLatestInvoice();
}

function setupNavigation() {
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.dataset.target).classList.add("active");
    });
  });
}

function setupInvoiceForm() {
  document.getElementById("invoice-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const productName = form.get("productName");
    const quantity = Number(form.get("quantity"));
    const product = state.data.products.find((item) => item.name === productName);

    if (!product || quantity < 1) {
      return;
    }

    if (quantity > product.stock) {
      alert("Not enough stock for this invoice.");
      return;
    }

    const customerName = String(form.get("customerName")).trim();
    const paymentMethod = String(form.get("paymentMethod"));
    const amount = product.price * quantity;
    const invoice = {
      id: `INV-${1000 + state.data.invoices.length + 1}`,
      customerName,
      productName,
      quantity,
      amount,
      paymentMethod,
      date: new Date().toLocaleString("en-IN")
    };

    state.data.invoices.push(invoice);
    product.stock -= quantity;

    let customer = state.data.customers.find((item) => item.name.toLowerCase() === customerName.toLowerCase());
    if (!customer) {
      customer = {
        id: state.data.customers.length + 1,
        name: customerName,
        phone: "Add phone number",
        visits: 0,
        totalSpent: 0
      };
      state.data.customers.push(customer);
    }

    customer.visits += 1;
    customer.totalSpent += amount;

    saveData();
    renderAll();
    event.currentTarget.reset();
  });
}

function setupActions() {
  document.getElementById("seed-demo").addEventListener("click", () => {
    state.data = structuredClone(DEMO_DATA);
    saveData();
    renderAll();
  });

  document.getElementById("export-data").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hmf-chemical-enterprises-data.json";
    link.click();
    URL.revokeObjectURL(url);
  });
}

setupNavigation();
setupInvoiceForm();
setupActions();
renderAll();
