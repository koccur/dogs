import {HttpService} from "../../services/http.service";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Photo} from "../../model/Photo";
import {delay} from "rxjs/operators";

@Component({
  selector: "app-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.sass"]
})
export class ImageComponent implements OnInit {
  public dogImage;
  @Input() photo: Photo;
  @Output() onShowOwner:EventEmitter<string>= new EventEmitter<string>();
  public isPending = false;
  public errorMessage = '';

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.getPhotoUrl();
  }

  public getPhotoUrl() {
    if (!this.isPending) {
      this.isPending = true;
      //delay for possibility for load gif
      this.httpService.getPhoto(this.photo).pipe(delay(2000)).subscribe(res=>{
        this.dogImage = res;
        this.isPending = false;
      }, error => {
        console.log("Cannot load photo from service", this.photo.id);
        this.errorMessage = 'There is problem with photo';
      });
    }
  }

  public showOwnerPhotos(ownerID) {
    this.onShowOwner.emit(ownerID)
  }

  public showOnMap(photo) {
    this.httpService.updateMapCoords(photo.coords);
  }
}
