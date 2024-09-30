ig.module('game.entities.buttons.button-mute')
    .requires(
        'game.entities.buttons.button'
    )
    .defines(function () {

        EntityButtonMute = EntityButton.extend({
            type:ig.Entity.TYPE.A,
            gravityFactor:0,
            size: new BABYLON.Vector2(120, 120),
            value:null,
            caption:'',
            offsetY:0,
            bgcolor:'#0033cc',
            fontcolor:'#ffffff',
            icon1:new ig.Image('media/graphics/sprites/btn-volume-on.png'),
            icon2:new ig.Image('media/graphics/sprites/btn-volume-off.png'),
            currentActive:0,
            init:function(x,y,settings){

                if(ig.ua.mobile){
                    this.size=new BABYLON.Vector2(200, 200);
                }else{
                    this.size=new BABYLON.Vector2(120, 120);
                }

                this.parent(x,y,settings);
                this.posx=this.pos.x-this.size.x/2;
                this.posy=this.pos.y-this.size.y/2;
                ig.game.sortEntitiesDeferred();
                this.setData();

            },
            setData:function(){
                this.music=ig.game.load('music');
                this.sound=ig.game.load('sound');                
                ig.soundHandler.bgmPlayer.volume(this.music);
                ig.soundHandler.sfxPlayer.volume(this.sound);

                if(this.music==1 || this.sound==1){
                    this.currentActive=0;
                }else{
                    this.currentActive=1;
                }

            },
            update:function(){
                this.parent();
                if(!this.control.uiStatus) return;

                this.pos.x=this.posx;
                this.pos.y=this.posy+this.offsetY;
            },
            draw:function(){
                this.parent();
                var ctx=ig.system.context;
                if(!this.control.uiStatus) return;

                if(this.currentActive==0){
                    ctx.save();
                    ctx.drawImage(
                        this.icon1.data,
                        0,
                        0,
                        this.icon1.width,
                        this.icon1.height,
                        this.pos.x,
                        this.pos.y,
                        this.size.x*1,
                        this.size.y*1
                    );
                    ctx.restore();
                }else{
                    ctx.save();
                    ctx.drawImage(
                        this.icon2.data,
                        0,
                        0,
                        this.icon2.width,
                        this.icon2.height,
                        this.pos.x,
                        this.pos.y,
                        this.size.x*1.05,
                        this.size.y
                    );
                    ctx.restore();
                }


            },
            clicked:function(){
                if(!this.control.uiStatus) return;
                if(ig.game.pausedStatus) return;
                this.offsetY = 5;
            },
            clicking:function(){
                if(!this.control.uiStatus) return;
                if(ig.game.pausedStatus) return;
                this.offsetY = 5;

            },
            released:function(){
                this.offsetY = 0;
                if(!this.control.uiStatus) return;
                if(this.currentActive==0){

                    ig.game.save('music',0);
                    ig.game.save('sound',0);                
                    this.setData();

                    this.currentActive=1;
                }else{

                    ig.game.save('music',1);
                    ig.game.save('sound',1);                
                    this.setData();

                    this.currentActive=0;
                }
                ig.game.buttonSfx();

            
            },
            leave:function(){
                this.offsetY = 0;
            },
        });

    });