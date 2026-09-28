/* =========================================================
   ELEMENT REFERENCES
   ========================================================= */
const newInvoiceBtn = document.getElementById("newInvoiceBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const invoiceNumberEl = document.getElementById("invoiceNumber");
const invoiceDateEl = document.getElementById("invoiceDate");
const resetInvoiceNumberBtn = document.getElementById("resetInvoiceNumberBtn");
const themeColorPicker = document.getElementById("themeColorPicker");

const companyName = document.getElementById("companyName");
const companyEmail = document.getElementById("companyEmail");
const companyPhone = document.getElementById("companyPhone");
const companyLogoInput = document.getElementById("companyLogoInput");
const logoImg = document.getElementById("logoImg");
const saveCmpInfo = document.getElementById("saveCmpInfo");

const clientName = document.getElementById("clientName");
const clientEmail = document.getElementById("clientEmail");
const clientPhone = document.getElementById("clientPhone");

const itemsBody = document.getElementById("itemsBody");
const addItemBtn = document.getElementById("addItemBtn");

const currencySelect = document.getElementById("currencySelect");
const subtotal = document.getElementById("subtotal");
const discount = document.getElementById("discount");
const tax = document.getElementById("tax");
const grandTotal = document.getElementById("grandTotal");
const deposit = document.getElementById("deposit");
const remainingDue = document.getElementById("remainingDue");

const previewInvoiceBtn = document.getElementById("previewInvoiceBtn");
const printInvoiceBtn = document.getElementById("printInvoiceBtn");
const previewModal = document.getElementById("previewModal");
const previewContent = document.getElementById("previewContent");
const closePreviewBtn = document.getElementById("closePreviewBtn");

const saveInvoiceBtn = document.getElementById("saveInvoiceBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const downloadImgBtn = document.getElementById("downloadImgBtn");
const whatsappShareBtn = document.getElementById("whatsappShareBtn");

const historyList = document.getElementById("historyList");
const historySearch = document.getElementById("historySearch");
const exportBackupBtn = document.getElementById("exportBackupBtn");
const importBackupBtn = document.getElementById("importBackupBtn");
const importFileInput = document.getElementById("importFileInput");
const clientsList = document.getElementById("clientsList");

/* =========================================================
   STATE
   ========================================================= */
let currentInvoiceNumber = null;
let currentEditingId = null; // null = فاتورة جديدة | غير كده = بنعدل فاتورة موجودة

/* =========================================================
   DARK MODE
   ========================================================= */
function setDarkMode(isDark) {
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    darkModeBtn.textContent = "☀️";
  } else {
    document.documentElement.removeAttribute("data-theme");
    darkModeBtn.textContent = "🌙";
  }
  localStorage.setItem("darkMode", isDark ? "1" : "0");
}

darkModeBtn.addEventListener("click", function () {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  setDarkMode(!isDark);
});

function loadDarkMode() {
  if (localStorage.getItem("darkMode") === "1") setDarkMode(true);
}
loadDarkMode();

/* =========================================================
   THEME COLOR PICKER
   ========================================================= */
function setThemeColor(color) {
  document.documentElement.style.setProperty("--primary-color", color);
  themeColorPicker.value = color;
  localStorage.setItem("themeColor", color);
}

themeColorPicker.addEventListener("input", function (event) {
  setThemeColor(event.target.value);
});

function loadThemeColor() {
  const savedColor = localStorage.getItem("themeColor");
  if (savedColor) setThemeColor(savedColor);
}
loadThemeColor();

/* =========================================================
   INVOICE NUMBER + DATE
   ========================================================= */
function formatInvoiceNumber(num) {
  return "#" + String(num).padStart(4, "0");
}

function formatDate(date) {
  const day = String(date.getDate());
  const month = String(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// بتعرض الرقم المتوقع من غير ما تزود العداد الحقيقي - تستخدم عند تحميل الصفحة بس
function displayCurrentInvoiceMeta() {
  currentEditingId = null;
  const lastNumber = parseInt(localStorage.getItem("invoiceCounter")) || 0;
  currentInvoiceNumber = lastNumber + 1;
  invoiceNumberEl.textContent = formatInvoiceNumber(currentInvoiceNumber);
  invoiceDateEl.textContent = formatDate(new Date());
}

// بتزود العداد فعليًا جوه localStorage - بتتنادى بس لما تدوس "New Invoice"
function startNewInvoiceMeta() {
  currentEditingId = null;
  let counter = parseInt(localStorage.getItem("invoiceCounter")) || 0;
  counter += 1;
  localStorage.setItem("invoiceCounter", counter);
  currentInvoiceNumber = counter;
  invoiceNumberEl.textContent = formatInvoiceNumber(currentInvoiceNumber);
  invoiceDateEl.textContent = formatDate(new Date());
}

displayCurrentInvoiceMeta();

resetInvoiceNumberBtn.addEventListener("click", function () {
  const sure = confirm("Reset invoice numbering back to #0001?");
  if (!sure) return;
  localStorage.setItem("invoiceCounter", 0);
  displayCurrentInvoiceMeta();
});

/* =========================================================
   NEW INVOICE
   ========================================================= */
newInvoiceBtn.addEventListener("click", function () {
  clientName.value = "";
  clientEmail.value = "";
  clientPhone.value = "";
  itemsBody.innerHTML = `<tr id="emptyRow"><td colspan="5" class="empty-state">${translations[currentLang].emptyItems}</td></tr>`;
  discount.value = 0;
  tax.value = 0;
  deposit.value = 0;
  startNewInvoiceMeta();
  calculateTotals();
});

/* =========================================================
   COMPANY INFO (Save / Load + Logo Upload)
   ========================================================= */
saveCmpInfo.addEventListener("click", function () {
  const companyData = {
    name: companyName.value,
    email: companyEmail.value,
    phone: companyPhone.value,
    logo: logoImg.src,
  };
  localStorage.setItem("companyInfo", JSON.stringify(companyData));
  alert("Company info saved!");
});

function loadCompanyInfo() {
  const saved = localStorage.getItem("companyInfo");
  if (saved) {
    const data = JSON.parse(saved);
    companyName.value = data.name || "";
    companyEmail.value = data.email || "";
    companyPhone.value = data.phone || "";
    if (data.logo) logoImg.src = data.logo;
  }
}
loadCompanyInfo();

companyLogoInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    logoImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

/* =========================================================
   ITEMS: Add / Delete
   ========================================================= */
addItemBtn.addEventListener("click", function () {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><input type="text" placeholder="${translations[currentLang].servicePh}"></td>
    <td><input type="number" value="1" min="1"></td>
    <td><input type="number" value="0" min="0"></td>
    <td>0</td>
    <td><button class="deleteBtn">🗑</button></td>
  `;
  itemsBody.appendChild(newRow);

  const emptyMsg = document.getElementById("emptyRow");
  if (emptyMsg) emptyMsg.remove();

  calculateTotals();
});

// Event Delegation: listener واحد بس على itemsBody، شغال حتى مع الصفوف الجديدة
itemsBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("deleteBtn")) {
    const row = event.target.closest("tr");
    row.remove();

    if (itemsBody.children.length === 0) {
      itemsBody.innerHTML = `<tr id="emptyRow"><td colspan="5" class="empty-state">${translations[currentLang].emptyItems}</td></tr>`;
    }
    calculateTotals();
  }
});

/* =========================================================
   CALCULATIONS (Subtotal, Discount, Tax, Deposit, Remaining)
   ========================================================= */
function calculateTotals() {
  let sub = 0;
  const rows = itemsBody.querySelectorAll("tr");
  const curr = currencySelect.value;

  rows.forEach(function (row) {
    const qtyInput = row.querySelector("td:nth-child(2) input");
    const priceInput = row.querySelector("td:nth-child(3) input");
    const totalCell = row.querySelector("td:nth-child(4)");

    if (qtyInput && priceInput) {
      const qty = parseFloat(qtyInput.value) || 0;
      const price = parseFloat(priceInput.value) || 0;
      const rowTotal = qty * price;
      totalCell.textContent = curr + " " + rowTotal.toFixed(2);
      sub += rowTotal;
    }
  });

  const discountVal = parseFloat(discount.value) || 0;
  const taxVal = parseFloat(tax.value) || 0;
  const afterDiscount = sub - discountVal;
  const grand = afterDiscount + (afterDiscount * taxVal) / 100;

  const depositVal = parseFloat(deposit.value) || 0;
  const remaining = grand - depositVal;

  subtotal.textContent = curr + " " + sub.toFixed(2);
  grandTotal.textContent = curr + " " + grand.toFixed(2);
  remainingDue.textContent = curr + " " + remaining.toFixed(2);
}

itemsBody.addEventListener("input", calculateTotals);
discount.addEventListener("input", calculateTotals);
tax.addEventListener("input", calculateTotals);
deposit.addEventListener("input", calculateTotals);
currencySelect.addEventListener("change", calculateTotals);

/* =========================================================
   PREVIEW MODAL
   ========================================================= */
previewInvoiceBtn.addEventListener("click", function () {
  const invoiceElement = document.getElementById("printableInvoice");
  const clone = invoiceElement.cloneNode(true);

  // بنشيل أي عنصر تفاعلي (أزرار) من النسخة المعروضة في المعاينة بس
  clone
    .querySelectorAll(".deleteBtn, #addItemBtn, #resetInvoiceNumberBtn")
    .forEach(function (el) {
      el.remove();
    });
  clone
    .querySelectorAll("#itemsTable th:last-child, #itemsTable td:last-child")
    .forEach(function (el) {
      el.remove();
    });

  previewContent.innerHTML = "";
  previewContent.appendChild(clone);
  previewModal.classList.add("active");
});

closePreviewBtn.addEventListener("click", function () {
  previewModal.classList.remove("active");
});

// قفل المعاينة لو المستخدم دوس برا الكارت نفسه
previewModal.addEventListener("click", function (event) {
  if (event.target === previewModal) previewModal.classList.remove("active");
});

/* =========================================================
   QUICK PRINT
   ========================================================= */
printInvoiceBtn.addEventListener("click", function () {
  window.print();
});

/* =========================================================
   SAVE INVOICE (New or Update)
   ========================================================= */
saveInvoiceBtn.addEventListener("click", function () {
  if (!clientName.value.trim()) {
    alert("Please enter the client name before saving.");
    return;
  }

  const items = [];
  const rows = itemsBody.querySelectorAll("tr");

  rows.forEach(function (row) {
    const serviceInput = row.querySelector("td:nth-child(1) input");
    if (serviceInput) {
      items.push({
        service: serviceInput.value,
        qty: row.querySelector("td:nth-child(2) input").value,
        price: row.querySelector("td:nth-child(3) input").value,
      });
    }
  });

  if (items.length === 0) {
    alert("Please add at least one item before saving.");
    return;
  }

  let savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];

  if (currentEditingId) {
    savedInvoices = savedInvoices.map(function (inv) {
      if (inv.id === currentEditingId) {
        return {
          id: inv.id,
          invoiceNumber: currentInvoiceNumber,
          clientName: clientName.value,
          clientEmail: clientEmail.value,
          clientPhone: clientPhone.value,
          items: items,
          discount: discount.value,
          tax: tax.value,
          deposit: deposit.value,
          currency: currencySelect.value,
          grandTotal: grandTotal.textContent,
          date: inv.date,
        };
      }
      return inv;
    });
    alert("Invoice updated successfully!");
  } else {
    savedInvoices.push({
      id: Date.now(),
      invoiceNumber: currentInvoiceNumber,
      clientName: clientName.value,
      clientEmail: clientEmail.value,
      clientPhone: clientPhone.value,
      items: items,
      discount: discount.value,
      tax: tax.value,
      deposit: deposit.value,
      currency: currencySelect.value,
      grandTotal: grandTotal.textContent,
      date: formatDate(new Date()),
    });
    alert("Invoice saved successfully!");
  }

  localStorage.setItem("invoices", JSON.stringify(savedInvoices));
  saveClientToList(
    clientName.value.trim(),
    clientEmail.value.trim(),
    clientPhone.value.trim(),
  );
  currentEditingId = null;
  renderHistory();
});

/* =========================================================
   DOWNLOAD PDF
   ========================================================= */
downloadPdfBtn.addEventListener("click", function () {
  const invoiceElement = document.getElementById("printableInvoice");
  const options = {
    margin: 10,
    filename: `invoice-${formatInvoiceNumber(currentInvoiceNumber)}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      onclone: function (clonedDoc) {
        clonedDoc
          .querySelectorAll(".deleteBtn, #addItemBtn, #resetInvoiceNumberBtn")
          .forEach(function (el) {
            el.style.display = "none";
          });
        clonedDoc
          .querySelectorAll(
            "#itemsTable th:last-child, #itemsTable td:last-child",
          )
          .forEach(function (el) {
            el.style.display = "none";
          });
      },
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(options).from(invoiceElement).save();
});

/* =========================================================
   DOWNLOAD IMAGE (PNG)
   ========================================================= */
downloadImgBtn.addEventListener("click", function () {
  const invoiceElement = document.getElementById("printableInvoice");
  html2canvas(invoiceElement, {
    scale: 2,
    onclone: function (clonedDoc) {
      clonedDoc
        .querySelectorAll(".deleteBtn, #addItemBtn, #resetInvoiceNumberBtn")
        .forEach(function (el) {
          el.style.display = "none";
        });
      clonedDoc
        .querySelectorAll(
          "#itemsTable th:last-child, #itemsTable td:last-child",
        )
        .forEach(function (el) {
          el.style.display = "none";
        });
    },
  }).then(function (canvas) {
    const link = document.createElement("a");
    link.download = `invoice-${formatInvoiceNumber(currentInvoiceNumber)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

/* =========================================================
   SHARE VIA WHATSAPP
   ========================================================= */
whatsappShareBtn.addEventListener("click", function () {
  // بنشيل أي حاجة غير أرقام (مسافات، +، شرطات) عشان رابط wa.me يشتغل صح
  const clientPh = clientPhone.value.trim().replace(/\D/g, "");
  const text = encodeURIComponent(
    `Hello ${clientName.value || "Client"},\nHere is your invoice summary (${formatInvoiceNumber(currentInvoiceNumber)}).\nGrand Total: ${grandTotal.textContent}\nThank you!`,
  );
  const url = clientPh
    ? `https://wa.me/${clientPh}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, "_blank");
});

/* =========================================================
   HISTORY: Render / Open for Editing / Delete
   ========================================================= */
function renderHistory(invoicesToRender) {
  const savedInvoices =
    invoicesToRender || JSON.parse(localStorage.getItem("invoices")) || [];

  if (savedInvoices.length === 0) {
    historyList.innerHTML = `<p class="empty-state">${translations[currentLang].emptyHistory}</p>`;
    return;
  }

  historyList.innerHTML = "";

  savedInvoices.forEach(function (invoice) {
    const card = document.createElement("div");
    card.className = "history-card";
    card.setAttribute("data-id", invoice.id);
    card.innerHTML = `
      <span>${formatInvoiceNumber(invoice.invoiceNumber)} - ${invoice.clientName || "No name"} - ${invoice.date} - ${invoice.grandTotal}</span>
      <button class="deleteHistoryBtn" data-id="${invoice.id}">🗑</button>
    `;
    historyList.appendChild(card);
  });
}
renderHistory();

function loadInvoiceForEditing(invoice) {
  currentEditingId = invoice.id;
  clientName.value = invoice.clientName || "";
  clientEmail.value = invoice.clientEmail || "";
  clientPhone.value = invoice.clientPhone || "";
  if (invoice.currency) currencySelect.value = invoice.currency;

  itemsBody.innerHTML = "";
  invoice.items.forEach(function (item) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="text" placeholder="${translations[currentLang].servicePh}" value="${item.service}"></td>
      <td><input type="number" value="${item.qty}" min="1"></td>
      <td><input type="number" value="${item.price}" min="0"></td>
      <td>0</td>
      <td><button class="deleteBtn">🗑</button></td>
    `;
    itemsBody.appendChild(newRow);
  });

  currentInvoiceNumber = invoice.invoiceNumber;
  invoiceNumberEl.textContent = formatInvoiceNumber(invoice.invoiceNumber);
  invoiceDateEl.textContent = invoice.date;
  discount.value = invoice.discount || 0;
  tax.value = invoice.tax || 0;
  deposit.value = invoice.deposit || 0;

  calculateTotals();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// كليك واحد بيتصرف صح مع زرار الحذف أو مع فتح الفاتورة للتعديل
historyList.addEventListener("click", function (event) {
  if (event.target.classList.contains("deleteHistoryBtn")) {
    const idToDelete = Number(event.target.getAttribute("data-id"));
    let savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    savedInvoices = savedInvoices.filter(function (inv) {
      return inv.id !== idToDelete;
    });
    localStorage.setItem("invoices", JSON.stringify(savedInvoices));
    renderHistory();
    return;
  }

  const card = event.target.closest(".history-card");
  if (card) {
    const idToLoad = Number(card.getAttribute("data-id"));
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const invoice = savedInvoices.find(function (inv) {
      return inv.id === idToLoad;
    });
    if (invoice) loadInvoiceForEditing(invoice);
  }
});

document.getElementById("currentYear").textContent = new Date().getFullYear();

/* =========================================================
   RECURRING CLIENTS
   ========================================================= */
function saveClientToList(name, email, phone) {
  if (!name) return;
  let clients = JSON.parse(localStorage.getItem("clients")) || [];
  const existingIndex = clients.findIndex(function (c) {
    return c.name === name;
  });

  if (existingIndex > -1) {
    clients[existingIndex].email = email;
    clients[existingIndex].phone = phone;
  } else {
    clients.push({ name: name, email: email, phone: phone });
  }

  localStorage.setItem("clients", JSON.stringify(clients));
  renderClientsDatalist();
}

function renderClientsDatalist() {
  const clients = JSON.parse(localStorage.getItem("clients")) || [];
  clientsList.innerHTML = "";
  clients.forEach(function (c) {
    const option = document.createElement("option");
    option.value = c.name;
    clientsList.appendChild(option);
  });
}
renderClientsDatalist();

clientName.addEventListener("input", function () {
  const clients = JSON.parse(localStorage.getItem("clients")) || [];
  const match = clients.find(function (c) {
    return c.name === clientName.value;
  });
  if (match) {
    clientEmail.value = match.email || "";
    clientPhone.value = match.phone || "";
  }
});

/* =========================================================
   HISTORY SEARCH / FILTER
   ========================================================= */
historySearch.addEventListener("input", function () {
  const query = historySearch.value.trim().toLowerCase();
  const allInvoices = JSON.parse(localStorage.getItem("invoices")) || [];

  const filtered = allInvoices.filter(function (inv) {
    const nameMatch = (inv.clientName || "").toLowerCase().includes(query);
    const dateMatch = (inv.date || "").toLowerCase().includes(query);
    const numberMatch = formatInvoiceNumber(inv.invoiceNumber)
      .toLowerCase()
      .includes(query);
    return nameMatch || dateMatch || numberMatch;
  });

  renderHistory(filtered);
});

/* =========================================================
   BACKUP: Export / Import
   ========================================================= */
exportBackupBtn.addEventListener("click", function () {
  const backupData = {
    invoices: JSON.parse(localStorage.getItem("invoices")) || [],
    invoiceCounter: localStorage.getItem("invoiceCounter") || 0,
    companyInfo: JSON.parse(localStorage.getItem("companyInfo")) || null,
    clients: JSON.parse(localStorage.getItem("clients")) || [],
    themeColor: localStorage.getItem("themeColor") || "#2563eb",
    darkMode: localStorage.getItem("darkMode") || "0",
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `invoices-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
});

importBackupBtn.addEventListener("click", function () {
  importFileInput.click();
});

importFileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const backupData = JSON.parse(e.target.result);

      const confirmImport = confirm(
        "This will replace your currently saved invoices with the backup file. Continue?",
      );
      if (!confirmImport) return;

      localStorage.setItem(
        "invoices",
        JSON.stringify(backupData.invoices || []),
      );
      if (backupData.invoiceCounter !== undefined) {
        localStorage.setItem("invoiceCounter", backupData.invoiceCounter);
      }
      if (backupData.companyInfo) {
        localStorage.setItem(
          "companyInfo",
          JSON.stringify(backupData.companyInfo),
        );
        loadCompanyInfo();
      }
      if (backupData.clients) {
        localStorage.setItem("clients", JSON.stringify(backupData.clients));
        renderClientsDatalist();
      }
      if (backupData.themeColor) setThemeColor(backupData.themeColor);
      if (backupData.darkMode) setDarkMode(backupData.darkMode === "1");

      renderHistory();
      alert("Backup imported successfully!");
    } catch (err) {
      alert("Invalid backup file. Please choose a valid exported JSON file.");
    }
  };
  reader.readAsText(file);

  importFileInput.value = "";
});
