ig.module('game.entities.buttons.button-replay')
    .requires(
        'game.entities.buttons.button'
    )
    .defines(function () {
        EntityButtonReplay = EntityButton.extend({
            type:ig.Entity.TYPE.A,
            gravityFactor:0,
            size: new BABYLON.Vector2(220, 280),
            offsetY:0,
            bgImg: new ig.Image('media/graphics/sprites/replay.png'),
            init:function(x,y,settings){
                
                if(ig.ua.mobile){
                    this.size=new BABYLON.Vector2(440, 560);
                }else{
                    this.size=new BABYLON.Vector2(220, 280);
                }

                this.parent(x,y,settings);
                this.posx=this.pos.x-this.size.x/2;
                this.posy=this.pos.y-this.size.y/2;
                ig.game.sortEntitiesDeferred();
            },
            update:function(){
                this.parent();

                if(ig.input.pressed('SPACE')){
                    this.released();
                }

                this.pos.x=this.posx;
                this.pos.y=this.posy+this.offsetY;
            },
            draw:function(){
                this.parent();
                var ctx=ig.system.context;
                ctx.drawImage(
                    this.bgImg.data,
                    0,
                    0,
                    this.bgImg.width,
                    this.bgImg.height,
                    this.pos.x,
                    this.pos.y,
                    this.size.x,
                    this.size.y
                );

            },
            clicked:function(){
                this.offsetY = 5;
            },
            clicking:function(){
                this.offsetY = 5;

            },
            released:function(){
                this.offsetY = 0;
                ig.game.buttonSfx();
                this.control.goHome();
            },
            leave:function(){
                this.offsetY = 0;
            },
        });


    });