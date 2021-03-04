import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from "rxjs";
//import { StockTickerBoxComponent } from './stock-ticker-box/stock-ticker-box.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getTickerDetails(ticker: string): any{
     return this.http.get('/api/details/'+ticker);
  }
  getHistoricalTickerDetails(ticker: string) {
    return this.http.get('/api/historical/'+ticker);
  }
  getTodayStockChart(ticker: string, date: string): any{
    return this.http.get('/api/todayCharts/'+ticker+'&'+date);
  }
  getChart(ticker: string): any{
    return this.http.get('/api/charts/'+ticker);
  }
  getNewsAPI(ticker : string): any{
    return this.http.get('/api/newsapi/'+ticker);
  }
}
