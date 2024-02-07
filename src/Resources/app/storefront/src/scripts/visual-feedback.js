import AddToCard from 'src/plugin/add-to-cart/add-to-cart.plugin';
import DomAccess from 'src/helper/dom-access.helper';
import HttpClient from 'src/service/http-client.service';

export default class VisualFeedback extends AddToCard {
  init() {
    this.PluginManager = window.PluginManager;
    this._cartEl = DomAccess.querySelector(document, '.header-cart');
    this._buyButtonEl = this.el.querySelector('.btn-buy');
    this._quantityInputEl = this.el.querySelector('.quantity-selector-group');

    this._client = new HttpClient(window.accessKey, window.contextToken);

    super.init();
  }

  _openOffCanvasCart(instance, requestUrl, formData) {
    this._client.post(requestUrl, formData, this._afterAddItemToCart.bind(this));
  }

  _afterAddItemToCart() {
    this._refreshCartValue();
    this._visualFeedback();
  }

  _refreshCartValue() { // needed to keep the cart value in sync with the actual cart
    const cartWidgetEl = DomAccess.querySelector(this._cartEl, '[data-cart-widget]');
    const cartWidgetInstance = this.PluginManager.getPluginInstanceFromElement(cartWidgetEl, 'CartWidget');
    cartWidgetInstance.fetch();
  }

  _visualFeedback() {
    // Get the labels from the snippets via data attributes
    const feedbackLabel = this._buyButtonEl.getAttribute('data-feedback-label');
    const defaultLabel = this._buyButtonEl.getAttribute('data-add-to-cart-label');

    // Disable the button and add a visual feedback class
    this._buyButtonEl.disabled = true;
    this._buyButtonEl.classList.add('btn-buy-visual-feedback');

    if (feedbackLabel) { // check if the feedback label is set to avoid setting an empty string
      this._buyButtonEl.textContent = feedbackLabel;
    }

    // Add a visual feedback class to the quantity input if you are on a product detail page
    let quantityClassAdded = false;
    if (this._quantityInputEl) {
      this._quantityInputEl.classList.add('quantity-selector-group-visual-feedback');
      quantityClassAdded = true;
    }

    window.setTimeout(() => { // Reset the button and quantity input after 1 seconds
      this._buyButtonEl.disabled = false;
      this._buyButtonEl.classList.remove('btn-buy-visual-feedback');
      
      if (defaultLabel) { // check if the default label is set to avoid setting an empty string else set a default fallback label - this should never happen
        this._buyButtonEl.textContent = defaultLabel;
      } else {
        this._buyButtonEl.textContent = 'Add to cart';
      }

      if (quantityClassAdded) {
        this._quantityInputEl.classList.remove('quantity-selector-group-visual-feedback');
      }
    }, 1000);
  }
}