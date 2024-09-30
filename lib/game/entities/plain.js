/**
 *  plain
 *
 *  Created by SalteMishel on 2015-04-20.
 *  Copyright (c) 2014 __MyCompanyName__. All rights reserved.
 */

ig.module('game.entities.plain')
.requires(
    'impact.entity'
    )
.defines(function() {
        EntityPlain = ig.Entity.extend({
            sc:{x:1,y:1},
            sheetX:1,
            sheetY:1,
            gravityFactor: 0,
            clearColor:null,
            tweening: false,
            which: 0,
            size: {x:50, y:50},
            halfSize: {x:50, y:50},
            oriPos: {x:0, y:0},
            ctxRef:null,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                if (!ig.global.wm) {
                    this.ctx=ig.system.context;
                 }
            },
            sounder: function(targ) {
                try{
					ig.soundHandler.sfxPlayer.play(targ);
    			}catch(e){
                    console.log(e);
                }
            },
            setIdle: function() {
                this.animSheet=new ig.AnimationSheet(this.im.path,this.im.width/this.sheetX,this.im.height/this.sheetY);
                this.addAnim('idle', 0.03, [0], true);
			    this.currentAnim = this.anims.idle;
            },
            abCheck: function(targ) {
                var pointer=ig.game.getEntitiesByType(EntityPointer)[0];
                if(pointer.pos.x>targ.pos.x &&
                   pointer.pos.y>targ.pos.y &&
                   pointer.pos.x<targ.pos.x+targ.size.x &&
                   pointer.pos.y<targ.pos.y+targ.size.y
                  ){
                    return true;
                }else{
                    return false;
                }
            },
            setSize: function() {
                this.size.x=this.im.width/this.sheetX;
                this.size.y=this.im.height/this.sheetY;
            },
            setSheet: function() {
                this.size.x=this.im.width/this.sheetX;
                this.size.y=this.im.height/this.sheetY;
                this.animSheet=new ig.AnimationSheet(this.im.path,this.size.x,this.size.y);
            },
            getDistance: function(targ, other ) {
                var xd = (targ.x) - (other.x);
                var yd = (targ.y) - (other.y);
                return Math.sqrt( xd*xd + yd*yd );
            },
            getPos: function(targ){
                console.log(this.pointer.pos.x,this.pointer.pos.y);
            },
            posXY: function(targ){
                targ.pos.x=this.pointer.pos.x;
                targ.pos.y=this.pointer.pos.y;
                console.log(this.pos.x,this.pos.y);
            },
            resetFrame: function(targ) {
                this[targ].ended=false;
                this[targ].frame=0;
            },
            runAnim: function(targ) {
                if(this[targ]==undefined){
                    this[targ]={};
                }
                this[targ].ended=this[targ].ended || false;
                this[targ].loop=this[targ].loop || false;
                this[targ].frame=this[targ].frame || 0;
                this[targ].frameTimer=this[targ].frameTimer|| new ig.Timer();
                this[targ].frameTime=this[targ].frameTime|| 0.03;

                if(this[targ].ended==true) return;

                if(this[targ].loop==false && this[targ].frame==this[targ].frames.length-1){
                    this[targ].ended=true;
                    if(this.done){
                         this.done(targ);
                    }
                    return;
                }

                if(this[targ].frames.length>1){
                    if(this[targ].frameTimer.delta()>this[targ].frameTime){
                        this[targ].frameTimer.reset();
                        this[targ].frame= (this[targ].frame+1)%this[targ].frames.length;
                    }
                }
            },

            tweener: function(o,p,t,f,d) {
                var obj={};
                obj[o]=p;
                if(d==null){
                    d=0;
                }
                if(f==null){
                    f="none";
                }

                this.tween(o=="this"?p:obj, t, {delay:d,targ:o,seq:f,
                    onComplete: function() {
                          if(f!=null){
                              this.tweenF(f,o);
                          }
                    }.bind(this),
                    easing: ig.Tween.Easing.Quadratic.EaseOut
                }).start();
            },

            tweener2: function(o,p,t,f,d) {
                var obj={};
                obj[o]=p;
                if(d==null){
                    d=0;
                }
                if(f==null){
                    f="none";
                }

                this.tween(o=="this"?p:obj, t, {delay:d,targ:o,seq:f,
                    onComplete: function() {
                          if(f!=null){
                              this.tweenF(f,o);
                          }
                    }.bind(this),
                    easing: ig.Tween.Easing.Linear.EaseNone
                }).start();
            },

            tweener3: function(o,p,t,f,d) {
                var obj={};
                obj[o]=p;
                if(d==null){
                    d=0;
                }
                if(f==null){
                    f="none";
                }

                this.tween(o=="this"?p:obj, t, {delay:d,targ:o,seq:f,
                    onComplete: function() {
                          if(f!=null){
                            this.tweenF(f,o);
                          }
                    }.bind(this),
                    easing: ig.Tween.Easing.Elastic.EaseIn
                }).start();
            },

            sizer: function(pic,tframeX,tframeY,dx,dy,cent,gapX,gapY) {

                gapX=gapX || 0;
                gapY=gapY || 0;
                this.size.x=(pic.width/ tframeX*this.base.oriSc)+gapX;
                this.size.y=(pic.height/ tframeY*this.base.oriSc)+gapY;

                if(cent==true){
                    this.pos.x=dx-(this.size.x/2);
                    this.pos.y=dy-(this.size.y/2);
                }else{
                    this.pos.x=dx;
                    this.pos.y=dy;
                }

            },


            ctxDrawer: function(targ) {

                var ctx = targ.ctx || ig.system.context;
                var offX = targ.offX || 0;
                var offY = targ.offY || 0;
                var cent = targ.cent || false;


                if(targ.scX == null) {
                   var scX = 1;
                } else {
                    var scX = targ.scX;
                }

                if(targ.scY == null) {
                    var scY = 1;
                } else {
                    var scY = targ.scY;
                }

                if(targ.alp == null && targ.alp!=0) {
                    var alp = 1;
                } else {
                    var alp = targ.alp;
                }

                if(targ.rot == null) {
                    var rot = 0;
                } else {
                    var rot = targ.rot;
                }


                var frameX = targ.frameX || 1;
                var frameY = targ.frameY || 1;
                var frame = targ.frame || 0;


                var sx = targ.sx;
                var sy = targ.sy;
                var sw = targ.sw;
                var sh = targ.sh;
                var dw = sw*scX;
                var dh = sh*scY;


                if(alp<=0) return;
                if( rot > 0 || scX<0 ||  scY<0) {
                    var dx = targ.x;
                    var dy = targ.y;

                    var offX = cent ? -sw / 2 + offX : offX || 0;
                    var offY = cent ? -sh / 2 + offY : offY || 0;
                    if(sw > 0 && sh > 0) {
                        ctx.save();
                        ctx.translate(dx, dy);
                        ctx.scale(scX, scY);
                        var ang = ((2 * Math.PI) / 360) * rot;
                        ctx.rotate(ang);
                        ctx.globalAlpha = alp;
                        ctx.drawImage(targ.pic, sx, sy, sw, sh, offX, offY, sw, sh);
                        ctx.restore();
                    }
                }else{
                    dx = cent ? targ.x - dw / 2 + offX : targ.x + offX;
                    dy = cent ? targ.y - dh / 2 + offY : targ.y + offY;

                    if(sw > 0 && sh > 0) {
                        ctx.globalAlpha = alp;
                        ctx.drawImage(targ.pic, sx, sy, sw, sh, dx, dy, dw, dh);
                        ctx.globalAlpha = 1;
                    }
                }




            },

            frameDrawer: function(targ) {

                var frame=targ.frame;

                var ctx = targ.ctx || ig.system.context;
                var offX = targ.offX || 0;
                var offY = targ.offY || 0;
                var cent = targ.cent || false;


                if(targ.scX == null) {
                    var scX = 1;
                } else {
                    var scX = targ.scX;
                }

                if(targ.scY == null) {
                    var scY = 1;
                } else {
                    var scY = targ.scY;
                }

                if(targ.alp == null && targ.alp!=0) {
                    var alp = 1;
                } else {
                    var alp = targ.alp;
                }

                if(targ.rot == null) {
                    var rot = 0;
                } else {
                    var rot = targ.rot;
                }


                var frameX = targ.frameX || 1;
                var frameY = targ.frameY || 1;
                var frame = targ.frame || 0;

                var sx = targ.frame.x;
                var sy = targ.frame.y;
                var sw = targ.frame.w;
                var sh = targ.frame.h;
                var dw = sw*scX;
                var dh = sh*scY;


                if(alp<=0) return;
                if( rot > 0 || scX<0 ||  scY<0) {
                    var dx = targ.x;
                    var dy = targ.y;

                    var offX = cent ? -sw / 2 + offX : offX || 0;
                    var offY = cent ? -sh / 2 + offY : offY || 0;
                    if(sw > 0 && sh > 0) {
                        ctx.save();
                        ctx.translate(dx, dy);
                        ctx.scale(scX, scY);
                        var ang = ((2 * Math.PI) / 360) * rot;
                        ctx.rotate(ang);
                        ctx.globalAlpha = alp;
                        ctx.drawImage(targ.pic, sx, sy, sw, sh, offX, offY, sw, sh);
                        ctx.restore();
                    }
                }else{
                    dx = cent ? targ.x - dw / 2 + offX : targ.x + offX;
                    dy = cent ? targ.y - dh / 2 + offY : targ.y + offY;

                    if(sw > 0 && sh > 0) {
                        ctx.globalAlpha = alp;
                        ctx.drawImage(targ.pic, sx, sy, sw, sh, dx, dy, dw, dh);
                        ctx.globalAlpha = 1;
                    }
                }
            },


            quickDraw: function(targ) {

                if(this[targ].animate==true && this.main.gamePaused==false){
                    this.runAnim(targ); 
                }

                this.drawer({
                            pic:this[targ].im,
                            x:this[targ].x,
                            y:this[targ].y,
                            frameX:this[targ].frameX,
                            frameY:this[targ].frameY,
                            frame:this.checkFrame(targ)==false?0:this[targ].frames[this[targ].frame],
                            cent:this[targ].cent,
                            rot:this[targ].rot==undefined?this.rot:this[targ].rot,
                            offX:this[targ].off.x,
                            offY:this[targ].off.y,
                            scX:this.scX*this[targ].scX,
                            scY:this.scY*this[targ].scY});
            },

            drawer: function(targ) {

                if(targ.alp == null && targ.alp!=0) {
                    var alp = 1;
                } else {
                    var alp = targ.alp;
                }

                if(targ.scX == null) {
                   var scX = 1;
                } else {
                   var scX = targ.scX;
                }

                if(targ.scY == null) {
                    var scY = 1;
                } else {
                    var scY = targ.scY;
                }


                if(alp==0 || scX==0 || scY==0)return;

                var ctx = targ.ctx || ig.system.context;
                var offX = targ.offX || 0;
                var offY = targ.offY || 0;
                var cent = targ.cent || false;

                if(targ.rot == null) {
                    var rot = 0;
                } else {
                    var rot = targ.rot;
                }

                var frameX = targ.frameX || 1;
                var frameY = targ.frameY || 1;
                var frame = targ.frame || 0;

                var sx = targ.pic.width /  frameX * ( frame %  frameX);
                var sy = targ.pic.height /  frameY * Math.floor( frame /  frameX);
                var sw = targ.pic.width /  frameX;
                var sh = targ.pic.height /  frameY;
                var dw = targ.pic.width /  frameX *  scX;
                var dh = targ.pic.height /  frameY *  scY;


                if(alp<=0) return;

                var dx = cent ? targ.x - dw / 2 + offX : targ.x + offX;
                var dy = cent ? targ.y - dh / 2 + offY : targ.y + offY;

                if(sw > 0 && sh > 0) {
                    ctx.save();
                    ctx.translate(dx, dy);
                    ctx.scale(scX, scY);

                    if(targ.rad){
                        var ang =targ.rad;
                    }else{
                        var ang = ((2 * Math.PI) / 360) * rot;
                    }

                    ctx.rotate(ang);
                    ctx.globalAlpha = alp;
                    ctx.drawImage(targ.pic.data, sx, sy, sw, sh, offX, offY, sw, sh);
                    ctx.restore();
                }
            },

            textSet: function(pix, col,font,ctx) {
                var ctx =ctx || ig.system.context;
                var font=font||"patriot";
                this.ctxRef=ctx;
                ctx.font = pix + "px "+font;
                ctx.fillStyle = col;
            },

            textW: function(targ){
                return this.ctxRef.measureText(targ).width;
            },
            textMax: function(targ){
                this.textSet(targ.px,"white");
                if(this.textW(targ.tx)>targ.maxWidth){
                    return (targ.maxWidth)/this.textW(targ.tx);
                }else{
                    return 1;
                }
            },

            textDraw: function(targ) {

                var rot=targ.rot?targ.rot:0,
                    tx=targ.tx?targ.tx:0,
                    dx=targ.x?targ.x:0,
                    dy=targ.y?targ.y:0,
                    scX=targ.scX==undefined?1:targ.scX,
                    scY=targ.scY==undefined?1:targ.scY,
                    textScX=targ.scX==undefined?1:targ.scX,
                    textScY=targ.scY==undefined?1:targ.scY,
                    stroke=targ.stroke?targ.stroke:false,
                    strokeAlp=targ.strokeAlp==undefined?1:targ.strokeAlp,
                    strokeColour=targ.strokeColour?targ.strokeColour:"black",
                    alp=targ.alp==undefined?1:targ.alp,
                    col=targ.col?targ.col:this.ctx.fillStyle,
                    font=targ.font||"typo",
                    px=targ.px||10,
                    strokeLine=targ.strokeLine||3,
                    align=targ.align|| "center";

                if(alp==0)return;

                var ctx =targ.ctx || ig.system.context;
                this.ctxRef=targ.ctx || ig.system.context;
                ctx.font = px + "px "+font;

                if(targ.maxWidth!=undefined){
                    if(this.textW(tx)>targ.maxWidth){
                        px=Math.floor(targ.maxWidth/this.textW(tx)*px);
                        ctx.font = px + "px "+font;
                    }
                }

                if(align=="left"){
                    dx+=this.textW(tx)*0.5*textScX;
                }else if(align=="right"){
                    dx-=this.textW(tx)*0.5*textScX;
                }

                ctx.save();
                var fontH = ctx.measureText('M').width*textScY;
                ctx.translate(dx,dy+fontH/2);
                ctx.scale(textScX,textScY);
                var ang = rot?((2 * Math.PI) / 360) * rot:0;
                ctx.rotate(ang);
                ctx.fillStyle = col;

                if(stroke==true){

                    ctx.globalAlpha=strokeAlp;
                    ctx.lineWidth=strokeLine;
                    ctx.lineCap="round";
                    ctx.strokeStyle=strokeColour;
                    ctx.strokeText(tx,-this.textW(tx)/2,0);
                }


                ctx.globalAlpha=alp;
                ctx.fillText(tx,-this.textW(tx)/2,0);
                ctx.restore();

            },

            checkStorage:function(){
                try
                {
                    localStorage.setItem("test", "test");
                    localStorage.removeItem("test");
                    return 'localStorage' in window && window['localStorage'] !== null;
                }catch(e){
                    return false;
                }
            },
            //http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
            shuffleArray: function(array) {
                var counter = array.length,
                    temp, index;
                // While there are elements in the array
                while (counter > 0) {
                    // Pick a random index
                    index = Math.floor(Math.random() * counter);
                    // Decrease counter by 1
                    counter--;
                    // And swap the last element with it
                    temp = array[counter];
                    array[counter] = array[index];
                    array[index] = temp;
                }
                return array;
            },



        });

    });
