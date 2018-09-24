import {Photo} from "./Photo";

export interface Photos {
  page: number;
  pages: number;
  perpage: number;
  photo: Photo[];
  total: string;
}
