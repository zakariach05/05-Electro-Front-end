import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// --- Shared Styles & Constants ---
const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E78' } // Professional Dark Blue (Excel "Blue 800" approx)
};

const headerFont = {
    name: 'Arial',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' } // White
};

const borderStyle = {
    top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
};

const centerAlign = { vertical: 'middle', horizontal: 'center' };
const leftAlign = { vertical: 'middle', horizontal: 'left' };
const rightAlign = { vertical: 'middle', horizontal: 'right' };

// --- Conditional Formatting Helpers ---
const setStatusColor = (cell, value, type) => {
    let color = null; // Default

    const val = value ? value.toString().toLowerCase() : '';

    if (type === 'orderStatus') {
        if (val === 'pending') color = 'FFFFC7CE'; // Light Red
        else if (val === 'processing') color = 'FFFFEB9C'; // Light Yellow
        else if (val === 'completed') color = 'FFC6EFCE'; // Light Green
        else if (val === 'cancelled') color = 'FFFFC7CE'; // Use Red for cancelled too
    } else if (type === 'paymentStatus') {
        if (val === 'paid') color = 'FFC6EFCE'; // Light Green
        else if (val === 'refunded') color = 'FFFFC7CE'; // Red
        else if (val === 'unpaid' || val === 'pending') color = 'FFFFEB9C'; // Yellow/Orangeish
    } else if (type === 'stock') {
        if (value === 0) color = 'FFFFC7CE'; // Red for out of stock
        else if (value < 5) color = 'FFFFEB9C'; // Warning
        else color = 'FFC6EFCE'; // Good
    }

    if (color) {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color }
        };
        // Auto-set text color for specific backgrounds for contrast
        if (color === 'FFFFC7CE') cell.font = { color: { argb: 'FF9C0006' } }; // Dark Red text
        else if (color === 'FFFFEB9C') cell.font = { color: { argb: 'FF9C5700' } }; // Dark Yellow text
        else if (color === 'FFC6EFCE') cell.font = { color: { argb: 'FF006100' } }; // Dark Green text
    }
};

// --- Main Export Function for ORDERS ---
export const exportOrdersToExcel = async (orders) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Commandes Clients', {
        views: [{ state: 'frozen', ySplit: 1 }] // Freeze header
    });

    // 1. Define Columns
    worksheet.columns = [
        { header: 'ID Commande', key: 'id', width: 15, style: { alignment: centerAlign } },
        { header: 'Nom du Client', key: 'customer', width: 30, style: { alignment: leftAlign } },
        { header: 'Email', key: 'email', width: 35, style: { alignment: leftAlign } },
        { header: 'Téléphone', key: 'phone', width: 20, style: { alignment: centerAlign } },
        { header: 'Ville', key: 'city', width: 20, style: { alignment: leftAlign } },
        { header: 'Total (DH)', key: 'total', width: 20, style: { numFmt: '#,##0.00 "DH"', alignment: rightAlign } },
        { header: 'Statut Commande', key: 'status', width: 20, style: { alignment: centerAlign } },
        { header: 'Statut Paiement', key: 'payment', width: 20, style: { alignment: centerAlign } },
        { header: 'Date', key: 'date', width: 25, style: { alignment: centerAlign } }
    ];

    // 2. Add Data Loop
    orders.forEach((order) => {
        const row = worksheet.addRow({
            id: order.id,
            customer: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            city: order.customer_city,
            total: Number(order.total_amount) || 0,
            status: order.status,
            payment: order.payment_status,
            date: new Date(order.created_at).toLocaleString('fr-FR')
        });

        // Loop cells for styling
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.border = borderStyle;

            // Zebra Striping (Alternating rows)
            if (Number(row.number) % 2 === 0) {
                // We only apply zebra if no specific conditional format overrides it, 
                // but conditional formatting is specific to Status columns. 
                // For a cleaner look, let's apply light grey to even rows everywhere first.
                if (!cell.fill) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF9FAFB' } // Very light grey
                    };
                }
            }

            // Conditional Formatting based on column key
            const colKey = worksheet.getColumn(colNumber).key;
            if (colKey === 'status') setStatusColor(cell, order.status, 'orderStatus');
            if (colKey === 'payment') setStatusColor(cell, order.payment_status, 'paymentStatus');
        });
    });

    // 3. Header Styling
    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = headerFill;
        cell.font = headerFont;
        cell.alignment = centerAlign;
        cell.border = borderStyle;
    });

    // 4. Total Row
    const totalRow = worksheet.addRow([
        'TOTAL', '', '', '', '',
        { formula: `SUM(F2:F${orders.length + 1})` }, // F column is 'Total (DH)'
        '', '', ''
    ]);
    totalRow.font = { bold: true };
    totalRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } }; // Light blue for total label
    totalRow.getCell(6).numFmt = '#,##0.00 "DH"';
    totalRow.getCell(6).border = { top: { style: 'double' } }; // Double line above total

    // 5. Auto Filter
    worksheet.autoFilter = {
        from: 'A1',
        to: { row: 1, column: 9 }
    };

    // 6. User Experience: Page Setup for Print
    worksheet.pageSetup.orientation = 'landscape';
    worksheet.pageSetup.fitToPage = true;

    // Save
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Commandes_Electro05_${new Date().toISOString().slice(0, 10)}.xlsx`);
};


// --- Main Export Function for PRODUCTS ---
export const exportProductsToExcel = async (products) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Catalogue Produits', {
        views: [{ state: 'frozen', ySplit: 1 }]
    });

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10, style: { alignment: centerAlign } },
        { header: 'Nom du Produit', key: 'name', width: 40, style: { alignment: leftAlign } },
        { header: 'Catégorie', key: 'category', width: 20, style: { alignment: centerAlign } },
        { header: 'Prix (DH)', key: 'price', width: 15, style: { numFmt: '#,##0.00 "DH"', alignment: rightAlign } },
        { header: 'Stock', key: 'stock', width: 15, style: { alignment: centerAlign } },
        { header: 'Créé le', key: 'date', width: 20, style: { alignment: centerAlign } }
    ];

    products.forEach((product) => {
        const row = worksheet.addRow({
            id: product.id,
            name: product.name,
            category: product.category?.name || 'N/A',
            price: Number(product.price),
            stock: Number(product.stock),
            date: new Date(product.created_at).toLocaleDateString('fr-FR')
        });

        row.eachCell((cell, colNumber) => {
            cell.border = borderStyle;
            if (Number(row.number) % 2 === 0) {
                if (!cell.fill) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF9FAFB' }
                    };
                }
            }

            if (worksheet.getColumn(colNumber).key === 'stock') {
                setStatusColor(cell, product.stock, 'stock');
            }
        });
    });

    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = headerFill;
        cell.font = headerFont;
        cell.alignment = centerAlign;
        cell.border = borderStyle;
    });

    worksheet.autoFilter = { from: 'A1', to: { row: 1, column: 6 } };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Produits_Electro05_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
