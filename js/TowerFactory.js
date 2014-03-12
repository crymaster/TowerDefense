var Effects = {
	getName : function(value)
	{
		for(var x in this)
		{
			if(this[x] == value)
				return x;
		}
		return null;
	},
	NONE : 0,
	POISION : 1,	
	FREEZE : 2
	
};
var TowerTypes = [
	{
		effect: Effects.NONE,
		price : 200,	
		color : "Wheat",
		damage : 100,
		shootingRange : 100,
		fireDelay : 300,
		rotationSpeed : 4,
		upgradePrice : 10
	},{
		effect: Effects.POISION,
		price : 200,	
		color : "Green",
		damage : 50,
		shootingRange : 80,
		fireDelay : 300,
		rotationSpeed : 4,
		upgradePrice : 10
	}
	,{
		effect: Effects.FREEZE,
		price : 150,	
		color : "Blue",
		damage : 40,
		shootingRange : 80,
		fireDelay : 400,
		rotationSpeed : 3,
		upgradePrice : 10
	},{
		effect: Effects.NONE,
		price : 400,	
		color : "Indigo",
		damage : 250,
		shootingRange : 200,
		fireDelay : 300,
		rotationSpeed : 2,
		upgradePrice : 30
	}
];
var TowerFactory = {};

TowerFactory.createTower = function(index){
	var tower = new Tower(_sprites.sprites["tower"+index]);	
	var data = TowerTypes[index];
	tower.effect = data.effect;
	tower.price = data.price;
	tower.color = data.color
	tower.damage = data.damage;
	tower.shootingRange = data.shootingRange;
	tower.fireDelay = data.fireDelay;
	tower.rotationSpeed = tower.rotationSpeed * data.rotationSpeed;
	tower.upgradePrice = data.upgradePrice;
	
	return tower;
};