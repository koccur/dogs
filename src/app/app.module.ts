import { MainComponent } from "./main/main.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { MainModule } from "./main/main.module";
import {FormsModule} from "@angular/forms";

const appRoutes: Routes = [{ path: "", component: MainComponent }];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, {
      useHash: true
    }),
    HttpClientModule,
    MainModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
