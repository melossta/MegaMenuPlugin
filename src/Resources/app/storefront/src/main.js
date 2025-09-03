import './scss/mega-menu.scss';
import MegaMenuAjaxPlugin from './mega-menu/mega-menu.plugin';


const PluginManager = window.PluginManager;
PluginManager.register('MegaMenuAjax', MegaMenuAjaxPlugin, '#main-navigation-menu');
