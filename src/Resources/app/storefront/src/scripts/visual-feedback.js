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

  _refreshCartValue() {
    const cartWidgetEl = DomAccess.querySelector(this._cartEl, '[data-cart-widget]');
    const cartWidgetInstance = this.PluginManager.getPluginInstanceFromElement(cartWidgetEl, 'CartWidget');
    cartWidgetInstance.fetch();
  }

  _visualFeedback() {
    this._buyButtonEl.disabled = true;
    this._buyButtonEl.classList.add('btn-buy-visual-feedback');

    let quantityClassAdded = false;
    if (this._quantityInputEl) {
      this._quantityInputEl.classList.add('quantity-selector-group-visual-feedback');
      quantityClassAdded = true;
    }

    window.setTimeout(() => {
      this._buyButtonEl.disabled = false;
      this._buyButtonEl.classList.remove('btn-buy-visual-feedback');

      if (quantityClassAdded) {
        this._quantityInputEl.classList.remove('quantity-selector-group-visual-feedback');
      }
    }, 1000);
  }
}