import { environment } from '../../environments/environment.prod';
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {Map, View} from 'ol';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';
import {transform, toLonLat} from 'ol/proj';
import RasterSource from 'ol/source/Raster';
import {createXYZ} from 'ol/tilegrid';
import OSM from 'ol/source/OSM';
import {TileDebug} from 'ol/source.js';
import XYZ from 'ol/source/XYZ';
import {CartoDB} from 'ol/source.js';
import BaseLayer from 'ol/layer/Base';
import Source from 'ol/source/Source.js';
//import Tile from 'ol/layer/Tile';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  
  map: Map | undefined;

  season = "chi-jun-21";
  pixelObj = [
     {rgb : 0 , season : "Summer" , color : "orange"},
     {rgb : 0 , season : "Fall" , color : "green" },
    {rgb : 0 , season : "Winter", color : "blue"},
  ]
  
  readonly mapConfig = {
    'layers': [
      {
        'type': 'cartodb',
        'options': {
          'cartocss_version': '2.1.1',
          'cartocss': '#layer { polygon-fill: #F00; }',
        },
      },
    ],
  };

  readonly cartoDBSource = new CartoDB({
    account: 'documentation',
    config: this.mapConfig,
  });

  readonly aerial1 =  new XYZ({
    tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
    url: '../../assets/chi-jun-21/{z}/{x}/{y}.png',
    maxZoom: 20,
  });
  readonly aerial2 =  new XYZ({
    tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
    url: '../../assets/chi-dec-21/{z}/{x}/{y}.png',
    maxZoom: 20,
  });
  readonly aerial3 =  new XYZ({
    tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
    url: '../../assets/chi-sep-22/{z}/{x}/{y}.png',
    maxZoom: 20,
  });

  readonly raster1 = new RasterSource({
    sources: [  this.aerial1],
    /**
     * Run calculations on pixel data.
     * @param {Array} pixels List of pixels (one per source).
     * @param {Object} data User data object.
     * @return {Array} The output pixel.
     */
    operation: function(pixels: any, data: any): any {
      let pixel = [0,0,0,0];
      let val = pixels[0][3]/255.0;
      pixel[0]=182*val;
      pixel[1]=80*val;
      pixel[2]=60*val;
      pixel[3]=255*val;
              
      return pixel;
    },
  });

  readonly raster2 = new RasterSource({
    sources: [  this.aerial2  ],
    /**
     * Run calculations on pixel data.
     * @param {Array} pixels List of pixels (one per source).
     * @param {Object} data User data object.
     * @return {Array} The output pixel.
     */
    operation: function(pixels: any, data: any): any {
      let pixel = [0,0,0,0];
      let val = pixels[0][3]/255.0;
      pixel[0]=90*val;
      pixel[1]=142*val;
      pixel[2]=90*val;
      pixel[3]=255*val;
              
      return pixel;
    },
  });


  readonly raster3 = new RasterSource({
    sources: [  this.aerial3  ],
    /**
     * Run calculations on pixel data.
     * @param {Array} pixels List of pixels (one per source).
     * @param {Object} data User data object.
     * @return {Array} The output pixel.
     */
    operation: function(pixels: any, data: any): any {
      let pixel = [0,0,0,0];
      let val = pixels[0][3]/255.0;
      pixel[0]=66*val;
      pixel[1]=113*val;
      pixel[2]=143*val;
      pixel[3]=255*val;
              
      return pixel;
    },
  });


    


  readonly layer1 = new ImageLayer({
    source : this.raster1,
    zIndex: 1
  });

  readonly  layer2 =new ImageLayer({
    source : this.raster2,
    zIndex: 1
  });
  readonly  layer3 =new ImageLayer({
    source : this.raster3,
    zIndex: 1
  });


  currentLayer = this.layer1;

  constructor() { 


    

  }

  ngOnInit(){
  }

    

  initializeMap(){

  }


  

  ngAfterViewInit(): void {

    //console.log(environment.filesurl +"{z}/{x}/{y}.png");
    // Create map
       this.map = new Map({
        view: new View({
          center: transform([-87.6298, 41.8781], 'EPSG:4326', 'EPSG:3857'),
          zoom: 15
          ,
        }),
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new TileLayer({
            source: new TileDebug(),
          }),
          this.layer1,
          this.layer2,
          this.layer3
        ],
        target: 'ol-map'
      });

      this.map.on('pointermove', (evt: any) => {
        console.log(this.layer1.getData(evt.pixel));

        let arr = this.layer1.getData(evt.pixel)?.toString().split(",").map(x => parseInt(x))
        this.pixelObj[0].rgb = 2.236 * ((arr?.[0] ?? 0) + (arr?.[1] ?? 0) + (arr?.[2] ?? 0));
        
        let arr2  = this.layer2.getData(evt.pixel)?.toString().split(",").map(x => parseInt(x))
        this.pixelObj[1].rgb = 1.677 * ((arr2?.[0] ?? 0) + (arr2?.[1] ?? 0) + (arr2?.[2] ?? 0));
       
        let arr3  = this.layer3.getData(evt.pixel)?.toString().split(",").map(x => parseInt(x))
        this.pixelObj[2].rgb = 1.118 * ((arr3?.[0] ?? 0) + (arr3?.[1] ?? 0) + (arr3?.[2] ?? 0));
       
        this.pixelObj= ([] as { rgb: number; season: string;  color: string;}[]).concat(this.pixelObj);
      });
    
  }

  

  updateValues() {
    // Emit new values to chart component

  }

  

  changeSeason(num : number){
   // this.map?.removeLayer(this.layer1);
    switch(num){

      case -1:


       this.layer1.setVisible(true)
       this.layer3.setVisible(true)
       this.layer2.setVisible(true)

       let b1 = document.getElementById("b1")?.style.backgroundColor;
       b1 = "blue";

        // this.season = "chi-jun-21";
        // this.map?.removeLayer(this.currentLayer);
        // this.map?.addLayer(this.layer1);
        this.currentLayer = this.layer1;
        break;
      case 0:


       this.layer1.setVisible(true)
       this.layer3.setVisible(false)
       this.layer2.setVisible(false)

        // this.season = "chi-jun-21";
        // this.map?.removeLayer(this.currentLayer);
        // this.map?.addLayer(this.layer1);
        this.currentLayer = this.layer1;
        break;
      case 1:
        this.season = "chi-dec-21";


        this.layer1.setVisible(false)
        this.layer3.setVisible(false)
        this.layer2.setVisible(true)


        //this.layer1.

     
        

        // this.map?.removeLayer(this.currentLayer);
        // this.map?.addLayer(this.layer2);
         this.currentLayer = this.layer2;
        break;
      case 2:

        // this.season = "chi-sep-22";
        // this.map?.removeLayer(this.currentLayer);
        // this.map?.addLayer(this.layer3);

        this.layer1.setVisible(false)
        this.layer3.setVisible(true)
        this.layer2.setVisible(false)

        this.currentLayer = this.layer3;
        break;
    }
  }

}
