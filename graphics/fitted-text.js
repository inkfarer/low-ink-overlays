"use strict";
/*
    FittedText

    Horizontally squishes text to a specific width
    A VanillaJS alternative to https://github.com/SupportClass/sc-fitted-text

    Written by Inkfarer - https://inkfarer.com
*/
class FittedText extends HTMLElement {
    constructor() {
        super();
        this.fittedContent = document.createElement('div');
        this.maxWidth = -1;
        this.text = '';
        this.useInnerHTML = false;
    }
    connectedCallback() {
        const align = this.getAttribute('align') || 'left';
        this.maxWidth = parseInt(this.getAttribute('max-width') || '-1');
        this.useInnerHTML = (this.getAttribute('useInnerHTML') === '');
        this.innerHTML = '';
        this.setAttribute('style', this.removeLineBreaks(`
			display: flex;
			white-space: nowrap;
			max-width: ${this.maxWidth > 0 ? this.maxWidth + 'px' : 'unset'};
			justify-content: ${this.getJustify(align)}
		`));
        this.fittedContent.setAttribute('style', this.removeLineBreaks(`
			transform-origin: ${align} center;
			text-align: ${align};
		`));
        this.appendChild(this.fittedContent);
        this.setTransform();
    }
    static get observedAttributes() { return ['text', 'max-width', 'align', 'useInnerHTML']; }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'text':
                this.text = newValue;
                this.setText();
                this.setTransform();
                return;
            case 'max-width':
                if (oldValue) {
                    this.maxWidth = newValue;
                    this.style.maxWidth = `${this.maxWidth > 0 ? this.maxWidth + 'px' : 'unset'}`;
                    this.setTransform();
                }
                return;
            case 'align':
                this.style.justifyContent = this.getJustify(newValue);
                this.fittedContent.style.textAlign = newValue;
                this.fittedContent.style.transformOrigin = `${newValue} center`;
                return;
            case 'useInnerHTML':
                this.useInnerHTML = newValue;
                this.setText();
                return;
        }
    }
    setText() {
        if (this.useInnerHTML) {
            this.fittedContent.innerHTML = this.text;
        }
        else {
            this.fittedContent.innerText = this.text;
        }
    }
    setTransform() {
        if (this.maxWidth <= 0)
            return;
        const scrollWidth = this.fittedContent.scrollWidth;
        if (scrollWidth > this.maxWidth) {
            this.fittedContent.style.transform = `scaleX(${this.maxWidth / scrollWidth})`;
        }
        else {
            this.fittedContent.style.transform = 'scaleX(1)';
        }
    }
    getJustify(align) {
        switch (align) {
            case 'center':
                return 'center';
            case 'right':
                return 'flex-end';
            default:
                return 'unset';
        }
    }
    removeLineBreaks(input) {
        return input.replace(/\s+/g, ' ').trim();
    }
}
customElements.define('fitted-text', FittedText);
