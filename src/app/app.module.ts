import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { ChartComponent } from './chart/chart.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [{
  path: "home" , component: HomepageComponent,
}, {  path: "map" , component: MapComponent},
{  path: "chart" , component: ChartComponent},
{ path : "" , redirectTo : '/map' , pathMatch : "full"},
{ path : "chart" , redirectTo : '/chart' , pathMatch : "full"}

];

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ChartComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
