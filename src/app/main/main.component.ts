import {Observable} from "rxjs";
import {Component, ElementRef, HostListener, OnInit} from "@angular/core";
import {HttpService} from "../services/http.service";
import {ParamsNames, TextFilterNames} from "../model/Param";
import {Photos} from "../model/Photos";
import {filter} from "rxjs/operators";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.sass"]
})
export class MainComponent implements OnInit {
  public paramNames = ParamsNames;
  public filters = [];
  public selectedLicense: any = null;
  public errorMessage: string="";
  public readonly photos$: Observable<Photos>;
  private readonly licenses$: Observable<any>;
  private isLoadingContent: boolean = false;
  private counterPage = 1;
  private paramsList = [];

  constructor(private httpService: HttpService,
              private elementRef: ElementRef) {
    this.photos$ = this.httpService.dog$;
    this.licenses$ = this.httpService.getLicenses();
  }

  public ngOnInit() {
    this.fillupFilters();
    this.findHundredDogsPhotos();
  }

  public findByFilter(paramValue: string = null, paramName = null, reset = true) {
    if (reset) {
      this.resetParamList();
    }
    if (paramName) {
      this.filters.filter(filter => filter.name === paramName)[0].value = paramValue;
    }
    this.counterPage = this.filters.filter(filter => filter.name === this.paramNames.PAGE)[0].value;
    this.filters.forEach(filter => {
      this.paramsList.push({key: filter.name, value: filter.value});
    });
    if (this.selectedLicense) {
      this.chooseLicense(this.selectedLicense);
    }
    this.getPhotos(this.paramsList);
  }

  public clearFilters() {
    this.paramsList = [];
    this.selectedLicense = [];
    this.counterPage = 1;
    this.cleanupFiltersValues();
  }

  public chooseLicense(value) {
    this.paramsList.push({key: this.paramNames.LICENSE, value: value});
  }
  // todo: moment.js instead of date
  public convertToTimeStamp(value){
    let date = new Date(value);
    return date;
  }

  private getNextPictures(page: number) {
    this.paramsList.filter(filter => filter.key === ParamsNames.PAGE)[0].value = page;
    this.httpService.getNextPictures(this.paramsList).pipe(filter(v => !!v)).subscribe(() => this.isLoadingContent = false);
  }

  private getPhotos(param) {
    this.httpService.getPhotos(param).subscribe(success=>{
      this.errorMessage="";
    },error=>{
      this.httpService.updateDogData([]);
      this.errorMessage="cannot load images without parameters";
    });
  }

  private fillupFilters() {
    Object.values(TextFilterNames).forEach(paramName => {
      if (paramName === ParamsNames.PAGE) {
        this.filters.push({name: paramName, value: this.counterPage});
      } else {
        this.filters.push({name: paramName, value: ''});
      }
    });
  }

  private cleanupFiltersValues() {
    this.filters = [];
    this.fillupFilters();
  }

  private findHundredDogsPhotos() {
    this.selectedLicense = null;
    this.findByFilter('dogs', ParamsNames.TEXT);
  }

  private resetParamList() {
    this.paramsList = [];
  }

  @HostListener('window:wheel', ['$event'])//todo: window:scroll instead of wheel
  private onWindowScroll($event) {
    if ($event.wheelDeltaY < 0 && this.elementRef.nativeElement.offsetParent.clientHeight - $event.pageY < 1500) {
      if (!this.isLoadingContent && this.paramsList.length>0) {
        this.getNextPictures(++this.counterPage);
        this.isLoadingContent = true;
      }
    }
  }

}
