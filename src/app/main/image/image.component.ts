import { HttpService } from "./../../services/http.service";
import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.sass"]
})
export class ImageComponent implements OnInit {
  public dogImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  @Input()
  photo: Photo;
  private isPending = false;
  constructor(
    private httpService: HttpService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getPhotoUrl();
  }

  public getPhotoUrl() {
    if (!this.isPending) {
      this.isPending = true;
      this.httpService.getDogPhoto(this.photo).subscribe((res: any) => {
        this.dogImage.next("data:image/jpg;base64," + res);
        this.isPending = false;
      });
    }
  }
}
