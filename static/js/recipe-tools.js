// Recipe Tools: Scaling, Unit Conversion, and Print Features
class RecipeTools {
    constructor() {
        this.originalServings = parseInt(document.getElementById('servings').value) || 1;
        this.currentUnit = 'metric'; // metric or imperial
        this.conversionRates = {
            // Volume
            'ml': { to: 'fl oz', rate: 0.033814 },
            'l': { to: 'cups', rate: 4.22675 },
            'fl oz': { to: 'ml', rate: 29.5735 },
            'cups': { to: 'l', rate: 0.236588 },
            // Weight
            'g': { to: 'oz', rate: 0.035274 },
            'kg': { to: 'lb', rate: 2.20462 },
            'oz': { to: 'g', rate: 28.3495 },
            'lb': { to: 'kg', rate: 0.453592 },
            // Temperature
            '°C': { to: '°F', rate: null }, // Special conversion
            '°F': { to: '°C', rate: null }  // Special conversion
        };
        
        this.init();
    }

    init() {
        this.initServingsControl();
        this.initUnitToggle();
        this.initPrintButton();
    }

    initServingsControl() {
        const decreaseBtn = document.getElementById('decrease-servings');
        const increaseBtn = document.getElementById('increase-servings');
        const servingsInput = document.getElementById('servings');

        if (!decreaseBtn || !increaseBtn || !servingsInput) return;

        decreaseBtn.addEventListener('click', () => {
            const current = parseInt(servingsInput.value);
            if (current > 1) {
                servingsInput.value = current - 1;
                this.updateIngredients(current - 1);
            }
        });

        increaseBtn.addEventListener('click', () => {
            const current = parseInt(servingsInput.value);
            servingsInput.value = current + 1;
            this.updateIngredients(current + 1);
        });

        servingsInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1) {
                e.target.value = 1;
                this.updateIngredients(1);
            } else {
                this.updateIngredients(value);
            }
        });
    }

    updateIngredients(newServings) {
        const ingredients = document.querySelectorAll('.ingredient');
        const scaleFactor = newServings / this.originalServings;

        ingredients.forEach(ingredient => {
            const originalAmount = parseFloat(ingredient.dataset.amount);
            const unit = ingredient.dataset.unit;
            const amountSpan = ingredient.querySelector('.amount');
            
            if (originalAmount && amountSpan) {
                const newAmount = originalAmount * scaleFactor;
                amountSpan.textContent = this.formatAmount(newAmount);
            }
        });

        // Update print servings
        const printServings = document.getElementById('print-servings');
        if (printServings) {
            printServings.textContent = newServings;
        }

        // Show toast notification
        window.toast?.show(`Recipe adjusted for ${newServings} servings`, 'info');
    }

    formatAmount(amount) {
        if (amount >= 1) {
            return Math.round(amount * 2) / 2; // Round to nearest 0.5
        }
        return amount.toFixed(2);
    }

    initUnitToggle() {
        const toggleBtn = document.getElementById('toggle-units');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            this.currentUnit = this.currentUnit === 'metric' ? 'imperial' : 'metric';
            this.convertUnits();
            window.toast?.show(`Switched to ${this.currentUnit} units`, 'info');
        });
    }

    convertUnits() {
        const ingredients = document.querySelectorAll('.ingredient');
        
        ingredients.forEach(ingredient => {
            const amount = parseFloat(ingredient.querySelector('.amount').textContent);
            const unitSpan = ingredient.querySelector('.unit');
            const unit = unitSpan.textContent.trim();

            if (this.conversionRates[unit]) {
                const conversion = this.conversionRates[unit];
                let newAmount, newUnit;

                if (unit === '°C' || unit === '°F') {
                    [newAmount, newUnit] = this.convertTemperature(amount, unit);
                } else {
                    newAmount = amount * conversion.rate;
                    newUnit = conversion.to;
                }

                ingredient.querySelector('.amount').textContent = this.formatAmount(newAmount);
                unitSpan.textContent = newUnit;
            }
        });
    }

    convertTemperature(value, unit) {
        if (unit === '°C') {
            return [(value * 9/5) + 32, '°F'];
        } else {
            return [(value - 32) * 5/9, '°C'];
        }
    }

    initPrintButton() {
        const printBtn = document.getElementById('print-recipe');
        if (!printBtn) return;

        printBtn.addEventListener('click', () => {
            // Add print-specific styling
            const style = document.createElement('style');
            style.textContent = this.getPrintStyles();
            document.head.appendChild(style);

            // Print the page
            window.print();

            // Remove print-specific styling
            setTimeout(() => style.remove(), 100);
        });
    }

    getPrintStyles() {
        return `
            @media print {
                /* Hide non-essential elements */
                nav, footer, .recipe-tools, .share-button-container, 
                .reading-progress-container, .back-to-top {
                    display: none !important;
                }

                /* Show print-only elements */
                .print-only {
                    display: block !important;
                }

                /* Recipe layout */
                .recipe-container {
                    max-width: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }

                /* Typography */
                body {
                    font-size: 12pt;
                    line-height: 1.5;
                }

                h1 { font-size: 24pt; }
                h2 { font-size: 18pt; }
                h3 { font-size: 14pt; }

                /* Page breaks */
                .recipe-ingredients,
                .recipe-instructions {
                    page-break-inside: avoid;
                }

                /* Grid layout for notes */
                .notes-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin: 1rem 0;
                }

                /* QR Code for digital version */
                .recipe-qr {
                    text-align: center;
                    margin-top: 2rem;
                }

                /* Links */
                a {
                    text-decoration: none !important;
                    color: black !important;
                }

                /* Colors */
                * {
                    color: black !important;
                    background: white !important;
                }
            }
        `;
    }
}

// Initialize Recipe Tools
document.addEventListener('DOMContentLoaded', () => {
    new RecipeTools();
});
