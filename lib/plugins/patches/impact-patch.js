/**
* impact patch to skip certain property keys in the ig.merge function so that BabylonJS objects works correctly in ImpactJS
ig.merge merges all the properties of the extended object recursively into the target object, overwriting existing properties.
*/

ig.module(
    "plugins.patches.impact-patch"
).requires(
	'impact.impact'
).defines(function () {
	var ignoreMergeKeys = ["_mesh", "_camera"];
    //inject
    window.ig.merge = function( original, extended ) {
		for( var key in extended ) {
			if(ignoreMergeKeys.indexOf(key) >= 0) {
				continue;
			}
	
			var ext = extended[key];
			if(
				typeof(ext) != 'object' ||
				ext instanceof HTMLElement ||
				ext instanceof ig.Class ||
				ext === null
			) {
				original[key] = ext;
			}
			else {
				if( !original[key] || typeof(original[key]) != 'object' ) {
					original[key] = (ext instanceof Array) ? [] : {};
				}
				ig.merge( original[key], ext );
			}
		}
		return original;
	}
});
