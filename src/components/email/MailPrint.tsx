// components/print/MailPrint.tsx

interface MailPrintProps {
    subject: string;
    content: string;
    from?: string;
    to?: string;
    date?: string;
    attachments?: Array<{ filename: string; size: number }>;
}

export function printMail(props: MailPrintProps) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow pop-ups to print');
        return;
    }

    // Format date to just show month/day/year (e.g., 12/2/2020)
    const formatDate = (dateStr?: string): string => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        } catch {
            return dateStr;
        }
    };

    const formattedDate = formatDate(props.date);

    const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Print Email: ${escapeHtml(props.subject)}</title>
                <meta charset="UTF-8">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        padding: 40px;
                        background: #f5f5f5;
                        line-height: 1.6;
                        color: #000;
                    }
                    
                    .print-container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        padding: 30px;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .info-block {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                    }
                    
                    .from-to {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }
                    
                    .info-label {
                        font-weight: 600;
                        color: #444;
                    }
                    
                    .info-value {
                        color: #666;
                    }
                    
                    .date {
                        color: #666;
                    }
                    
                    .subject {
                        font-size: 24px;
                        font-weight: 600;
                        margin-bottom: 16px;
                        color: #1a1a1a;
                    }
                    
                    .content {
                        font-size: 16px;
                        line-height: 1.7;
                    }
                    
                    .content img {
                        max-width: 100%;
                        height: auto;
                    }
                    
                    .attachments-title {
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 12px;
                        color: #444;
                    }
                    
                    .attachment-list {
                        list-style: none;
                        font-size: 13px;
                        color: #666;
                    }
                    
                    .attachment-list li {
                        margin-bottom: 8px;
                    }
                    
                    @media print {
                        body {
                            background: white;
                            padding: 0;
                        }
                        .print-container {
                            box-shadow: none;
                            border-radius: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <!-- Block 1: Info (from, to, date) -->
                    <div class="info-block">
                        <div class="from-to">
                            ${
                                props.from
                                    ? `
                                <div>
                                    <span class="info-label">From:</span>
                                    <span class="info-value"> ${escapeHtml(props.from)}</span>
                                </div>
                            `
                                    : ''
                            }
                            ${
                                props.to
                                    ? `
                                <div>
                                    <span class="info-label">To:</span>
                                    <span class="info-value"> ${escapeHtml(props.to)}</span>
                                </div>
                            `
                                    : ''
                            }
                        </div>
                        ${
                            formattedDate
                                ? `
                            <div class="date">${escapeHtml(formattedDate)}</div>
                        `
                                : ''
                        }
                    </div>
                    
                    <!-- Block 2: Subject and Content -->
                    <div>
                        <div class="subject">${escapeHtml(props.subject) || '(No Subject)'}</div>
                        <div class="content">${props.content || ''}</div>
                    </div>
                    
                    <!-- Block 3: Attachments -->
                    ${
                        props.attachments && props.attachments.length > 0
                            ? `
                        <div>
                            <div class="attachments-title">Attachments (${props.attachments.length})</div>
                            <ul class="attachment-list">
                                ${props.attachments
                                    .map(
                                        (att) => `
                                    <li>📎 ${escapeHtml(att.filename)} (${formatFileSize(att.size)})</li>
                                `
                                    )
                                    .join('')}
                            </ul>
                        </div>
                    `
                            : ''
                    }
                </div>
                <script>
                    window.onload = () => {
                        window.print();
                        window.onafterprint = () => window.close();
                    }
                <\/script>
            </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
}

// Helper functions
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
