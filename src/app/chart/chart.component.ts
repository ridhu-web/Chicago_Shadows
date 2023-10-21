import { Component, AfterViewInit, Input } from '@angular/core';
import { OnInit, SimpleChanges, OnChanges } from '@angular/core'
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {


  @Input() season: string | undefined; 
  @Input() pixelObj: any | undefined;
  @Input() map: any | undefined;



  title = "something";


  private svg: any;
  private margin = 40;
  private width = 350;
  private height =260;

 

  constructor() { }

  
  private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width )
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}


private drawBars(data: any[]): void {
  
  // Create the X-axis band scale

  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.season))
  .padding(0.4);

  // Draw the X-axis on the DOM

  try{
    this.svg.selectAll("*").remove();
  }catch(exception ){

  };

  

  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");


  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 720])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Create and fill the bars

  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d: any) => x(d.season))
  .attr("y", (d: any) => y(d.rgb))
  .attr("width", 60)
  .attr("height", (d: any) => this.height - y(d.rgb))
  .attr("fill",  (d: any) =>(d.color));
}



  ngOnInit() {

    this.createSvg();
    this.drawBars(this.pixelObj);

  }


  ngAfterViewInit(): void {

  }


  updateValues(values: any) {

   
    // Update values

  }

  ngOnChanges(changes: SimpleChanges): void {
    
    this.drawBars(this.pixelObj);
  }

}
