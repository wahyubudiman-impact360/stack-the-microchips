ig.module(
        'game.entities.objects.stars'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityStars = ig.Entity.extend({
            size:{x:14,y:14},
            size2:{x:14,y:14},
            scale:1,
            alpha:0.4,
            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.posx=this.pos.x-this.size.x/2;                
                this.posy=this.pos.y-this.size.y/2;     
                this.color=this.control.baseColor;

                if(ig.ua.mobile){
                    this.hightargetScale=2;
                    this.lowtargetScale=0.6;
                }else{
                    this.hightargetScale=1.2;
                    this.lowtargetScale=0.4;
                }

                this.startRoling();
            },
            startRoling:function(){
                var data={r:0};
                this.angle=0;
                this.rotate = new ig.TweenDef(data).
                            to({r:360},10000).
                            onUpdate(function(data){
                                this.angle=(data.r).toRad();
                            }.bind(this)).
                            onComplete(function(data){
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);
                this.rotate.start();

                var data={s:0.5,a:0.1};
                this.scale=0.6;
                this.scale1 = new ig.TweenDef(data).
                            to({s:this.hightargetScale,a:0.8},3000).
                            onUpdate(function(data){
                                this.scale=data.s;
                                this.alpha=data.a;
                            }.bind(this)).
                            onComplete(function(data){
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);

                this.scale2 = new ig.TweenDef(data).
                            to({s:this.hightargetScale,a:0.8},4000).
                            onUpdate(function(data){
                                this.scale=data.s;
                                this.alpha=data.a;
                            }.bind(this)).
                            onComplete(function(data){
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);

                this.scale3 = new ig.TweenDef(data).
                            to({s:this.lowtargetScale,a:0},3000).
                            onUpdate(function(data){
                                this.scale=data.s;
                                this.alpha=data.a;
                            }.bind(this)).
                            onComplete(function(data){
                                this.kill();
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);

                this.scale1.chain(this.scale2);
                this.scale2.chain(this.scale3);
                this.scale1.start();


                var data={y:this.posy};
                this.moveY = new ig.TweenDef(data).
                            to({y:this.posy-400},10000).
                            onUpdate(function(data){
                                this.posy=data.y;
                            }.bind(this)).
                            onComplete(function(data){
                            }.bind(this)).
                            easing(ig.Tween.Easing.Linear.EaseNone);
                this.moveY.start();

            },
            update: function(){
            	this.parent();
                this.pos.x=this.posx;                
                this.pos.y=this.posy;
                this.size2.x=this.size.x*this.scale;                
                this.size2.y=this.size.y*this.scale;
            },
           
            draw:function(){
                this.parent();
                var ctx=ig.system.context;
                ctx.save();
                ctx.translate(this.pos.x+this.size2.x/2, this.pos.y+this.size2.y/2);
                ctx.rotate(this.angle);
                ctx.translate(-this.pos.x-this.size2.x/2, -this.pos.y-this.size2.y/2);
                ctx.lineWidth=8;

                ctx.strokeStyle='rgba('+255+','+255+','+255+','+0.2+')';
                ctx.strokeRect(this.pos.x-(0.6*this.size2.x),this.pos.y-(0.6*this.size2.y),this.size2.x+(1.2*this.size2.x),this.size2.y+(1.2*this.size2.y));

                var r=Math.floor(this.color.r*255)+70;
                var g=Math.floor(this.color.g*255)+70;
                var b=Math.floor(this.color.b*255)+70;

                ctx.fillStyle='rgba('+r+','+g+','+b+','+(this.alpha)+')';
                ctx.fillRect(this.pos.x-(0.3*this.size2.x),this.pos.y-(0.3*this.size2.y),this.size2.x+(0.6*this.size2.x),this.size2.y+(0.6*this.size2.y));

                ctx.fillStyle='rgba('+r+','+g+','+b+','+(this.alpha+0.2)+')';
                ctx.fillRect(this.pos.x,this.pos.y,this.size2.x,this.size2.y);

                ctx.restore();
            },
        });
    });