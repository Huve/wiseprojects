
function Histogram(id,svg,bins,h,w,x,y,sdm,color){
	this.id=id;
	this.svg=svg;
	this.height=h;
	this.width=w;
	this.bins=bins;
	this.x=x;
	this.y=y;
	this.inc=this.width/this.bins;
	this.dataset=[];
	this.true_data=[];
	
	for (i=0;i<bins;i++){
		this.dataset.push(1); // Data goes here
	}
	
	
	this.getinfo=function(){
		console.log(this.height + " " + this.width + " " + this.x + " " + this.y + " " + this.bins + " " + this.inc);
	}
	
	this.draw=function(inc,h,w,y,n,trudata){
		this.dataset=calcNormal(this.dataset,bins/2,bins/6,n,sdm,this,trudata);
		var tid="#"+this.id;
		var rects = svg.selectAll(tid)
			    .data(this.dataset)
			    .enter()
			    .append("rect")
				.attr("id",this.id);
				
		rects.attr("x", function(d, i) {
						return (i * inc);
					})
				    .attr("y", function(d, i){
						var newY = h-gmap(d,y,h);
						if (newY < 0){newY = 0;}
							return newY;
				    })
				    .attr("height", function(d,i){
						return h;
						})
				    .attr("width",inc)
					.attr("fill", color);
	}
	
	this.adjust=function(svg,n){
		this.dataset=calcNormal(this.dataset,bins/2,bins/6,n,sdm,this);
		var h = this.height
		var y = this.y
		var tid="#"+this.id;
		var rects = svg.selectAll(tid);
		rects.data(this.dataset).enter();

		rects.transition()
		.attr("y", function(d, i){
			var newY = h-gmap(d,y,h);
			if (newY < 0){newY = 0;}
			return newY;
		});
	}
	
	this.hidden=function(){
		var tid="#"+this.id;
		var rects = svg.selectAll(tid);
		rects.transition()
		.attr("y", function(d,i){
			return h;
		});
	}
	
	this.recolor = function(svg,c, clr){
		var cl="."+c;
		var rects = svg.selectAll(cl);
		rects.transition()
		.duration(500)
		.attr("fill", clr);
	}
	
	return this;
}


function gmap(x,xmax,omax){
	var p = x/xmax*omax;
	return p;
}


function calcNormal(data,mean,sd,n,sdm,histogram,trudata){
	var normal=[];
	var max_height=50;
	if (sdm==true){
			var SE = sd / Math.sqrt(n);
			var max_height=10;
		}
		else{ var SE=sd; }
	for (i=0;i<data.length;i++){

		var diff = i - mean;
		var numerator=Math.pow(diff,2);
		var denominator=2*(Math.pow(SE,2));
		var exponent=-(numerator/denominator);
		var eterm=Math.pow(Math.E,exponent);
		var fraction=1/((Math.sqrt(6.2832)));
		var height = fraction*eterm;
		if (!sdm){
		
		}
			else{ var max_height=40*(4.8/SE); }
			
		height=height*max_height;
		normal.push(height);
		if (trudata){
			for (x=0;x<height;x++){
				var datapoint=Math.random()+i;
				histogram.true_data.push(datapoint);
			}
		}
	}
	return normal;
}
