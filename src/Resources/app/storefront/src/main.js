import VisualFeedback from './scripts/visual-feedback';

window.PluginManager.override('AddToCart', VisualFeedback, '[data-add-to-cart]');