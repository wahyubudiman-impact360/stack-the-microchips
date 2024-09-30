ig.module(
        'babylon.game.glb-loader'
    )
    .requires()
    .defines(function() {
    	ig.glbLoader = {
    		root: "media/scenes/glb/",
            files:null,
            callback: null,
    		init: function(files, callback){
                this.files = files;
                this.callback = callback;
    			this.loadGlb(0);
    		},

    		loadGlb: function(index){
    			if(index == this.files.length){
    				this.completed()
    			}else{
    				var name = this.files[index];
    				var scene = wgl.system.scenes[wgl.system.loadSceneIndex];

	                BABYLON.SceneLoader.LoadAssetContainer(this.root, name + ".glb", scene, function(container) {
                        container.scene.glb[name] = container;	                    
	                    this.loadGlb(index + 1);
	                }.bind(this));

    			}
    		},

    		completed: function(){
                this.callback();
    		}
    	}
    });