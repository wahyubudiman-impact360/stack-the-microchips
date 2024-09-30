ig.module(
        'babylon.scene.scene-game'
    )
    .requires(
        
    )
    .defines(function() {
        // NOTE---------------------
        // this is the base, can copy from this, just change the initWorld function content
        ig.gameScene = {
            isSceneControllerLoaded: false,

            init: function() {

                if(this.isSceneControllerLoaded){
                    return;
                }

                this.isSceneControllerLoaded = true;

                wgl.system.engine.performanceMonitor.enable();

                this.construct();

                // save performance
                // because we will always in skybox
                wgl.game.currentScene.autoClear = false; // Color buffer
                wgl.game.currentScene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
            },

            construct: function() {
                this.initCamera();
                this.initLight();
                this.initSky();
                // this.initWorld();
                
            },

            initCamera: function(){
                this.camera = wgl.game.currentScene.cameras[0];
                this.camera.fov = 0.4;
                this.camera.maxZ = 1024;
                
                // Enable mouse wheel inputs.
                this.camera.inputs.addMouseWheel();

                // This targets the camera to scene origin
                this.camera.setTarget(BABYLON.Vector3.Zero());

                // This attaches the camera to the canvas
                this.camera.attachControl(true);

            },
            initLight: function() {
                var scene = wgl.game.currentScene;
                this.sun = scene.getLightByName("Light");
                this.sun.intensity = 1.35;
                this.sun.position.x *= 60;
                this.sun.position.y *= 60;
                this.sun.position.z *= 60;

                this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.sun);
                this.shadowGenerator.setDarkness(0.2);
            },

            initSky: function(){
                var scene = wgl.game.currentScene;

                // Skybox
                var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:500.0}, scene);
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.reflectionTexture = scene.getTextureByName("media/scenes/sky/sky");
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skybox.material = skyboxMaterial;
            },
            createFloorSky: function(){
                var scene = wgl.game.currentScene;
                scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;

                scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
                // scene.fogDensity = 0.0001;  // only for EXP

                //Only if LINEAR
                scene.fogStart = 150.0;
                scene.fogEnd = 200.0;
            },

            setEmissiveColor: function(material){
                if (material && material.albedoColor) {
                    material.emissiveColor = material.albedoColor;
                    material.emissiveIntensity = 1;
                } else if (material && material.subMaterials) {
                    this.setEmissiveColorSubMaterial(material.subMaterials);
                }
            },

            setEmissiveColorSubMaterial: function(subMaterials){
                for(var i = 0; i < subMaterials.length; i++){
                    if(subMaterials[i].albedoColor){
                        subMaterials[i].emissiveColor = subMaterials[i].albedoColor;
                        subMaterials[i].emissiveIntensity = 1;
                    }else if(subMaterials[i].subMaterials){
                        // recursive
                        this.setEmissiveColorSubMaterial(subMaterials[i].subMaterials);
                    }
                }   
            },

            setAlpha: function(material, value){
                if (material && material.subMaterials) {
                    this.setAlphaSubMaterial(material.subMaterials, value);
                }else {
                    material.alpha = value;
                }
            },

            setAlphaSubMaterial: function(subMaterials, value){
                for(var i = 0; i < subMaterials.length; i++){
                    if(subMaterials[i].subMaterials){
                        // recursive
                        this.setAlphaSubMaterial(subMaterials[i].subMaterials, value);
                    }else{
                        subMaterials[i].alpha = value;
                    }
                }   
            }
        };

    });