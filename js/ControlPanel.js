var COUNTDOWN_SECS = 20;
var COLORS = ["Wheat", "Green", "Blue", "Indigo"];
var TOWER_TYPES = ["BASIC","POISON","FREEZE"];
var BTN_HIGHLIGHT_TIME = 200;
function ControlPanel(left, top, width, height, map){	
	this.map = map;	
	
	_selectedCategory = 0;
	
	this.towerButtons = [];
	this.actionButtons = [];
	
	this.selectedItem = null;
	_selectedActionButton = null;
	
	this.left = left || 0;
	this.top = top || 0;	
	this.width = width;
	this.height = height;
	
	this.countDownSeconds = COUNTDOWN_SECS;
	
	var reset = function(){
		self.countDownSeconds = COUNTDOWN_SECS;	
	};
	var self = this;
	
	// add tower types button
	for(var i = 0;i < 3; i++)
	{		
		this.addItem(65 * i + 7, 180, 55, 45, COLORS[i], COLORS[i]);		
	}	
	
	// add tower category select button	
	
	this.addItem(5, 135, 40, 35, "gray", "Back", function(){		
		_selectedCategory = (_selectedCategory+2) % 3;	
		map.selectedTower = null;		
	});
	
	this.addItem(this.width - 45, 135, 40, 35, "gray", "Next", function(){		
		_selectedCategory = (_selectedCategory+1) % 3;	
		map.selectedTower = null;		
	});
	
	// action buttons
	this.map.onFinishedWave = function(){
		
		reset();		
	};
	this.map.onFinishedLevel = function(){
	
		reset();		
	};
	this.map.onReset = function(){	
	
		reset();		
	};
	
	var width =  85;
	// upgrade button
	this.addItem(10, 360, width, 35, "gray", "Upgrade", function(){
		if(map.selectedTower && map.selectedTower.isPlaced && map.money >= map.selectedTower.upgradePrice)
		{
			var price = map.selectedTower.upgradePrice
			if(map.selectedTower.upgrade())
				map.money -= price;
			
		}
	});
	
	// sell button
	this.addItem(105, 360, width, 35, "gray", "Sell", function(){
		alert("Not yet implemented!");
	});
	
	// next wave button
	this.addItem(5, 5, width + 40, 35, "gray", "Next Wave", function(){
		// alert("Not yet implemented!");
		if(self.countDownSeconds > 0)
		{
			self.countDownSeconds = 0;
			self.map.nextWave();
		}
	});	
	
	// Option button
	this.addItem(135, 5, width - 30, 35, "gray", "Option", function(){		
		alert("Not yet implemented!");
	});	
	
	// Restart button
	this.addItem(105, 315, width, 35, "gray", "Restart", function(){
		confirm("Do you really want to restart ?");
		self.countDownSeconds = COUNTDOWN_SECS;	
		reset();
		self.map.reset(true);
	});	
	
	// Undo button
	this.addItem(10, 315, width, 35, "gray", "Undo", function(){
		alert("Not yet implemented!");
	});
	
	this.updateDelay = 1000;
	this.lastUpdate = 0;
}
ControlPanel.prototype.update = function() {
	if(this.countDownSeconds == 0)
		return;
	var tick = (new Date()).getTime();
	if(tick - this.lastUpdate >= this.updateDelay)
	{
		this.lastUpdate = tick;
		this.countDownSeconds --;
		if(this.countDownSeconds == 0)
			this.map.nextWave();
	}
};
ControlPanel.prototype.draw = function(context) {
	
    context.drawImage(_images.metalplate,this.left,this.top,this.width,this.height);
	context.drawImage(_images.sunken_plate,this.left+50,this.top+135,this.width-100,35);
	
	context.drawImage(_images.sunken_plate,this.left+5,this.top+230,this.width-10,80);
	
	//context.fillRect(this.left + 50, this.top + 135, this.width - 100, 35);
	context.fillStyle = "black";
	context.font = "bold 13px Arial";
	context.fillText(TOWER_TYPES[_selectedCategory], this.left + 75, this.top + 155);
	
	for (var i = this.towerButtons.length-1; i>=0; i--) {
		var button = this.towerButtons[i];
		/*context.fillStyle = button.color;
		context.fillRect(button.x, button.y, button.width, button.height);
		*/
		var sprite = _sprites.sprites["tower"+(i+_selectedCategory*3)];
		
		sprite.draw(context, button.x, button.y, button.width, button.height);
		
		if (this.map.money < TowerTypes[i+_selectedCategory*3].price)
		{
			context.rect(button.x,button.y,button.width,button.height);
			context.fillStyle = "rgba(255, 255, 255, 0.5)";
			context.fill();
			context.restore();
		}	
		
		//context.rect(button.x, button.y, button.width, button.height);
		
		if(button.isSelected)
		{
			context.save();
			context.strokeStyle = "red";
			context.lineWidth = 3;
			context.strokeRect(button.x,button.y,button.width,button.height);
			context.restore();
		}
		//context.fill();
		context.beginPath();		
    }		
	
			
	for (var i = this.actionButtons.length-1; i>=0; i--) {
		var button = this.actionButtons[i];
		//context.fillStyle = button.color;
		//context.fillRect(button.x, button.y, button.width, button.height);
		if (button == _selectedActionButton)
		{
			context.drawImage(_images.pressed_button,button.x,button.y,button.width,button.height);
			setTimeout(function(){
				_selectedActionButton = null;			
			},BTN_HIGHLIGHT_TIME);
		}
		else 
		{
			context.drawImage(_images.normal_button,button.x,button.y,button.width,button.height);			
		}
    }
	context.restore();
	
	context.fillStyle = "#DFDFDF";
	context.font = "bold 13px Arial";
	context.fillText("Next wave !", this.left + 33, this.top + 27);
	context.fillText("Option", this.left + 142, this.top + 27);
	context.font = "bold 20px Arial";
	context.fillText("<", this.left + 18, this.top + 159);
	context.fillText(">", this.left + 170, this.top + 159);
	context.font = "bold 13px Arial";
	context.fillText("Undo", this.left + 36, this.top + 336);
	context.fillText("Restart", this.left + 126, this.top + 336);
	context.fillText("Upgrade", this.left + 27, this.top + 381);
	context.fillText("Sell", this.left + 135, this.top + 381);
	context.restore();
	
	context.fillStyle = "#2929A3";
	//context.fillRect(this.left + 5, this.top + 50, this.width - 10, 75);
	context.drawImage(_images.sunken_plate,this.left+5,this.top+50,this.width-10,75);	
	//context.fillText("Map Level: " + (this.map.level + 1), this.left + 10, this.top + 220);
	context.fillStyle = "red";
	context.fillText("Lives: " + this.map.playerLife, this.left + 15, this.top + 70);
	context.fillStyle = "yellow";
	context.fillText("Money: " + this.map.money + "$", this.left + 100, this.top + 70);	
	context.fillStyle = "#2929A3";
	context.fillText("HP: " + this.map.waveHP, this.left + 15, this.top + 110);
	context.fillText("Speed: " + Math.ceil(this.map.waveSpeed * 10), this.left + 100, this.top + 110);
	context.fillText("Wave: " + this.map.wavesCounter, this.left + 15, this.top + 90);
	if(this.countDownSeconds > 0)
	{		
		context.fillText("Remains: " + this.countDownSeconds + "s", this.left + 100, this.top + 90);
	}	
		
	if(this.map.selectedTower)
		this.drawTowerInfo(context, this.map.selectedTower);
		
	context.fillStyle = "black";
}
ControlPanel.prototype.drawTowerInfo = function(context, tower){		
	
	context.fillStyle = "black";	
	var left = this.left + 10;
	context.fillStyle = "blue";
	context.font = "bold 13px Arial";
	context.fillText("Name: " + tower.name, left, this.top + 245);
	context.font = "13px Arial";
	context.fillStyle = "black";
	context.fillText("Effect: " + Effects.getName(tower.effect), left, this.top + 265);
	context.fillText("Level: " + tower.level, left+105, this.top + 265);
	context.fillText("Range: " + tower.shootingRange, left, this.top + 285);
	context.fillText("Fire rate: " + Math.floor((1000 / tower.fireDelay) * 10), left + 105, this.top + 285);
	context.fillText("Damage: " + tower.damage, left, this.top + 305);
	//context.fillText("Rotation Speed: " + Math.floor(tower.rotationSpeed * 100), left, this.top + 160);
	context.fillStyle = "yellow";
	context.font = "bold 13px Arial";
	context.fillText("Price: " + tower.price + "$", left + 105, this.top + 305);
	context.restore();
}
ControlPanel.prototype.onmousedown = function(x, y){
	this.selectAt(x, y);			
	
}
ControlPanel.prototype.addItem = function(x, y, width, height, color, text, onclick){
	var button = new Button;
	button.x = x + this.left;
	button.y = y + this.top;
	button.width = width;
	button.height = height;
	button.color = color;
	button.text = text;
	button.onclick = onclick;
	//button.img = img;
	if(onclick)
		this.actionButtons.push(button);
	else
		this.towerButtons.push(button);
}
// select by index
ControlPanel.prototype.select = function(i){

	this.selectedItem = this.towerButtons[i];			
	this.towerButtons[i].isSelected = true;
	
	
	this.map.selectedTower = TowerFactory.createTower(i+_selectedCategory*3);			
}
// select by position
ControlPanel.prototype.selectAt = function(x,y){
	if(this.selectedItem)
		this.selectedItem.isSelected = false;
	this.selectedItem = null;
	for (var i = 0; i < this.towerButtons.length; i++) {
		var button = this.towerButtons[i];
		
		if(button.contain(x, y))
		{			
			this.select(i);
			break;
		}
    }
	
	for (var i = 0; i < this.actionButtons.length; i++) {
		var button = this.actionButtons[i];
		
		if(button.contain(x, y))
		{
			if(button.onclick)
			{
				button.onclick();
				_selectedActionButton = button;
			}
			break;
		}
    }
}
