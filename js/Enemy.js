var EPSILON = 2;
function Enemy(type, HP, speed, roadX,roadY, remainingLength){
	var maxhp = HP;	
	this.hp = maxhp;
	
	this.left = roadX[0] - HALF_UNIT_SIZE;
	this.top = roadY[0] - HALF_UNIT_SIZE;	
	this.cx = roadX[0];
	this.cy = roadY[0];	
	this.right = this.left + UNIT_SIZE;
	this.bottom = this.top + UNIT_SIZE;
	this.width = UNIT_SIZE;
	this.height = UNIT_SIZE;
	this.remainingLength = remainingLength;
	
	var speed = 1 * speed;
	var speedX = 0;
	var speedY = 0;	
	var temp_speedX, temp_speedY;
	
	var currentPoint = 0;
	
	this.onReachedGoal; 
	this.isDisposed = false;
	this.isDead = false;
	
	this.rotation = 0;
	this.effect;
	var timeTakeEffect;
	var lastEffect = 0;
	var effectDelay = 500;
	var effectLength = 5000;
	
	// Animated Sprite	
	this.init({
		image: _images.enemies,
		frameWidth: 32,
		frameHeight: 32,
		interval: 200		
	});
	
	this.addSprite({			
			startFrame: type * 3,
			framesCount: 3,
			marginTop: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0		
		});	
		
	var self = this;
		
	function calcDirection(preX, preY){
		
		var dx = roadX[currentPoint] - preX;
		var dy = roadY[currentPoint] - preY;
		
		var angle = Math.atan2(dy, dx);
		speedX = Math.cos(angle) * speed;
		speedY = Math.sin(angle) * speed;	
		
		temp_speedX = speedX;
		temp_speedY = speedY;
		self.rotation = angle - Math.PI / 2;
		
		self.setEffect(self.effect);
	};
	this.setEffect = function(effect){
		
		if(this.effect != effect)
		{
			this.effect = effect;
			timeTakeEffect= (new Date()).getTime();						
		}
		if(this.effect == Effects.FREEZE)
		{
			speedX = temp_speedX * 0.6;
			speedY = temp_speedY * 0.6;
		}
		
	};
	this.draw = function(context){
		/*
		context.fillStyle = "brown";
		context.fillRect(this.left, this.top, UNIT_SIZE, UNIT_SIZE);
		*/
		
		if(this.effect == Effects.POISON)
			context.fillStyle = "green";
		else if(this.effect == Effects.FREEZE)
			context.fillStyle = "blue";
		else
			context.fillStyle = "red";
		context.fillRect(this.left,this.top - 5, UNIT_SIZE * this.hp / maxhp, 3);
		
				
		AnimatedSprite.prototype.draw.call(this,context,this.rotation);		
	};
	this.update = function(){	
				
		if(this.effect && this.effect != Effects.NONE)
		{
			var tick = (new Date()).getTime();
			if(tick - lastEffect >= effectDelay)
			{
			
				lastEffect = tick;				
				switch(this.effect)
				{
					case Effects.POISON:
						this.hp -= 25; break;					
					default:
						break;
				}					
			
			}
			if(tick - timeTakeEffect >= effectLength)
			{
				this.effect = null;	
				speedX	= temp_speedX;
				speedY = temp_speedY;
			}
			
		}
		if(this.hp <= 0)
		{
			this.hp = 0;
			this.isDisposed = true;
			this.isDead = true;
		}
		else
		{
			var x = roadX[currentPoint];
			var y = roadY[currentPoint];				
			
			var dx = Math.abs(this.cx - x);
			var dy = Math.abs(this.cy - y);
			
			// reached new point
			if(dx < EPSILON && dy < EPSILON)
			{		
				if(currentPoint < roadX.length - 1)
				{
					currentPoint++;
					calcDirection(this.cx, this.cy);
				}
				else // reached last point
				{
					this.isDisposed = true;
					if(this.onReachedGoal)
						this.onReachedGoal();
				}
			}
					
			this.left += speedX;
			this.top += speedY;
			
			this.cx = this.left + HALF_UNIT_SIZE;
			this.cy = this.top + HALF_UNIT_SIZE;
			
			this.right = this.left + UNIT_SIZE;
			this.bottom = this.top + UNIT_SIZE;
			
			this.remainingLength -= speed;
		}
		AnimatedSprite.prototype.update.call(this);		
	};
	
	this.contain = function(x, y){
		return this.left <= x && this.top <= y &&
				this.right >= x && this.bottom >=y;
			
	};

}
Enemy.prototype = new AnimatedSprite();