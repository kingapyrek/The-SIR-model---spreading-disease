var canvas;
var ctx;
var animation;
var x;
var y;
var dx; 
var dy;

var virusRadius;
var platformHeight;
var platformWidth;
var platformX;


var blockRow;
var blockColumn;
var blockWidth;
var blockHeight;
var blockPadding;
var blockTop;
var blockLeft;
var score ;

var blocks;
var lives;
var bounceSound;
var livesSound;
var scoreSound;


function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function()
  {
    this.sound.play();
  }

}



function mouseMoveHandler(event)
{
    var x = event.clientX - canvas.offsetLeft;

    if(x > 0 && x < canvas.width)
    {
        platformX = x -platformWidth/2;
    }
}

function cancelAnimation()
{
 var id = window.requestAnimationFrame(function(){});
   while(id--)
   {
     window.cancelAnimationFrame(id);
   }
}

function collisionDetection()
{
    for (var i = 0; i < blockColumn; i++)
    {
        for (var j = 0; j < blockRow; j++)
        {
            var temp = blocks[i][j];
            if (temp.status != 3)
            {
                if (x>temp.x && x<temp.x+blockWidth && y>temp.y && y<temp.y+blockHeight)
                {
                   dy = -dy;
                   temp.status += 1;
                   bounceSound.play();
                   if(temp.status == 3)
                   {
                   	score ++;
                   }
                   if(score == blockRow*blockColumn)
                   {
                   		scoreSound.play();
                      alert("Koniec gry!");
                      document.location.reload();
                      window.cancelAnimationFrame(animation);
                   }
                }
            }
        }
    }
}

function updateScore()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawPlatform()
{
    ctx.beginPath();
    ctx.rect(platformX, canvas.height-platformHeight, platformWidth, platformHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function updateLives()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawVirus()
{

    var img = new Image();
	img.src = 'Coronavirus_cartoon.svg.png';
	ctx.drawImage(img, x, y,virusRadius,virusRadius);
	ctx.fill();
}

function drawBlocks()
{
    for(var i=0; i<blockColumn; i++)
    {
        for(var j=0; j<blockRow; j++)
        {
            if(blocks[i][j].status != 3)
            {
                var blockX = (i*(blockWidth+blockPadding))+blockLeft;
                var blockY = (j*(blockHeight+blockPadding))+blockTop;
                blocks[i][j].x = blockX;
                blocks[i][j].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                if(blocks[i][j].status == 0)
                {
                ctx.fillStyle = "#4CB1F7";
              	}
              	else if (blocks[i][j].status == 1)
              	{
              		ctx.fillStyle = "red";
              	}
              	else if(blocks[i][j].status == 2)
              	{
              		ctx.fillStyle = "green";
              	}
                  ctx.fill();
                  ctx.closePath();
              }
        }
    }
}

function draw()
{
	var animation = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawVirus();
    drawPlatform();
    
    collisionDetection();
    updateScore();
    updateLives();
    drawBlocks();

    if(x+dx>canvas.width-virusRadius || x+dx<virusRadius)
    {
        dx = -dx;
    }

    if(y+dy<virusRadius)
    {
        dy = -dy;
    }
    else if(y+dy>canvas.height-virusRadius)
    {
        if(x>platformX && x<platformX+platformWidth)
        {
            dy = -dy;
        }
        else 
        {
           	lives--;

			if(lives==0)
			{
				livesSound.play();
			    alert("KONIEC ŻYĆ!");
			    document.location.reload();
			    window.cancelAnimationFrame(animation);
			}
			else
			{
			    x = canvas.width/2;
			    y = canvas.height-30;
			    dx = 2;
			    dy = -2;
			    platformX = (canvas.width-platformWidth)/2;
			}
          // window.cancelAnimationFrame(animation);
        }
    }
    x += dx;
    y += dy;
}

function start_game()
{
	cancelAnimation();
	blocks=[];
	bounceSound = new sound("boink.mp3");
	livesSound = new sound("lives.mp3");
	scoreSound = new sound("end.mp3");

	canvas= document.getElementById("canvas_game");
	ctx= canvas.getContext("2d");
	x = canvas.width/2;
	y = canvas.height-30;
	dx = 2;
	dy = -2;
	virusRadius = 25;

	platformHeight = 10;
	platformWidth = 75;
	platformX = (canvas.width-platformWidth) / 2;


	blockRow = 3;
	blockColumn = 5;
	blockWidth = 75;
	blockHeight = 20;
	blockPadding = 10;
	blockTop = 30;
	blockLeft = 30;
	score = 0;
	lives = 3;
	blocks = [];

	for(var i=0; i<blockColumn; i++)
	{
	    blocks[i] = [];
	    for(var j=0; j<blockRow; j++)
	    {
	        blocks[i][j] = { x: 0, y: 0,  status: 0 };
	    }
	}

	document.addEventListener("mousemove", mouseMoveHandler, false);
	draw();

}