/* =========================================================
   TRANSLATIONS DICTIONARY
   ========================================================= */
const translations = {
  en: {
    title: "Invoice Generator",
    newInvoiceBtn: "New Invoice",
    companyTitle: "Company Details",
    invoiceNumberLabel: "Invoice #:",
    invoiceDateLabel: "Date:",
    saveCmpInfo: "Save Company Info",
    logoLabelText: "Upload Logo:",
    currencyLabel: "Currency:",
    clientTitle: "Client Details",
    itemsTitle: "Invoice Items",
    thService: "Service",
    thQty: "Qty",
    thPrice: "Price",
    thTotal: "Total",
    addItemBtn: "+ Add Item",
    emptyItems: 'No items added yet. Click "+ Add Item" to start.',
    subtotalLabel: "Subtotal:",
    discountLabel: "Discount:",
    taxLabel: "Tax %:",
    grandTotalLabel: "Grand Total:",
    depositLabel: "Deposit Paid:",
    remainingLabel: "Remaining Due:",
    previewInvoiceBtn: "Preview Invoice",
    printInvoiceBtn: "Print",
    saveInvoiceBtn: "Save Invoice",
    downloadPdfBtn: "Download PDF",
    downloadImgBtn: "Download Image",
    whatsappShareBtn: "Share via WhatsApp",
    historyTitle: "Invoice History",
    emptyHistory: "No saved invoices yet.",
    companyNamePh: "Company Name",
    companyEmailPh: "Email",
    companyPhonePh: "Phone Number",
    clientNamePh: "Client Name",
    clientEmailPh: "Client Email",
    clientPhonePh: "Client Phone Number",
    servicePh: "Service",
    footerHeading: "Let's Connect",
    historySearchPh: "Search by client, date or number...",
    exportBackupBtn: "Export Backup",
    importBackupBtn: "Import Backup",
  },
  ar: {
    title: "منشئ الفواتير",
    newInvoiceBtn: "فاتورة جديدة",
    companyTitle: "بيانات الشركة",
    invoiceNumberLabel: "رقم الفاتورة:",
    invoiceDateLabel: "التاريخ:",
    saveCmpInfo: "حفظ بيانات الشركة",
    logoLabelText: "رفع شعار الشركة:",
    currencyLabel: "العملة:",
    clientTitle: "بيانات العميل",
    itemsTitle: "عناصر الفاتورة",
    thService: "الخدمة",
    thQty: "الكمية",
    thPrice: "السعر",
    thTotal: "الإجمالي",
    addItemBtn: "+ إضافة عنصر",
    emptyItems: 'لا توجد عناصر بعد. اضغط "+ إضافة عنصر" للبدء.',
    subtotalLabel: "الإجمالي الفرعي:",
    discountLabel: "الخصم:",
    taxLabel: "الضريبة %:",
    grandTotalLabel: "الإجمالي الكلي:",
    depositLabel: "المبلغ المدفوع مقدمًا:",
    remainingLabel: "المتبقي على العميل:",
    previewInvoiceBtn: "معاينة الفاتورة",
    printInvoiceBtn: "طباعة",
    saveInvoiceBtn: "حفظ الفاتورة",
    downloadPdfBtn: "تحميل PDF",
    downloadImgBtn: "تحميل كصورة",
    whatsappShareBtn: "مشاركة واتساب",
    historyTitle: "سجل الفواتير",
    emptyHistory: "لا توجد فواتير محفوظة بعد.",
    companyNamePh: "اسم الشركة",
    companyEmailPh: "البريد الإلكتروني",
    companyPhonePh: "رقم الهاتف",
    clientNamePh: "اسم العميل",
    clientEmailPh: "بريد العميل",
    clientPhonePh: "رقم هاتف العميل",
    servicePh: "الخدمة",
    footerHeading: "يشرفنا التواصل معك",
    historySearchPh: "ابحث بالاسم أو التاريخ أو الرقم...",
    exportBackupBtn: "تصدير نسخة احتياطية",
    importBackupBtn: "استيراد نسخة احتياطية",
  },
};

let currentLang = "en";

/* =========================================================
   APPLY LANGUAGE
   ========================================================= */
