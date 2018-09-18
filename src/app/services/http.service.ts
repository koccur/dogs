import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { of, Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Response } from "selenium-webdriver/http";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  [x: string]: any;
  // todo: do enviroment
  private readonly urlToDogs =
    "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=95e5d45bda2ef09948701808aa681826&text=dogs&format=json&nojsoncallback=1";

  private dogSubject: BehaviorSubject<Photos> = new BehaviorSubject<Photos>(
    null
  );
  public readonly dog$: Observable<Photos>;
  constructor(private http: HttpClient) {
    this.dog$ = this.dogSubject.asObservable();
  }

  getDogData() {
    return this.dogSubject.getValue();
  }

  getDogPhoto(photoData: Photo) {
    // const url = 'https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg';
    const farmId = photoData.farm;
    const serverId = photoData.server;
    const photoId = photoData.id;
    const secret = photoData.secret;
    return this.http
      .get(
        `https://farm${farmId}.staticflickr.com/${serverId}/${photoId}_${secret}.jpg`,
        { responseType: "text" }
      )
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  updateDogData(data) {
    this.dogSubject.next(data);
  }

  getDogs(): Observable<Photos> {
    return this.http.get(this.urlToDogs).pipe(
      map((wrapper: PhotosWrapper) => {
        const photos = wrapper.photos;
        this.updateDogData(photos);
        return wrapper.photos;
      })
    );
  }
}
