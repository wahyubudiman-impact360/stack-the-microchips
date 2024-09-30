ig.module(
        'game.entities.controllers.controller'
    )
    .requires(
        'impact.entity',
        'game.entities.buttons.button-start',
        'game.entities.buttons.button-more-games',
        'game.entities.gui',
        'game.entities.objects.stars',
        'game.entities.buttons.button-replay',
        'game.entities.buttons.button-mute'
    )
    .defines(function() {
        EntityController = ig.Entity.extend({
            wglControllerName:"gameScene",
            uiStatus:true,
            collides:ig.Entity.COLLIDES.NEVER,
            type:ig.Entity.TYPE.A,
            zIndex:0,
            zIndexFake:1,
            child:null,
            childOrigin:1,
            score:0,
            bestScore:0,
            bonus:0,
            bonusAlpha:0,
            bonusText:'',
            bonusScale:0,
            gameOver:false,
            scoreAlpha:0,
            scoreLiveAlpha:0,
            animbtPlay:true,
            animbtreplay:true,
            starsItem:[],
            splitBox:false,
            baseColor:{r:0.2,g:0.6,b:0.2},
            combo:0,
            h:250,
            s:35,
            l:50,
            disabledClick:false,
            drawBonusStatus:null,
            resizeStatus:false,

            boxHeight: 0.2,
            boxWidth: 1,
            camSpeed: 0.8 / 60,
            deviation: 0.05,
            blockSpeed: -2 / 60,
            fallingSpeed: 2 / 60,
            currentDirection: 'z',
            stackLength: 1,
            started: false,
            over: false,
            fallingBoxes:[],
            camPosY:0,
            box2List:[],
            currentCombo:0,
            maxCombo:0,
            init: function(x, y, settings) {
                this.size=new BABYLON.Vector2(ig.system.width,ig.system.height),
                this.parent(x, y, settings);

                this.h=Math.floor(Math.random()*360);
                this.nextColor();

                this.bestScore=ig.game.load('score');

                ig.game.pausedStatus = false;
                ig.game.gameOver=false;
                this.initButton();
                this.initStars();
                this.initLight();

                wgl.system.startRender();
                this.wglController = ig[this.wglControllerName];
                this.gui=ig.game.spawnEntity(EntityGui,0,0,{main:this,control:this});

                this.camera = this.wglController.camera;
                this.camera.position.y = 7

                var target = new BABYLON.Vector3(0, 0, 0);
                this.camera.setTarget(target);

                this.addFirstBlock();
                this.spawnMainbox();

                ig.input.bind(ig.KEY.SPACE, 'SPACE');

                var physicsPlugin = new BABYLON.CannonJSPlugin();
                physicsPlugin.world.gravity=new BABYLON.Vector3(0, -6, 0);
                wgl.game.currentScene.enablePhysics(new BABYLON.Vector3(0, -6, 0),physicsPlugin);
                // console.log(physicsPlugin);
                ig.game.sortEntitiesDeferred();
            },
            spawnMainbox:function(){
                var scene = wgl.game.currentScene;
                this.mainbox = BABYLON.MeshBuilder.CreateBox("bigbox", {width: 1,depth: 1,height: 2}, scene);
                this.mainbox.position = new BABYLON.Vector3(0, -1.1, 0);
                this.meshPosition=this.mainbox.position;
                this.mainbox.checkCollisions=true;
                var boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
                boxMaterial.albedoColor = new BABYLON.Color3(this.baseColor.r, this.baseColor.g, this.baseColor.b);
                boxMaterial.emissiveTexture = boxMaterial.albedoTexture;
                boxMaterial.emissiveColor = boxMaterial.albedoColor;
                boxMaterial.emissiveIntensity = 1;
                boxMaterial.alpha = 1;
                this.mainbox.material = boxMaterial;
                this.mainbox.physicsImpostor = new BABYLON.PhysicsImpostor(this.mainbox, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution:0.2,friction:0.2}, scene);
            },
            addFirstBlock: function () {
                var scene=wgl.scene;
                this.lastBlock = BABYLON.MeshBuilder.CreateBox("box" + this.stackLength, {
                    width: this.boxWidth,
                    height: this.boxHeight,
                    depth: this.boxWidth
                },scene);
                var material = new BABYLON.StandardMaterial("boxMat" + this.stackLength);

                material.albedoColor = this.baseColor;
                material.emissiveTexture = material.albedoTexture;
                material.emissiveColor = material.albedoColor;
                material.emissiveIntensity = 1;
                this.lastBlock.material = material;
                this.mergeMesh(this.lastBlock);

            },
            addBlock: function () {
                this.nextColor();
                this.stackLength++;
                this.currentBlock = this.lastBlock.clone();
                var material = new BABYLON.StandardMaterial("boxMat" + this.stackLength);
                material.albedoColor = this.baseColor;
                material.emissiveTexture = material.albedoTexture;
                material.emissiveColor = material.albedoColor;
                material.emissiveIntensity = 1;
                // material.diffuseColor = this.getColor();
                this.currentBlock.material = material;
                if(this.currentDirection=='z'){
                    this.currentBlock.position[this.currentDirection] = 2-this.deviation;
                }else{
                    this.currentBlock.position[this.currentDirection] = -2+this.deviation;
                }
                this.currentBlock.position.y += this.boxHeight;
            },

            moveDown:function(){
                var scene = wgl.game.currentScene;               
                this.score +=2;
                this.camPosY +=0.2;
                var data={y:this.camera.position.y}                
                this.move = new ig.TweenDef(data).
                            to({y:this.camera.position.y+0.2},300).
                            onUpdate(function(data){
                                this.camera.position.y = data.y
                            }.bind(this)).
                            onComplete(function(data){
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);
                this.move.start();
            },

            perfectAnim:function(){

                this.addBonus();

                this.perfectBox=this.currentBlock.clone();
                var material = new BABYLON.StandardMaterial("boxPerfectMaterial" + this.stackLength);
                material.albedoColor = this.baseColor;
                material.emissiveTexture = material.albedoTexture;
                material.emissiveColor = material.albedoColor;
                material.emissiveIntensity = 1;
                this.perfectBox.material=material;
                this.mergeMesh(this.perfectBox);


                this.bonusbox=this.currentBlock.clone();
                var material = new BABYLON.StandardMaterial("bonusMaterial" + this.stackLength);
                material.albedoColor = new BABYLON.Color3(1,1,1);
                material.emissiveTexture = material.albedoTexture;
                material.emissiveColor = material.albedoColor;
                material.emissiveIntensity = 1;
                this.bonusbox.material=material;

                this.bonusbox.scaling.y = 0.01;
                this.bonusbox.position.y -= 0.1;
                var data={x:this.lastBlock.scaling.x,y:0.011,z:this.lastBlock.scaling.z,a:1,posY:-0.15};
                scale = new ig.TweenDef(data).
                            to({x:2*this.lastBlock.scaling.x,y:0.01,z:2*this.lastBlock.scaling.z,a:0},300).
                            onUpdate(function(data){
                                this.bonusbox.scaling.x=data.x;
                                this.bonusbox.scaling.y=data.y;
                                this.bonusbox.scaling.z=data.z;
                                this.bonusbox.material.alpha=data.a;
                            }.bind(this)).
                            onComplete(function(data){
                                setTimeout(function(){
                                    this.bonusbox.dispose();
                                }.bind(this),300);
                            }.bind(this)).
                            easing(ig.Tween.Easing.Quadratic.EaseInOut);
                scale.start();                
            },

            checkOverlap: function () {
                var scene = wgl.game.currentScene;               
                var physicsPlugin = new BABYLON.CannonJSPlugin();
                scene.enablePhysics(new BABYLON.Vector3(0, -1, 0),physicsPlugin);


                var ds = this.lastBlock.position[this.currentDirection] - this.currentBlock.position[this.currentDirection];
                var dsa = Math.abs(ds);
                var w = this.lastBlock.scaling[this.currentDirection];
                if (dsa > w - this.deviation) { // END
                    this.gameOverAnim();
                } else { // CONTINUE
                    if (dsa < this.deviation) { // PERFECTLY ACCURATE
                        this.currentBlock.position[this.currentDirection] = this.lastBlock.position[this.currentDirection];
                        this.perfectAnim();
                    } else { 
                        this.currentCombo = 0;
                        var overlap = w - dsa;
                        var fallingBox = this.currentBlock.clone();
                        var material = new BABYLON.StandardMaterial("fallBoxMaterial" + this.stackLength);
                        material.albedoColor = this.baseColor;
                        material.emissiveTexture = material.albedoTexture;
                        material.emissiveColor = material.albedoColor;
                        material.emissiveIntensity = 1;
                        fallingBox.material=material;

                        var offset=0;
                        var code = 0;
                        if(this.currentDirection=='z' && ds<0){
                            var offset = -0.02;
                            var code = 1;
                        }else if(this.currentDirection=='z' && ds>0){
                            var offset = 0.02;
                            var code = 2;
                        }else if(this.currentDirection=='x' && ds>0){
                            var offset = 0.02;
                            var code = 3;
                        }else if(this.currentDirection=='x' && ds<0){
                            var offset = -0.02;
                            var code = 4;
                        }


                        fallingBox.scaling[this.currentDirection] = dsa;
                        fallingBox.position[this.currentDirection] -= ds / dsa * overlap / 2 + offset;
                        
                        // this.fallPosY=fallingBox.position.y;
                        fallingBox.physicsImpostor = new BABYLON.PhysicsImpostor(fallingBox, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution:0.2,friction:0.2}, scene);

                        this.fallingBoxes.push(fallingBox);
                        this.rotateFallingBox(fallingBox,code);

                        this.currentBlock.scaling[this.currentDirection] = overlap;
                        this.currentBlock.position[this.currentDirection] += ds / 2;


                    }
                    this.currentDirection = (this.currentDirection == 'x') ? 'z' : 'x';
                    this.lastBlock = this.currentBlock;

                    this.mergeMesh(this.lastBlock);
                    this.addBlock();
                    this.moveDown()
                }
            },
            fallPosY:0,
            rotateFallingBox:function(meshToRotate,code){
                var scene = wgl.game.currentScene;               

                var data={rx:meshToRotate.rotation.x,
                          ry:meshToRotate.rotation.y,
                          rz:meshToRotate.rotation.z,
                          y:meshToRotate.position.y,
                          a:1};

                if(code==1){
                    var rotX=ig.game.randomIntFromInterval(30,90);
                    var rotZ=meshToRotate.rotation.z;
                }else if(code==2){
                    var rotX=-ig.game.randomIntFromInterval(30,90);
                    var rotZ=meshToRotate.rotation.z;
                }else if(code==3){
                    var rotX=meshToRotate.rotation.x;
                    var rotZ=ig.game.randomIntFromInterval(30,90);                    
                }else if(code==4){
                    var rotX=meshToRotate.rotation.x;
                    var rotZ=-ig.game.randomIntFromInterval(30,90);                                        
                    // var rotZ=-150;
                }


                var rotate1 = new ig.TweenDef(data).
                            to({rx:rotX,
                                rz:rotZ,
                                y:meshToRotate.position.y-1
                                },200).
                            onUpdate(function(data){
                                if(meshToRotate && meshToRotate.physicsImpostor) meshToRotate.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(data.rx.toRad(),0,data.rz.toRad(),0));
                            }.bind(this)).
                            onComplete(function(data){
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);

                var rotate2 = new ig.TweenDef(data).
                            to({},800).
                            onUpdate(function(data){
                            }.bind(this)).
                            onComplete(function(data){
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);

                var disapear = new ig.TweenDef(data).
                            to({a:0},200).
                            onUpdate(function(data){
                                meshToRotate.material.alpha=data.a;
                            }.bind(this)).
                            onComplete(function(data){
                                meshToRotate.dispose();
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);

                    rotate1.start();
                    rotate1.chain(rotate2);
                    rotate2.chain(disapear);
            },
            mergeMesh:function(meshToMerge){
                var scene = wgl.game.currentScene;               
                
                this.box2List.push(meshToMerge);
                if(this.box2List.length>20){
                    for(var i=0;i<this.box2List.length-20;i++){
                        if(this.box2List[i]!=null){
                            var body=scene.getMeshByName('bigbox');
                            var arr = [scene.getMeshByName('bigbox'), this.box2List[i]]; 
                            var mesh = BABYLON.Mesh.MergeMeshes(arr, true, true, undefined, false, true);
                            mesh.name = 'bigbox';
                            this.box2List[i].dispose();
                            this.box2List[i]=null;
                        }
                    }
                }

                if(this.box2List.length>1){
                    for(var i=this.box2List.length-2;i<this.box2List.length-1;i++){
                        if(this.box2List[i]!=null){
                            this.box2List[i].physicsImpostor = new BABYLON.PhysicsImpostor(this.box2List[i], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution:0.2,friction:0.2}, scene);
                        }
                    }
                }
         
            },
            nextColor:function(){

                this.h=(this.h+10)%360;
                this.rgb=this.hslToRgb(this.h/360,this.s/100,this.l/100);
                this.baseColor={r:this.rgb.r/255,g:this.rgb.g/255,b:this.rgb.b/255};

            },
            initLight:function () {
                var scene=wgl.game.currentScene;
                this.light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(2, 0, 0), scene);
                this.light1.intensity = 0.1;

                this.light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 0, 2), scene);
                this.light2.intensity = 0.2;
            },
            initStars:function(){                
                if(this.gameOver) return;
                 for(i=0;i<=4;i++){
                    this.starsItem.push(
                        setTimeout(function(){
                            this.createStars();
                        }.bind(this),(i*2000))
                    );
                }
                setTimeout(function(){
                    this.initStars();
                }.bind(this),15000);
            },

            createStars:function(){
                var arrX=[];
                arrX.push(ig.game.randomIntFromInterval(200, Math.floor(ig.system.width/2-200)));
                arrX.push(ig.game.randomIntFromInterval(Math.floor(ig.system.width/2+200),Math.floor(ig.system.width)-200));
                arrX.push(ig.game.randomIntFromInterval(Math.floor(ig.system.width/2-200),Math.floor(ig.system.width/2+200)));
                var idx=ig.game.randomIntFromInterval(0,2);
                var x=arrX[idx];

                if(idx==2){
                    var y = ig.game.randomIntFromInterval(100, Math.floor(ig.system.height/2)-200);                    
                }else{
                    var y = ig.game.randomIntFromInterval(100, Math.floor(ig.system.height)-20);                    
                }

                ig.game.spawnEntity(EntityStars,x,y, {control:this,zIndex:this.zIndexFake+1});
            },
            initButton:function(){
                var anchor = ig.responsive.toAnchor(0, 460, "center-middle");
                this.btstart=ig.game.spawnEntity(EntityButtonStart,anchor.x,anchor.y+ig.system.height/2, {control: this,zIndex:this.zIndexFake+2});

                var anchor = ig.responsive.toAnchor(10, 10, "top-left");
                this.btmute=ig.game.spawnEntity(EntityButtonMute,anchor.x+200,anchor.y+400, {control: this,zIndex:this.zIndexFake+2});

                var anchor = ig.responsive.toAnchor(-200, 10, "top-right");
                if(_SETTINGS.MoreGames.Enabled){
                    this.btmoregames=ig.game.spawnEntity(EntityButtonMoreGames,anchor.x-200,anchor.y, {control: this,zIndex:this.zIndexFake+2});
                }                
                this.btfullscreen=ig.game.spawnEntity(ig.FullscreenButton, anchor.x, anchor.y,{control:this});


                var targetY = ig.responsive.toAnchor(0, 370, "center-middle").y-this.btstart.size.y/2;
                var data={y:this.btstart.pos.y};
                this.movebtplay = new ig.TweenDef(data).
                            to({y:targetY},500).
                            onUpdate(function(data){
                                this.btstart.posy=data.y;
                            }.bind(this)).
                            onComplete(function(data){
                                this.animbtPlay=false;
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);
                this.movebtplay.start();

            },
            showUI:function(){
                this.uiStatus=false;
                this.initButton();

            },
            hideUI:function(){
                this.uiStatus=false;
                this.btstart.kill();
                this.btmute.kill();
                this.btfullscreen.kill();
                if(this.btmoregames){
                    this.btmoregames.hide();
                    this.btmoregames.kill();
                }
            },
            goHome:function(){

                for(var i=0;i<this.box2List.length;i++){
                    if(this.box2List[i]){
                        this.box2List[i].dispose();
                    }
                }

                for(var i=0;i<this.fallingBoxes.length;i++){
                    if(this.fallingBoxes[i]){
                        this.fallingBoxes[i].dispose();
                    }
                }

                var scene = wgl.game.currentScene;
                var mainbox = scene.getMeshByName('bigbox');
                if(mainbox) mainbox.dispose();
                this.light1.dispose();
                this.light2.dispose();
                this.scoreLiveAlpha=0;

                this.camera.position.y=7;
                this.camera.fov = 0.4;

                ig.game.director.loadLevel(1);
            },
            startGameplay:function(){
                if(this.animbtPlay) return;
                this.scoreLiveAlpha=1;
                this.hideUI()
                this.addBlock();
                // this.createChildA();
            },

            updatePosition:function(){

                if(this.btstart && !this.animbtPlay) {
                    var anchor = ig.responsive.toAnchor(0, 370, "center-middle");
                    this.btstart.posx=anchor.x-this.btstart.size.x/2;
                    this.btstart.posy=anchor.y-this.btstart.size.y/2;
                }

                if(this.btreplay && !this.animbtreplay) {
                    var anchor = ig.responsive.toAnchor(0, 380, "center-middle");
                    this.btreplay.posx=anchor.x-this.btreplay.size.x/2;
                    this.btreplay.posy=anchor.y-this.btreplay.size.y/2;
                }

                if(this.btmoregames) {
                    if(ig.ua.mobile){
                        if(ig.ua.iOS){
                            var anchor = ig.responsive.toAnchor(-220, 40, "top-right");
                        }else{
                            var anchor = ig.responsive.toAnchor(-460, 40, "top-right");                        
                        }
                    }else{
                        var anchor = ig.responsive.toAnchor(-360, 40, "top-right");                        
                    }
                    this.btmoregames.pos.x=anchor.x;
                    this.btmoregames.pos.y=anchor.y;
                }

                if(this.btmute) {
                    var anchor = ig.responsive.toAnchor(40, 30, "top-left");
                    this.btmute.posx=anchor.x;
                    this.btmute.posy=anchor.y;
                }

                if(this.btfullscreen) {
                    if(ig.ua.mobile){
                        var anchor = ig.responsive.toAnchor(-220, 40, "top-right");
                    }else{
                        var anchor = ig.responsive.toAnchor(-180, 40, "top-right");
                    }

                    this.btfullscreen.pos.x=anchor.x;
                    this.btfullscreen.pos.y=anchor.y;
                }
                this.resize();
            },
            resize:function(){
                if(this.resizeStatus) return;
                this.resizeStatus=true;
                this.size=new BABYLON.Vector2(ig.system.width,ig.system.height);
                setTimeout(function(){
                    this.resizeStatus=false;                    
                }.bind(this),1000);
            },
            update:function(){
                this.parent();

                if(ig.input.pressed('SPACE')){
                    this.clicked();
                }

                if(this.currentBlock) {
                    this.currentBlock.position[this.currentDirection] += this.blockSpeed;
                    
                    if(this.currentBlock.position[this.currentDirection]>2){
                        this.blockSpeed *=-1;
                    }
                    if(this.currentBlock.position[this.currentDirection]<-2){
                        this.blockSpeed *=-1;
                    }
                }

                this.updatePosition();
            },
            clicked:function(){
                if(this.uiStatus) return;
                if(this.gameOver) return;
                if(this.splitBox) return;
                if(this.disabledClick) return;

                this.checkOverlap();
            },
            clicking:function(){},
            released:function(){},
            gameOverAnim:function(){
                var data={x:this.currentBlock.position.x,
                          y:this.currentBlock.position.y,
                          z:this.currentBlock.position.z,
                          rx:this.currentBlock.rotation.x,
                          ry:this.currentBlock.rotation.y,
                          rz:this.currentBlock.rotation.z,
                          a:1};
                this.disapear = new ig.TweenDef(data).
                            to({x:-45,y:2,z:40,a:0,
                                rx:ig.game.randomIntFromInterval(0,360),
                                ry:ig.game.randomIntFromInterval(0,360),
                                rz:ig.game.randomIntFromInterval(0,360)
                                },1000).
                            onUpdate(function(data){

                                this.currentBlock.position.x=data.x;
                                this.currentBlock.position.y=data.y;
                                this.currentBlock.position.z=data.z;

                                this.currentBlock.rotation.x=data.rx.toRad();
                                this.currentBlock.rotation.z=data.rz.toRad();
                                this.currentBlock.material.alpha=data.a;

                            }.bind(this)).
                            onComplete(function(data){
                                this.currentBlock.dispose();
                                // this.child.kill();
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);
                this.disapear.start();

                if(this.bestScore<this.score){
                    this.bestScore=this.score;
                    ig.game.save('score',this.score);
                }

                this.gameOver=true;
                var data={a:0};
                this.scoreShow = new ig.TweenDef(data).
                            to({a:1},800).
                            onUpdate(function(data){
                                this.scoreAlpha=data.a;
                            }.bind(this)).
                            onComplete(function(data){
                                this.mainboxMoveBack();
                                // this.spawnReplayButton();
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);
                this.scoreShow.start();

                ig.game.playSfx("gameover");


            },

            mainboxMoveBack:function(){

                var data={y:this.camera.position.y,p:0.4};
                move = new ig.TweenDef(data).
                            to({y:7+this.camPosY/2,p:0.8},500).
                            onUpdate(function(data){
                                this.camera.position.y=data.y;
                                this.camera.fov = data.p;

                            }.bind(this)).
                            onComplete(function(data){
                                this.spawnReplayButton();
                            }.bind(this)).
                            easing(ig.Tween.Easing.Cubic.EaseInOut);
                move.start();

            },
            spawnReplayButton:function(){

                var anchor = ig.responsive.toAnchor(0, 380, "center-middle");
                this.btreplay = ig.game.spawnEntity(EntityButtonReplay, anchor.x, anchor.y+ig.system.height/2, {control: this,zIndex:this.zIndex+1});

                var targetY = ig.responsive.toAnchor(0, 380, "center-middle").y-this.btreplay.size.y/2;
                var data={y:this.btreplay.pos.y};
                this.movebtreplay = new ig.TweenDef(data).
                            to({y:targetY},500).
                            onUpdate(function(data){
                                this.btreplay.posy=data.y;
                            }.bind(this)).
                            onComplete(function(data){
                                this.animbtreplay=false;
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);
                this.movebtreplay.start();

            },
            addBonus:function(){
                this.bonusAlpha=1;

                var data={s:0};
                scale = new ig.TweenDef(data).
                            to({s:1},200).
                            onUpdate(function(data){
                                this.bonusScale=data.s;
                            }.bind(this)).
                            onComplete(function(data){
                            }.bind(this)).
                            easing(ig.Tween.Easing.Cubic.EaseInOut);
                scale.start();

                this.combo +=1;
                this.currentCombo +=1;

                if(this.currentCombo==1){
                    ig.game.playSfx("combo1");
                    this.score +=2;
                    this.bonusText=_STRINGS.Game.Combo+' +'+2;
                }else if(this.currentCombo==2){
                    ig.game.playSfx("combo2");
                    this.score +=4;
                    this.bonusText=_STRINGS.Game.Combo+' +'+4;
                }else if(this.currentCombo==3){
                    ig.game.playSfx("combo3");
                    this.score +=8;
                    this.bonusText=_STRINGS.Game.Combo+' +'+8;
                }else if(this.currentCombo==4){
                    ig.game.playSfx("combo4");
                    this.score +=16;
                    this.bonusText=_STRINGS.Game.Perfect+' +'+16;
                }else if(this.currentCombo>=5){
                    ig.game.playSfx("combo5");
                    this.score +=Math.pow(2,this.currentCombo);
                    this.bonusText=_STRINGS.Game.Perfect+' +'+(Math.pow(2,this.currentCombo));
                }

                if(this.maxCombo<this.currentCombo){
                    this.maxCombo = this.currentCombo;
                }

                clearTimeout(this.drawBonusStatus);

                this.drawBonusStatus=setTimeout(function(){
                                            this.bonusAlpha=0;
                                        }.bind(this),2000);
            },
            hslToRgb:function (h, s, l){
                var r, g, b;

                if(s == 0){
                    r = g = b = l; // achromatic
                }else{
                    function hue2rgb(p, q, t){
                        if(t < 0) t += 1;
                        if(t > 1) t -= 1;
                        if(t < 1/6) return p + (q - p) * 6 * t;
                        if(t < 1/2) return q;
                        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    }

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }

                return {r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255)};
            },
            draw: function(){
            	this.parent();
            	this.ctx = ig.system.context;
                this.ctx.clearRect(0, 0, ig.system.width, ig.system.height);

                if(this.gameOver){
                    if(ig.ua.mobile){
                        this.drawGameOverScoreMobile();                        
                    }else{
                        this.drawGameOverScore();
                    }
                }else{
                    if(ig.ua.mobile){
                        this.drawLiveScoreMobile();                    
                        if(this.bonusAlpha>0){
                            this.drawBonusMobile();
                        }                        
                    }else{
                        this.drawLiveScore();                    
                        if(this.bonusAlpha>0){
                            this.drawBonus();
                        }                        
                    }

                }

            },            
            drawGameOverScore:function(){

                this.ctx.save();
                var anchor = ig.responsive.toAnchor(0, -490, "center-middle");
                this.ctx.fillStyle = '#101010';
                this.ctx.globalAlpha = 0.5;
                ig.game.roundRect(this.ctx, anchor.x-250, anchor.y-200, 500, 370, 40, true, false);
                this.ctx.restore();

                this.ctx.save();
                this.ctx.globalAlpha=this.scoreAlpha;
                this.ctx.textAlign = "center";
                var anchor = ig.responsive.toAnchor(0, -450, "center-middle");
                this.ctx.font = "50px typo";
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText(_STRINGS.Game.MaxCombo+' '+this.maxCombo,anchor.x, anchor.y-160);         
                this.ctx.font = "180px typo";
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText(this.score,anchor.x, anchor.y);         
                this.ctx.font = "60px typo";
                this.ctx.fillText(_STRINGS.Game.BestScore+' '+this.bestScore,anchor.x, anchor.y+90);         
                this.ctx.restore();
            },
            drawGameOverScoreMobile:function(){

                this.ctx.save();
                var anchor = ig.responsive.toAnchor(0, 460, "center-top");
                this.ctx.fillStyle = '#101010';
                this.ctx.globalAlpha = 0.5;
                ig.game.roundRect(this.ctx, anchor.x-420, anchor.y-340, 840, 640, 40, true, false);
                this.ctx.restore();

                this.ctx.save();
                this.ctx.globalAlpha=this.scoreAlpha;
                this.ctx.textAlign = "center";
                var anchor = ig.responsive.toAnchor(0, 500, "center-top");
                this.ctx.font = "90px typo";
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText(_STRINGS.Game.MaxCombo+' '+this.maxCombo,anchor.x, anchor.y-260);         
                this.ctx.font = "220px typo";
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText(this.score,anchor.x, anchor.y);         
                this.ctx.font = "100px typo";
                this.ctx.fillText(_STRINGS.Game.BestScore+' '+this.bestScore,anchor.x, anchor.y+190);         
                this.ctx.restore();
            },
            drawLiveScore:function(){
                this.ctx.save();
                this.ctx.globalAlpha=this.scoreLiveAlpha;
                this.ctx.font = "180px typo";
                this.ctx.fillStyle = '#ffffff';
                this.ctx.textAlign = "center";
                var anchor = ig.responsive.toAnchor(0, 260, "center-top");
                this.ctx.fillText(this.score,anchor.x, anchor.y);         
                this.ctx.restore();
            },
            drawBonus:function(){
                this.ctx.save();
                this.ctx.globalAlpha=this.bonusAlpha;
                this.ctx.font = (60*this.bonusScale)+"px typo";
                this.ctx.fillStyle = '#ffffff';
                this.ctx.textAlign = "center";
                var anchor = ig.responsive.toAnchor(0, 350, "center-top");
                this.ctx.fillText(this.bonusText,anchor.x, anchor.y);         
                this.ctx.restore();
            },
            drawLiveScoreMobile:function(){
                this.ctx.save();
                this.ctx.globalAlpha=this.scoreLiveAlpha;
                this.ctx.font = "220px typo";
                this.ctx.fillStyle = '#ffffff';
                this.ctx.textAlign = "center";
                var anchor = ig.responsive.toAnchor(0, 500, "center-top");
                this.ctx.fillText(this.score,anchor.x, anchor.y);         
                this.ctx.restore();
            },
            drawBonusMobile:function(){
                this.ctx.save();
                this.ctx.globalAlpha=this.bonusAlpha;
                this.ctx.font = (100*this.bonusScale)+"px typo";
                this.ctx.fillStyle = '#ffffff';
                this.ctx.textAlign = "center";
                var anchor = ig.responsive.toAnchor(0, 650, "center-top");
                this.ctx.fillText(this.bonusText,anchor.x, anchor.y);         
                this.ctx.restore();
            },
        });
    });