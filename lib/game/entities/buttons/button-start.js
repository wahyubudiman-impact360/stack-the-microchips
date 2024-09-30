ig.module('game.entities.buttons.button-start')
    .requires(
        'game.entities.buttons.button'
    )
    .defines(function () {
        EntityButtonStart = EntityButton.extend({
            type:ig.Entity.TYPE.A,
            gravityFactor:0,
            size: new BABYLON.Vector2(250, 330),
            value:null,
            caption:'',
            offsetY:0,
            bgcolor:'#00cc44',
            fontcolor:'#ffffff',
            icon:new ig.Image('media/graphics/sprites/play.png'),
            init:function(x,y,settings){

                if(ig.ua.mobile){
                    this.size=new BABYLON.Vector2(500, 660);
                }else{
                    this.size=new BABYLON.Vector2(250, 330);
                }

                this.parent(x,y,settings);
                this.posx=this.pos.x-this.size.x/2;
                this.posy=this.pos.y-this.size.y/2;
            },
            update:function(){
                this.parent();
                if(!this.control.uiStatus) return;
                this.pos.x=this.posx;
                this.pos.y=this.posy+this.offsetY;
                if(ig.input.pressed('SPACE')){
                    this.released();
                }

            },
            draw:function(){
                this.parent();

                if(!this.control.uiStatus) return;

                var ctx=ig.system.context;                
                ctx.save();
                ctx.drawImage(
                    this.icon.data,
                    0,
                    0,
                    this.icon.width,
                    this.icon.height,
                    this.pos.x,
                    this.pos.y,
                    this.size.x,
                    this.size.y
                );
                ctx.restore();

            },
            clicked:function(){
                this.offsetY = 5;
            },
            clicking:function(){
                this.offsetY = 5;

            },
            released:function(){
                if(!this.control.uiStatus) return;
                if(ig.game.pausedStatus) return;
                this.offsetY = 0;
                ig.game.buttonSfx();
                this.control.startGameplay();
            },
            leave:function(){
                this.offsetY = 0;
            },
        });


    });