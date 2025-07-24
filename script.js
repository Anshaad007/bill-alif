// Global variables

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set current date as default
    document.getElementById('invoiceDate').value = new Date().toISOString().split('T')[0];
    
    // Add event listeners
    addFormEventListeners();
    addItemEventListeners();
    
    // Generate initial preview
    updateInvoicePreview();
});

// Add event listeners to form fields
function addFormEventListeners() {
    const formFields = [
        'invoiceNumber', 'invoiceDate',
        'studentName', 'studentClass', 'studentPhone', 
        'paymentMethod', 'paymentDetails'
    ];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateInvoicePreview);
            field.addEventListener('change', updateInvoicePreview);
        }
    });
    

    
    // Add item button
    document.getElementById('addItem').addEventListener('click', addNewItem);
    
    // Download PDF button
    document.getElementById('downloadPDF').addEventListener('click', downloadPDF);
}

// Add event listeners to item fields
function addItemEventListeners() {
    const itemsContainer = document.getElementById('itemsContainer');
    const itemFields = itemsContainer.querySelectorAll('.item-description, .item-quantity, .item-price, .item-tax, .item-period, .item-custom-description');
    
    itemFields.forEach(field => {
        field.addEventListener('input', updateInvoicePreview);
        field.addEventListener('change', updateInvoicePreview);
    });
}

// Handle fee type change
function handleFeeTypeChange(selectElement) {
    const itemRow = selectElement.closest('.item-row');
    const periodField = itemRow.querySelector('.period-field');
    const periodSelect = itemRow.querySelector('.item-period');
    const periodLabel = itemRow.querySelector('.period-label');
    const customFeeField = itemRow.querySelector('.custom-fee-field');
    
    const selectedFeeType = selectElement.value;
    
    // Hide all conditional fields first
    periodField.style.display = 'none';
    customFeeField.style.display = 'none';
    periodSelect.innerHTML = '';
    
    if (selectedFeeType === 'Monthly Fee') {
        periodField.style.display = 'block';
        periodLabel.textContent = 'Months:';
        periodSelect.innerHTML = `
            <option value="">Select Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
        `;
    } else if (selectedFeeType === 'Term Fee') {
        periodField.style.display = 'block';
        periodLabel.textContent = 'Terms:';
        periodSelect.innerHTML = `
            <option value="">Select Term</option>
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
            <option value="4th Term">4th Term</option>
        `;
    } else if (selectedFeeType === 'Other Fee') {
        customFeeField.style.display = 'block';
    }
    
    updateInvoicePreview();
}

// Handle payment method change
function handlePaymentMethodChange(selectElement) {
    const transactionField = document.querySelector('.transaction-field');
    const transactionLabel = document.querySelector('.transaction-label');
    const selectedMethod = selectElement.value;
    
    if (selectedMethod === 'UPI') {
        transactionField.style.display = 'block';
        transactionLabel.textContent = 'UPI Transaction ID:';
    } else if (selectedMethod === 'Bank Transfer') {
        transactionField.style.display = 'block';
        transactionLabel.textContent = 'Bank Reference Number:';
    } else {
        transactionField.style.display = 'none';
    }
    
    updateInvoicePreview();
}

// Add new item row
function addNewItem() {
    const itemsContainer = document.getElementById('itemsContainer');
    const newItemRow = document.createElement('div');
    newItemRow.className = 'item-row';
    
    newItemRow.innerHTML = `
        <div class="item-field">
            <label>Fee Type:</label>
            <select class="item-description" onchange="handleFeeTypeChange(this)">
                <option value="">Select Fee Type</option>
                <option value="Term Fee">Term Fee</option>
                <option value="Monthly Fee">Monthly Fee</option>
                <option value="Book Fee">Book Fee</option>
                <option value="Admission Fee">Admission Fee</option>
                <option value="Other Fee">Other Fee</option>
            </select>
        </div>
        <div class="item-field period-field" style="display: none;">
            <label class="period-label">Period:</label>
            <select class="item-period">
                <!-- Options will be populated based on fee type -->
            </select>
        </div>
        <div class="item-field custom-fee-field" style="display: none;">
            <label>Custom Fee Description:</label>
            <input type="text" class="item-custom-description" placeholder="Enter custom fee description">
        </div>
        <div class="item-field">
            <label>Quantity:</label>
            <input type="number" class="item-quantity" value="1" min="0">
        </div>
        <div class="item-field">
            <label>Unit Price (₹):</label>
            <input type="number" class="item-price" placeholder="0.00" step="0.01">
        </div>
        <div class="item-field">
            <label>Tax (%):</label>
            <input type="number" class="item-tax" placeholder="0" step="0.01">
        </div>
        <button type="button" class="remove-item" onclick="removeItem(this)">Remove</button>
    `;
    
    itemsContainer.appendChild(newItemRow);
    
    // Add event listeners to new item fields
    const newFields = newItemRow.querySelectorAll('.item-description, .item-quantity, .item-price, .item-tax, .item-period, .item-custom-description');
    newFields.forEach(field => {
        field.addEventListener('input', updateInvoicePreview);
        field.addEventListener('change', updateInvoicePreview);
    });
    
    updateInvoicePreview();
}

// Remove item row
function removeItem(button) {
    const itemRow = button.parentElement;
    itemRow.remove();
    updateInvoicePreview();
}

// Update invoice preview
function updateInvoicePreview() {
    const preview = document.getElementById('invoicePreview');
    
    // Get form data
    const formData = getFormData();
    
    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(formData);
    
    preview.innerHTML = invoiceHTML;
}

