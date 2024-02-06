import VisualFeedback from './scripts/visual-feedback';

// window.PluginManager.register('AddToCard', VisualFeedback, '.buy-widget');

window.PluginManager.override('AddToCart', VisualFeedback, '[data-add-to-cart]');