/** @class */
window.Flipcat = window.Flipcat || {};
Flipcat.Userscripts = Flipcat.Userscripts || {};
/**
 * @object 
*/
Flipcat.Userscripts.run = function(name, args) {
	if(Flipcat.Userscripts[name] && Flipcat.Userscripts[name] instanceof Function) {
		Flipcat.Userscripts[name].call(Flipcat.Userscripts, args);
	}
}
