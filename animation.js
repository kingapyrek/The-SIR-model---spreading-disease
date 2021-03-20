var canvas;
var ctx ;

var colors = [
	'#0554F2',
	'#044BD9',
	'#0339A6',
	'#4CB1F7',
	'#0233CB'
]

function show_theory()
{
	document.getElementById("theory").style.display = "block";
	document.getElementById("welcome").style.display = "none";
	document.getElementById("first").style.display = "none";
	document.getElementById("game").style.display = "none";
}

function show_animation1()
{
	document.getElementById("first").style.display = "block";
	document.getElementById("welcome").style.display = "none";
	document.getElementById("theory").style.display = "none";
	document.getElementById("game").style.display = "none";
	cancelAnimation();

}

function show_game()
{
	document.getElementById("game").style.display = "block";
	document.getElementById("welcome").style.display = "none";
	document.getElementById("theory").style.display = "none";
	document.getElementById("first").style.display = "none";
	// window.cancelAnimationFrame(animation_1);
	cancelAnimation();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	document.getElementById('t').innerHTML =0;
	document.getElementById('s').innerHTML =0;
	document.getElementById('i').innerHTML = 0;
	document.getElementById('r').innerHTML = 0;

}

function cancelAnimation()
{
 var id = window.requestAnimationFrame(function(){});
   while(id--){
     window.cancelAnimationFrame(id);
   }
}


function Ball(x, y, r, dx, dy)
{
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.r = r;
	this.color = colors[Math.floor(Math.random()*colors.length)];
	this.frames = 0;

	this.draw = function ()
	{
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.update = function()
	{
		if(this.x + this.r > canvas.width || this.x - this.r < 0)
		{
			this.dx = - this.dx;
		}

		if(this.y + this.r > canvas.height || this.y - this.r < 0)
		{
			this.dy = - this.dy;
		}

		this.x += this.dx;
		this.y += this.dy;

		this.draw();
	}

}


var ballArray=[];


function changeColor(i)
{
	ballArray[i].color = 'red';

}

var t;
var frames;
var S0;
var I0;
var R0;
var R1;
var S1;
var I1;
var beta;
var gama;
var red=0;
var green = 0;
var animation_1;
var pop;


function simulate()
{
	animation_1 = requestAnimationFrame(simulate);
	if(green==pop)
	{
		alert('Koniec symulacji');

		
		 document.location.reload();
		 window.cancelAnimationFrame(animation_1);
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	document.getElementById('t').innerHTML = frames;
	document.getElementById('s').innerHTML = Math.round(S0);
	document.getElementById('i').innerHTML = Math.round(I0);
	document.getElementById('r').innerHTML = Math.round(R0);
	t += 1;
	if(t%50==0)
	{
		frames +=1;
		var delta=1;
		//beta=0.01;
		//gama = 0.3;
		S1=(S0-beta*S0*I0*delta);
		I1=(I0+(beta*S0*I0-gama*I0)*delta);
   		R1=(R0+gama*I0*delta);

   		for( var i = 0 ; i < (Math.round(R1) - Math.round(R0)) ; i++)
   		{

   			var temp;

   			for ( var j = 0; j < ballArray.length ; j++)
   			{
   				temp = ballArray[j];
   				if(temp.color == 'red')
   				{

   					temp.color = 'green';
   					green +=1;
   					red -= 1;
   					break;

   				}
   			}

   		}
   		var red_temp = 0;
   		for( var i = 0 ; i < (Math.round(I1)-red ); i++)
   		{
   			var temp;
   			for ( var j = 0; j < ballArray.length ; j++)
   			{
   				temp = ballArray[j];
   				if(temp.color != 'red' && temp.color != 'green')
   				{
   					temp.color = 'red';
   					red_temp +=1;
   					break;
   				}
   			}
   		}

   		red+= red_temp;

   		S0=S1;
   		I0=I1;
   		R0=R1;

}
	for(var i = 0; i < ballArray.length ;i++)
	{
		ballArray[i].update();
	}


	
}

function start()
{
	cancelAnimation();
	ballArray=[];
	pop = document.getElementById('populationRange').value;
	var inf = document.getElementById('infected').value;
	beta = (document.getElementById('betaRange').value);
	gama = (document.getElementById('gamaRange').value);
	console.log(inf);
	I0=parseInt(inf);
	S0=parseInt(pop)-I0;
	R0=0;
	canvas = document.getElementById('test');
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	ctx = canvas.getContext("2d");
	t=0;
	frames = 0;
	

	for( var i =0; i<parseInt(pop); i++)
	{
	var r = 5;
	var x = Math.random() * (canvas.width - 2*r) + r;
	var y = Math.random() * (canvas.height - 2*r) + r;
	 
	var dx = (Math.random() - 0.5)*4;
	var dy = (Math.random() - 0.5)*4;
	ballArray.push(new Ball(x,y,r,dx,dy));
	}

	simulate();
}