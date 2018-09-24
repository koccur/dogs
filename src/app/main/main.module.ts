import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageComponent } from "./image/image.component";
import { MainComponent } from "./main.component";
import {FormsModule} from "@angular/forms";
import {HttpService} from "../services/http.service";
import { MapComponent } from './map/map.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [ImageComponent, MainComponent, MapComponent],
  providers: [HttpClient,HttpService]
})
export class MainModule {}
