ig.module( 
	'babylon.game.wgl-main' 
)
.requires(
	'babylon.plugins.wgl-game'
    ,'babylon.plugins.wgl-system'
    ,'babylon.plugins.wgl-debug'
    ,'babylon.plugins.wgl-game'
    ,'babylon.game.glb-loader'
    ,'babylon.scene.scene-game'
)
.defines(function(){	
	
    MyWGLGame=wgl.Game.extend({
        scenesData:[          
            {
                id: "game",
                path: "game-scene.babylon",
                sceneController: "gameScene",
                glb: [], 
                preloadTextures: function(index, scene, onCompleteCallback){
                    switch(index){
                        case 0:
                            new BABYLON.CubeTexture("media/scenes/sky/sky", scene, null, false, null, function(){
                               wgl.system.scenesData[wgl.system.loadSceneIndex].preloadTextures(index + 1, scene, onCompleteCallback);
                            });
                            break;  
                        default:
                            onCompleteCallback(); 
                    }                    
                }
            },
        ],
        root:"media/scenes/",            
        init:function(){

        },
        
        loadScenes:function()
        {
            wgl.system.loadScenes(this.root, this.scenesData);
        },
        setScene: function(sceneName){
            wgl.system.stopRender();

            var index = 0;
            for(var i = 0; i < this.scenesData.length; i++){
                if(this.scenesData[i].id == sceneName){
                    index = i;
                    break;
                }
            }
            wgl.game.currentScene = wgl.system.scenes[index];

            if(!wgl.game.currentScene.cameras || (wgl.game.currentScene.cameras && wgl.game.currentScene.cameras.length == 0)){
                var scene = wgl.game.currentScene;
                // create camera
                var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 30, -50), scene);

                // Targets the camera to a particular position. In this case the scene origin
                camera.setTarget(BABYLON.Vector3.Zero());
            }

            ig[wgl.game.currentScene.sceneController].init();

            wgl.system.startRender();


        }
        
    });
    
    /**
    * Defining webgl main
    * this is called in main.js after initialising impactjs
    */
    wgl.webglmain = function( canvasId, fps, width, height, scale ) {
        
        wgl.debug = new wgl.Debug();
        wgl.system = new wgl.System(canvasId,fps);
        wgl.game = new MyWGLGame();
        
    };
});
