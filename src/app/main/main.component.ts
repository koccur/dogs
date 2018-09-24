import {Observable} from "rxjs";
import {Component, ElementRef, HostListener, OnInit} from "@angular/core";
import {HttpService} from "../services/http.service";
import {ParamsNames} from "../model/Param";
import {Photos} from "../model/Photos";
import {filter} from "rxjs/operators";


@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.sass"]
})
export class MainComponent implements OnInit {
  public paramNames = ParamsNames;
  private counterPage = 1;
  public readonly photos$: Observable<Photos>;
  private paramsList = [];
  public filters = [];
  private isLoadingContent: boolean = false;
  private licenses$: Observable<any>;
  selectedLicense: any = null;
  public errorMessage: string="";

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
      this.counterPage = 1;
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

  @HostListener('window:wheel', ['$event'])
  private onWindowScroll($event) {
    if ($event.wheelDeltaY < 0 && this.elementRef.nativeElement.offsetParent.clientHeight - $event.pageY < 1500) {
      if (!this.isLoadingContent) {
        this.getNextPictures(++this.counterPage);
        this.isLoadingContent = true;
      }
    }
  }

  private getNextPictures(page: number) {
    debugger;
    // this.findByFilter(page.toString(),ParamsNames.PAGE);
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
    Object.values(ParamsNames).forEach(paramName => {
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

}