function applyLanguage(lang) {
  const t = translations[lang];

  document.querySelector("header h1").textContent = t.title;
  document.querySelector("#companySection h2").textContent = t.companyTitle;
  document.querySelector("#clientSection h2").textContent = t.clientTitle;
  document.querySelector("#itemsSection h2").textContent = t.itemsTitle;
  document.querySelector("#historySection h2").textContent = t.historyTitle;

  document.getElementById("newInvoiceBtn").textContent = t.newInvoiceBtn;
  document.getElementById("saveCmpInfo").textContent = t.saveCmpInfo;
  document.getElementById("addItemBtn").textContent = t.addItemBtn;
  document.getElementById("previewInvoiceBtn").textContent =
    t.previewInvoiceBtn;
  document.getElementById("printInvoiceBtn").textContent = t.printInvoiceBtn;
  document.getElementById("saveInvoiceBtn").textContent = t.saveInvoiceBtn;
  document.getElementById("downloadPdfBtn").textContent = t.downloadPdfBtn;
  document.getElementById("downloadImgBtn").textContent = t.downloadImgBtn;
  document.getElementById("whatsappShareBtn").textContent = t.whatsappShareBtn;
  document.getElementById("footerHeading").textContent = t.footerHeading;
  document.getElementById("logoLabelText").textContent = t.logoLabelText;
  document.getElementById("currencyLabel").textContent = t.currencyLabel;
  document.getElementById("exportBackupBtn").textContent = t.exportBackupBtn;
  document.getElementById("importBackupBtn").textContent = t.importBackupBtn;
  document.getElementById("historySearch").placeholder = t.historySearchPh;

  const thElements = document.querySelectorAll("#itemsTable th");
  thElements[0].textContent = t.thService;
  thElements[1].textContent = t.thQty;
  thElements[2].textContent = t.thPrice;
  thElements[3].textContent = t.thTotal;

  document.getElementById("companyName").placeholder = t.companyNamePh;
  document.getElementById("companyEmail").placeholder = t.companyEmailPh;
  document.getElementById("companyPhone").placeholder = t.companyPhonePh;
  document.getElementById("clientName").placeholder = t.clientNamePh;
  document.getElementById("clientEmail").placeholder = t.clientEmailPh;
  document.getElementById("clientPhone").placeholder = t.clientPhonePh;

  // سطور السمري: كل واحد فيها نص خام + عنصر تاني (span/input)
  // الترتيب لازم يطابق ترتيب الـ <p> بالظبط في الـ HTML
  const summaryParagraphs = document.querySelectorAll("#summarySection p");
  summaryParagraphs[0].childNodes[0].nodeValue = t.subtotalLabel + " ";
  summaryParagraphs[1].childNodes[0].nodeValue = t.discountLabel + " ";
  summaryParagraphs[2].childNodes[0].nodeValue = t.taxLabel + " ";
  summaryParagraphs[3].childNodes[0].nodeValue = t.grandTotalLabel + " ";
  summaryParagraphs[4].childNodes[0].nodeValue = t.depositLabel + " ";
  summaryParagraphs[5].childNodes[0].nodeValue = t.remainingLabel + " ";

  const metaParagraphs = document.querySelectorAll("#invoiceMetaSection p");
  metaParagraphs[0].childNodes[0].nodeValue = t.invoiceNumberLabel + " ";
  metaParagraphs[1].childNodes[0].nodeValue = t.invoiceDateLabel + " ";

  const emptyRow = document.getElementById("emptyRow");
  if (emptyRow) emptyRow.querySelector("td").textContent = t.emptyItems;

  const emptyHistoryMsg = document.querySelector("#historyList .empty-state");
  if (emptyHistoryMsg) emptyHistoryMsg.textContent = t.emptyHistory;

  const serviceInputs = document.querySelectorAll(
    "#itemsBody td:nth-child(1) input",
  );
  serviceInputs.forEach(function (input) {
    input.placeholder = t.servicePh;
  });
}

/* =========================================================
   LANGUAGE TOGGLE BUTTON
   ========================================================= */
document.getElementById("langToggleBtn").addEventListener("click", function () {
  currentLang = currentLang === "en" ? "ar" : "en";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  applyLanguage(currentLang);
});