// Get all form data
function getFormData() {
    return {
        logo: true, // Enable logo display
        school: {
            name: 'ALIF ONLINE MORAL SCHOOL',
            address: {
                line1: 'Othukkungal (PO)',
                line2: 'Malappuram',
                state: 'Kerala',
                pincode: '676531'
            },
            phone: '9061711444',
            email: 'info1alifonlinemoralschool@gmail.com',
            website: 'www.alifonlinemoralschool.com',
            gstin: '32ACAFA0267H1ZY'
        },
        invoice: {
            number: document.getElementById('invoiceNumber').value || 'INV001',
            date: document.getElementById('invoiceDate').value || new Date().toISOString().split('T')[0]
        },
        student: {
            name: (document.getElementById('studentName').value || 'STUDENT NAME').toUpperCase(),
            class: (document.getElementById('studentClass').value || 'Class/Section').toUpperCase(),
            phone: (document.getElementById('studentPhone').value || 'Phone Number').toUpperCase()
        },
        payment: {
            method: document.getElementById('paymentMethod').value || 'payment method',
            details: document.getElementById('paymentDetails').value || ''
        },
        items: getItemsData()
    };
}

// Get items data
function getItemsData() {
    const itemRows = document.querySelectorAll('.item-row');
    const items = [];
    
    itemRows.forEach(row => {
        const feeType = row.querySelector('.item-description').value;
        const periodElement = row.querySelector('.item-period');
        const period = periodElement ? periodElement.value : '';
        const customDescElement = row.querySelector('.item-custom-description');
        const customDescription = customDescElement ? customDescElement.value.toUpperCase() : '';
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const tax = parseFloat(row.querySelector('.item-tax').value) || 0;
        
        if ((feeType || price > 0) && quantity > 0) {
            const subtotal = quantity * price;
            const taxAmount = (subtotal * tax) / 100;
            const total = subtotal + taxAmount;
            
            // Format description based on fee type, period, and custom input
            let description = feeType || 'Item';
            if (feeType === 'Other Fee' && customDescription) {
                description = customDescription;
            } else if (period && (feeType === 'Monthly Fee' || feeType === 'Term Fee')) {
                description = `${feeType} - ${period}`;
            }
            
            items.push({
                description: description.toUpperCase(), // Convert to uppercase
                quantity,
                price,
                tax,
                subtotal,
                taxAmount,
                total
            });
        }
    });
    
    return items;
}

// Generate invoice HTML
function generateInvoiceHTML(data) {
    const formattedDate = formatDate(data.invoice.date);
    const grandTotal = data.items.reduce((sum, item) => sum + item.total, 0);
    
    return `
        <div class="invoice-header">
            <div class="school-info">
                <div class="school-header">
                    <div class="school-details">
                        <h2>${data.school.name}</h2>
                        <p>${data.school.address.line1}</p>
                        <p>${data.school.address.line2}</p>
                        <p>${data.school.address.state} - ${data.school.address.pincode}</p>
                        <p>${data.school.phone}</p>
                        <p>${data.school.email}</p>
                        <p>${data.school.website}</p>
                    </div>
                    ${data.logo ? `<img src="logo.png" alt="School Logo" class="school-logo-right">` : ''}
                </div>
                <div class="gstin-student-row">
                    <span>GSTIN: ${data.school.gstin}</span>
                    <span class="student-name"><strong>${data.student.name}</strong></span>
                </div>
            </div>
        </div>
        
        <div class="invoice-details">
            <div class="bill-to">
                <h3>Bill To</h3>
                <p><strong>${data.student.name}</strong></p>
                <p>${data.student.class}</p>
                <p>${data.student.phone}</p>
            </div>
            <div class="invoice-meta">
                <p><strong>Invoice #</strong> ${data.invoice.number}</p>
                <p><strong>Creation Date</strong> ${formattedDate}</p>
            </div>
        </div>
        
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>QTY</th>
                    <th>Price</th>
                    <th>Tax</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${data.items.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price.toFixed(2)}</td>
                        <td>${item.tax}%</td>
                        <td class="amount">₹${item.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="invoice-total">
            <div class="total-box">
                Total: ₹${grandTotal.toFixed(2)}
            </div>
        </div>
        
        <div class="payment-info">
            <h4>Payment Method</h4>
            <p>${data.payment.method}: ${data.payment.details}</p>
        </div>
    `;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Download PDF
function downloadPDF() {
    // Ensure the preview is up-to-date before generating PDF
    updateInvoicePreview();
    // Wait a short time to ensure DOM is updated
    setTimeout(function() {
        const element = document.getElementById('invoicePreview');
        // Get student name for filename
        const studentName = document.getElementById('studentName').value.trim();
        const invoiceNumber = document.getElementById('invoiceNumber').value.trim();
        // Create filename with student name
        let filename = 'ALIF ONLINE FEE RECEIPT';
        if (studentName) {
            // Clean student name for filename (remove special characters)
            const cleanName = studentName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
            filename = `${cleanName}_Fee_Receipt`;
            // Add invoice number if available
            if (invoiceNumber) {
                filename += `_${invoiceNumber}`;
            }
        }
        filename += '.pdf';
        const opt = {
            margin: [0.1, 0.1, 0.1, 0.1],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true,
                windowHeight: element.scrollHeight // ensure full content is captured
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };
        html2pdf().set(opt).from(element).save();
    }, 100); // 100ms delay ensures DOM update
}
