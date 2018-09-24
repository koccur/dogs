export interface Param {
  perPage?:number;
  text?:string[];
  license?:string;
  tags?:string[];
  minDate?:string;
  maxDate?:string;
  page?:string;
}
export enum ParamsNames{
  PAGE = 'page',
  PER_PAGE = 'perPage',
  TEXT ='text',
  LICENSE = 'license',
  TAGS = 'tags',
  MIN_DATE = 'minDate',
  MAX_DATE = 'maxDate'
}
export interface ParamObject {
  value:string,
  key:string
}
export enum UrlParamPrefixes{
QUANTITY_PER_PAGE_PARAM_URL = '&per_page=',
PAGE_PARAM_URL = '&page=',
TEXT_PARAM_URL = '&text=',
LICENSE_PARAM_URL = '&license=',
TAGS_PARAM_URL = '&tags=',
MIN_DATE_PARAM_URL = '&minDate=',
MAX_DATE_PARAM_URL = '&maxDate=',
USER_PARAM_URL = '&user_id=',
PHOTO_ID_PARAM_URL = '&photo_id=',
LAT_PARAM_URL = '&lat=',
LON_PARAM_URL = '&lng='

}

export enum RestMethod{
  LICENSES = 'flickr.photos.licenses.getInfo',
  GEOLOCATION= 'flickr.photos.geo.getLocation',
  SEARCH = 'flickr.photos.search',
  PHOTO_FOR_LOCATION = 'flickr.photos.photosForLocation'
}
