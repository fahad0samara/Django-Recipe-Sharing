// Reusable filter component
export class FilterBar {
    constructor(container, options = {}) {
        this.container = container;
        this.filters = new Map();
        this.onChange = options.onChange || (() => {});
    }

    addFilter(id, options) {
        this.filters.set(id, {
            label: options.label,
            type: options.type,
            values: options.values || [],
            selected: options.default
        });
        this.render();
    }

    getValue(id) {
        return this.filters.get(id)?.selected;
    }

    render() {
        this.container.innerHTML = '';
        this.filters.forEach((filter, id) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex items-center gap-2';
            
            const label = document.createElement('label');
            label.textContent = filter.label;
            wrapper.appendChild(label);

            if (filter.type === 'select') {
                const select = document.createElement('select');
                select.className = 'glass-card p-2';
                select.onchange = (e) => {
                    filter.selected = e.target.value;
                    this.onChange(id, e.target.value);
                };
                
                filter.values.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    option.selected = value === filter.selected;
                    select.appendChild(option);
                });
                
                wrapper.appendChild(select);
            }
            
            this.container.appendChild(wrapper);
        });
    }
}