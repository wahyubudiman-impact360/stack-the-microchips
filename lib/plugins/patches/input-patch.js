/**
* Edited by Justin Ng to be fixed with ig.Input.inject and IFRAME detection
* ver 1.1
* ver 1.2 Attempt to unlock WebAudio
*/


ig.module(
    "plugins.patches.input-patch"
).requires(
    "impact.input"
).defines(function () {
    
    //inject
    ig.Input.inject({
        move:new BABYLON.Vector2(0,0),

        initMouse: function() {
            this.parent(); 

            ig.system.canvas.addEventListener('mouseleave', this.mouseleave.bind(this), false );
        },
        
        mousemove: function(event) {
            this.parent(event);

            /* attempt to unlock WebAudio */
            try {
                ig.soundHandler.unlockWebAudio();
            } catch (error) {}
        },
        
    	keyup: function(event) 
		{
			this.parent(event);
			
			if (ig.visibilityHandler) {
				ig.visibilityHandler.onChange("focus");
			}
			
			/* attempt to unlock WebAudio */
			try {
				ig.soundHandler.unlockWebAudio();
			} catch (error) {}
		},

        mouseleave: function(event) {
            this.clearState("click");
        },

        clearState: function(action) {
            this.actions[action] = false;
        },

        clearAllState: function() {
            for (var action in this.actions) {
                this.clearState(action);
            }
        }
    })
});
