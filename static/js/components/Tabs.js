// Reusable tabs component
export class Tabs {
    constructor(container) {
        this.container = container;
        this.tabs = new Map();
        this.activeTab = null;
    }

    addTab(id, label, content) {
        this.tabs.set(id, { label, content });
        this.render();
    }

    switchTab(id) {
        this.activeTab = id;
        this.render();
    }

    render() {
        const tabList = document.createElement('div');
        tabList.className = 'flex space-x-2 mb-4';
        
        this.tabs.forEach((tab, id) => {
            const button = document.createElement('button');
            button.className = `px-4 py-2 glass-card ${
                id === this.activeTab ? 'bg-opacity-75' : 'hover:bg-opacity-50'
            }`;
            button.textContent = tab.label;
            button.onclick = () => this.switchTab(id);
            tabList.appendChild(button);
        });

        const content = document.createElement('div');
        content.className = 'glass-card p-4';
        if (this.activeTab) {
            content.innerHTML = this.tabs.get(this.activeTab).content;
        }

        this.container.innerHTML = '';
        this.container.appendChild(tabList);
        this.container.appendChild(content);
    }
}