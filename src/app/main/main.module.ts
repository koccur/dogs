import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageComponent } from "./image/image.component";
import { MainComponent } from "./main.component";

@NgModule({
  imports: [CommonModule],
  declarations: [ImageComponent, MainComponent],
  providers: [HttpClient]
})
export class MainModule {}
