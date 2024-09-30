ig.module( 
	'babylon.plugins.wgl-system' 
)
.requires(
    'babylon.plugins.wgl-timer'
)
.defines(function(){	
	
    wgl.System = ig.Class.extend({
        fps:null,
        tick:0,
        
        loader:null,
        assets:{},
        canvas:null,
        engine:null,
        
        progress:0,
        
        babylonJSSupport:false,
        
        tempNewScene:null,
        
        canvas:null,
        started:false,

        loadSceneIndex: 0,
        rootUrl: null,
        scenesData: null,
        scenes: [],
        
        init:function(canvasId,fps)
    	{
            this.fps = fps;
            this.canvas = ig.$(canvasId);
            if(BABYLON.Engine.isSupported()) 
            {
        	    this.engine = new BABYLON.Engine(this.canvas, true,{},true);
                
                //this.engine.setHardwareScalingLevel(1);
            
                if(ig.ua.iOS)
                {
                    //this.engine.setHardwareScalingLevel(0.5);
                }
                this.babylonJSSupport=true;
            }
            else
            {
                throw("BabylonJS not supported");
                this.babylonJSSupport=false;
            }
    	},
        
        loadScenes:function(rootUrl, scenesData)
        {
            wgl.game.ready=false;
            this.rootUrl = rootUrl;
            this.scenesData = scenesData;

            if(this.babylonJSSupport)
            {
				BABYLON.SceneLoader.Load(rootUrl, 
											scenesData[this.loadSceneIndex].path, 
											this.engine,
											this.onLoadSuccess.bind(this),
											this.progressCallback.bind(this),
											this.onLoadError.bind(this));

                // wgl.game.currentScene.enablePhysics();

            // Ammo().then(function() {
            //     BABYLON.SceneLoader.Load(rootUrl, 
            //                              scenesData[this.loadSceneIndex].path, 
            //                              this.engine,
            //                              this.onLoadSuccess.bind(this),
            //                              this.progressCallback.bind(this),
            //                              this.onLoadError.bind(this));
            // }.bind(this));

				
			}
            else
            {
                throw("Unable to load scene because BabylonJS is not supported");
            }
        },
        
        progressCallback:function(progress)
        {
            this.progress=progress;
        },
        
        onLoadSuccess:function(scene)
        {
            
            console.log("load scene " + this.loadSceneIndex + " success");

            // create camera
            var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 30, -50), scene);

            // Targets the camera to a particular position. In this case the scene origin
            camera.setTarget(BABYLON.Vector3.Zero());

            // put our scene controller
            scene.sceneController = this.scenesData[this.loadSceneIndex].sceneController;
            this.scenes.push(scene);
        
    		// Wait for textures and shaders to be ready
    		scene.executeWhenReady(this.onSceneReady.bind(this));

            var physicsPlugin = new BABYLON.CannonJSPlugin();
                physicsPlugin.setGravity(new BABYLON.Vector3(0, -0.1, 0));
            scene.enablePhysics(new BABYLON.Vector3(0, -1, 0),physicsPlugin);

            
        },
    
        onLoadError:function(scene)
        {
            console.log("ERROR: at scene " + this.loadSceneIndex);

            this.loadSceneIndex++;
            // load the next scene
            if(this.loadSceneIndex < this.scenesData.length){
                this.loadScenes(this.rootUrl, this.scenesData);
            }else{
                this.allScenesLoaded();
            }
        },
        onSceneReady:function()
        {
            console.log("scene " + this.loadSceneIndex + " ready");            
            // load glb   
            this.scenes[this.loadSceneIndex].glb = {};
            ig.glbLoader.init(this.scenesData[this.loadSceneIndex].glb, this.onGLBLoaded.bind(this));         

        },

        onGLBLoaded: function(){
            console.log("scene " + this.loadSceneIndex + " glb ready");

            if(this.scenesData[this.loadSceneIndex].preloadTextures){   // if there are preload texture we need to load
                this.scenesData[this.loadSceneIndex].preloadTextures(0, this.scenes[this.loadSceneIndex], this.onPreloadTextureLoaded.bind(this));
            }else{
                this.onPreloadTextureLoaded();
            }
        },

        onPreloadTextureLoaded: function(){
            console.log("scene " + this.loadSceneIndex + " preload texture ready");

            this.loadSceneIndex++;
            // load the next scene
            if(this.loadSceneIndex < this.scenesData.length){
                this.loadScenes(this.rootUrl, this.scenesData);
            }else{
                this.allScenesLoaded();
            }
        },

        allScenesLoaded: function(){
            if (wgl.debug.debug) {
                wgl.debug.enableDebug();
            }

            // default first scene to load is the main scene
            wgl.game.currentScene = this.scenes[0];

            this.startRender();

            wgl.system.engine.hideLoadingUI();

            wgl.game.ready=true;
            ig[wgl.game.currentScene.sceneController].init();
        },
        
        startRender:function()
        {
            this.engine.runRenderLoop(wgl.game.render.bind(wgl.game));
        },
        
        stopRender:function()
        {
            this.engine.stopRenderLoop();
            
        },
        
    });
        
});