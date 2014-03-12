var WIDTH = 400;
var HEIGHT = 400;

var HALF_WIDTH = WIDTH / 2;
var HALF_HEIGHT = HEIGHT / 2; 
var UNIT_SIZE = 20;
var HALF_UNIT_SIZE = UNIT_SIZE/2;
var MAPS = [];

MAPS.push
	({		
		numEnemies		: 10,
		numWaves		: 5,
		HP	 			: 500,
		roadsX			: [
							[50,50,50,50,HALF_WIDTH,HALF_WIDTH,300,300],
							[200,200,300,300,50,50,HALF_WIDTH,HALF_WIDTH,300,300],
							[WIDTH,300,300,300,50,50,HALF_WIDTH,HALF_WIDTH,300,300]
						],
		roadsY			: [
							[0,50,110,250,350,HALF_HEIGHT,250,HEIGHT],
							[0,50,50,110,110,250,350,HALF_HEIGHT,250,HEIGHT],
							[50,50,50,110,110,250,350,HALF_HEIGHT,250,HEIGHT]
						]
	});
MAPS.push
	({		
		numEnemies		: 10,
		numWaves		: 10,
		HP	 			: 700,
		roadsX			: [
							[50,50,50,150,150,350,350,50,50,200,HALF_WIDTH],
							[150,150,150,150,HALF_WIDTH,300,300],
							
						],
		roadsY			: [
							[0,110,150,150,50,50,250,250,350,350,HEIGHT],
							[0,110,150,HALF_HEIGHT,HALF_HEIGHT,250,HEIGHT],							
						]		
	});
var MapFactory = {};
MapFactory.getData = function(level){
// find the total length of road
	function calcLength(level)
	{	
		var data = MAPS[level];
		data.lengths = [];
		for(var i = 0;i < data.roadsX.length; i++)
		{
			var roadX = data.roadsX[i];
			var roadY = data.roadsY[i];
			var length = 0;
			for(var j = 1;j < roadX.length ; j++)
			{
				var x1 = roadX[j-1],
					y1 = roadY[j-1],
					x2 = roadX[j],
					y2 = roadY[j];			
				length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
			}
			data.lengths.push(length);
			
		}	
		return data;
	}
	return calcLength(level);
}



