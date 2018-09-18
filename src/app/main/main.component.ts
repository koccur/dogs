import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { HttpService } from "../services/http.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.sass"]
})
export class MainComponent implements OnInit {
  private photos: any;
  public readonly photos$: Observable<Photos>;
  constructor(private httpService: HttpService) {
    this.photos$ = this.httpService.dog$;
  }

  ngOnInit() {
    this.getDogs();
  }

  private getDogs() {
    this.httpService.getDogs().subscribe();
  }
}
