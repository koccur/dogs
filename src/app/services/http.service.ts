import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {filter, map} from "rxjs/operators";
import {PhotosWrapper} from "../model/PhotosWrapper";
import {Photos} from "src/app/model/Photos";
import {Photo} from "src/app/model/Photo";
import {ParamObject, ParamsNames, RestMethod, UrlParamPrefixes} from "../model/Param";
import {environment} from "../../environments/environment";
import {of} from "rxjs/internal/observable/of";
import {LicensesWrapper} from "../model/LicensesWrapper";


@Injectable()
export class HttpService {
  public readonly dog$: Observable<Photos>;
  public readonly mapCoords$: Observable<any>;

  private numberOfImages: number = 1;

  private readonly basicUrl = 'https://api.flickr.com/services/rest/?method=';
  private readonly endingUrl = '&format=json&nojsoncallback=1';
  private readonly apiPrefix = '&api_key=' + environment.api_key;
  private readonly apiSig = '&api_sig=' + environment.api_sig_geo;
  private readonly geoUrl = this.basicUrl + RestMethod.GEOLOCATION + this.apiPrefix;
  private readonly searchUrl = this.basicUrl + RestMethod.SEARCH + this.apiPrefix;
  private readonly photosForLocationUrl = this.basicUrl + RestMethod.PHOTO_FOR_LOCATION + this.apiPrefix;
  private readonly licensesUrl = this.basicUrl + RestMethod.LICENSES + this.apiPrefix + this.endingUrl;
  private dogSubject: BehaviorSubject<Photos> = new BehaviorSubject<Photos>(null);
  private mapSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(private http: HttpClient) {
    this.dog$ = this.dogSubject.asObservable();
    this.mapCoords$ = this.mapSubject.asObservable();
  }

  updateMapCoords(coords) {
    this.mapSubject.next(coords);
  }

  getDogData() {
    return this.dogSubject.getValue();
  }

  getGeoInfo(photoId: string): Observable<any> {
    return this.http.get(this.geoUrl + UrlParamPrefixes.PHOTO_ID_PARAM_URL + photoId + this.endingUrl)
      .pipe(filter((wrapper: PhotosWrapper) => wrapper.stat !== 'fail'), map((wrapper: any) => {//todo: interface
        console.log(wrapper, "wrapper");
        return wrapper.photo.location;
      }));
  }

  getPhoto(photoData: Photo): Observable<any> {
    const farmId = photoData.farm;
    const serverId = photoData.server;
    const photoId = photoData.id;
    const secret = photoData.secret;
    return of(`https://farm${farmId}.staticflickr.com/${serverId}/${photoId}_${secret}.jpg`);
  }

  public updateDogData(data): void {
    this.dogSubject.next(data);
  }

  //main rest
  public getPhotos(paramsList: ParamObject[]): Observable<Photos> {
    const url = this.initializeUrl(paramsList);
    return this.http.get(url).pipe(
      map((wrapper: PhotosWrapper) => {
        const photos = wrapper.photos;
        photos.photo.forEach(photo => {
          this.getGeoInfo(photo.id).subscribe(res => {
            photo['coords'] = res;
            console.log(photo, "this.photos.photo");
          });
        });
        this.updateDogData(photos);
        return wrapper.photos;
      })
    );
  }

  //infinite scroll
  public getNextPictures(paramsList: ParamObject[]): Observable<boolean> {
    const url = this.initializeUrl(paramsList);
    return this.http.get(url).pipe(map((wrapper: PhotosWrapper) => {
      wrapper.photos.photo = this.getDogData().photo.concat(wrapper.photos.photo);
      this.updateDogData(wrapper.photos);
      return true;
    }));
  }

  //user images
  public getOwnerPhotos(ownerId) {
    return this.http.get(this.searchUrl + UrlParamPrefixes.USER_PARAM_URL + ownerId + this.endingUrl).pipe(map((wrapper: PhotosWrapper) => {
      const photos = wrapper.photos;
      this.updateDogData(photos);
      return photos;
    })).subscribe();
  }

  //photos for location
  public getPhotosForLocation(lat: string, lon: string) {
    return this.http.get(this.photosForLocationUrl + UrlParamPrefixes.LAT_PARAM_URL + lat + UrlParamPrefixes.LON_PARAM_URL + lon + this.endingUrl)
      .pipe(map((wrapper: PhotosWrapper) => {
        const photos = wrapper.photos;
        this.updateDogData(photos);
        return photos;
      })).subscribe();
  }

  public getLicenses() {
    return this.http.get(this.licensesUrl).pipe(map((licenses: LicensesWrapper) => {
      return licenses.licenses;
    }));
  }

  //filters
  private initializeUrl(params: ParamObject[]) {
    let url = [];
    url.push(this.searchUrl);
    url = this.retrieveDataParams(url, params);
    url.push(this.endingUrl);
    return url.join('');
  }


  private retrieveDataParams(url: string[], params: any[]) {
    params.forEach(param => {
      switch (param.key) {
        case ParamsNames.LICENSE:
          url.push(UrlParamPrefixes.LICENSE_PARAM_URL + param.value);
          break;
        case ParamsNames.MAX_DATE:
          url.push(UrlParamPrefixes.MAX_DATE_PARAM_URL + param.value);
          break;
        case ParamsNames.MIN_DATE:
          url.push(UrlParamPrefixes.MIN_DATE_PARAM_URL + param.value);
          break;
        case ParamsNames.TAGS:
          url.push(UrlParamPrefixes.TAGS_PARAM_URL + param.value);
          break;
        case ParamsNames.TEXT:
          url.push(UrlParamPrefixes.TEXT_PARAM_URL + param.value);
          break;
        case ParamsNames.USER_ID:
          url.push(UrlParamPrefixes.USER_ID_URL+param.value);
          break;
        case ParamsNames.PER_PAGE:
          if (param.value.length === 0) {
            url.push(UrlParamPrefixes.QUANTITY_PER_PAGE_PARAM_URL + this.numberOfImages);
          } else {
            url.push((UrlParamPrefixes.QUANTITY_PER_PAGE_PARAM_URL + param.value));
          }
          break;
        case ParamsNames.PAGE:
          url.push(UrlParamPrefixes.PAGE_PARAM_URL + param.value);
          break;
        default:
          break;
      }
    });
    return url;
  }


}
