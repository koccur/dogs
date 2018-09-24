import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {filter} from "rxjs/operators";
import {} from '@types/googlemaps';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap') gmapElement: any;

  private map: google.maps.Map;
  public mapInput = {
    latitude: '0',
    longitude: '0'
  };

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.httpService.mapCoords$.pipe(filter(v => !!v)).subscribe(res => {
      this.mapInput.latitude = res.latitude;
      this.mapInput.longitude = res.longitude;
      this.setCenter();
    });
  }

  public ngAfterViewInit(): void {
    const mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  //not working because wrong api key
  public getPhotosForLocation() {
    this.httpService.getPhotosForLocation(this.mapInput.latitude, this.mapInput.longitude);
  }

  private setCenter() {
    this.map.setCenter(new google.maps.LatLng(+this.mapInput.latitude, +this.mapInput.longitude));
  }
}
