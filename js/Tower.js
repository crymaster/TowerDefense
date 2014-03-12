var ONE_RAD = Math.PI / 180;
var ANGLE_EPSILON = ONE_RAD * 30;

function Tower(sprite,left,top){	
		
	this.setPosition = function(x, y){
		this.left = x;
		this.top = y;
		
		this.cx = this.left + HALF_UNIT_SIZE;
		this.cy = this.top + HALF_UNIT_SIZE;
		
		this.right = this.left + UNIT_SIZE;
		this.bottom = this.top + UNIT_SIZE;
	};
	this.level = 1;
	this.setPosition(left,top);
	this.color;
	
	this.shootingRange = 100;
	// has value true if this tower has been placed on the map
	this.isPlaced = false;
	this.damage = 100;
	
	this.angle = 0;
	this.rotationSpeed = ONE_RAD;
	this.fireDelay = 400; // fire rate
	this.effect;
	
	this.bullets = [];
	this.lastFired = 0;
	this.sprite = sprite;
}


Tower.prototype.upgrade = function(){
	if(this.level == 20)
		return false;
		
	this.upgradePrice = Math.floor(this.upgradePrice * 1.3);
	this.level++;
	this.damage += Math.floor(this.damage/10);
	return true;
};
Tower.prototype.fire = function(){       

	var directionX = Math.cos(this.angle);
	var directionY = Math.sin(this.angle);
	
	var startX = this.cx + UNIT_SIZE * directionX;
	var startY = this.cy + UNIT_SIZE * directionY;

	var b = new Bullet(this.shootingRange,startX,startY,directionX,directionY,this.effect);
	this.bullets.push(b);		
}
Tower.prototype.draw = function(context){
	/*
	context.beginPath();
	context.arc(this.cx, this.cy, HALF_UNIT_SIZE, 0 , 2 * Math.PI, false);
	context.fillStyle = this.color;
	context.fill();	
	*/
	// draw this.bullets 
	for(var x in this.bullets)
	{
		this.bullets[x].draw(context);
	}
	
	context.save();
	 // translate context to center of tower
	context.translate(this.cx,this.cy);
	
	context.rotate(this.angle + Math.PI/2);
	
	// draw the tower's gun
	/*
	context.fillStyle = "orange";
	context.fillRect(HALF_UNIT_SIZE, -2, HALF_UNIT_SIZE, 4);
	*/
	//console.log(this.images);
	this.sprite.draw(context, -HALF_UNIT_SIZE, -HALF_UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
	context.restore();
	if(this.isPlaced)
		context.fillText(this.level, this.left, this.top);
};
Tower.prototype.contain = function(x, y){
	return this.left <= x && this.right >= x && this.top <= y && this.bottom >= y;
};
Tower.prototype.update = function(enemies){
	
	var targetAngle;				
	
	var target;
	// find the nearest enemy within range		
	var	minLength;
	for(var x in enemies)
	{
		var e = enemies[x];
		var dx = e.cx - this.cx;
		var dy = e.cy - this.cy;
		var distance = Math.sqrt(dx * dx + dy * dy);
		
		if(distance <= this.shootingRange)
		{
			if(!minLength || e.remainingLength < minLength)
			{				
				minLength = e.remainingLength;
				targetAngle = Math.atan2(dy, dx);	
				target	= e;						
			}
		}
	}
	
	// found an enemy		
	if(target)
	{			
		var rotation = 0;
		// targetAngle and current angle have the same sign
		if(targetAngle * this.angle >= 0)
			rotation = targetAngle > this.angle ? this.rotationSpeed: -this.rotationSpeed;
		else{
		
			var diff = Math.abs(targetAngle - this.angle);
							
			rotation = diff >= Math.PI ? -this.rotationSpeed : this.rotationSpeed;				
				
			if(targetAngle < 0)
				rotation = -rotation;
		}
		
		// rotate the gun			
		this.angle += rotation;
		// keep the angle small
		if(Math.abs(this.angle) > Math.PI)
			this.angle += this.angle > 0 ? -2*Math.PI : 2*Math.PI;			
		
		// fire
		if(Math.abs(this.angle - targetAngle) < ANGLE_EPSILON)
		{
			
			// fire the enemy
			var newtick = (new Date()).getTime();
			if(newtick - this.lastFired >= this.fireDelay)
			{

				this.fire();
				this.lastFired = newtick;
				
			}
		}	
	}
	
	// update this.bullets
	var i = 0;
	var length = this.bullets.length;
	
	while(i < length)
	{		
		if(this.bullets[i].isDisposed)
		{
			this.bullets.splice(i,1);				
			length--;
		}else
		{			
			this.bullets[i].collide(this.damage, enemies);
			this.bullets[i++].update();			
		}
	}
};	
