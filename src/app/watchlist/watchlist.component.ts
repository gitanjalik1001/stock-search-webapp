import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  constructor(private dataService : DataService) { }
  displayElements:boolean;
  tickers: string[] = [];
  closed : boolean = false;
  changes: number[] = [];
  //changePercents: number[] = [];
  //isPositives:boolean[] = [];
  tickerDetails: any[] = [];
  closeX(ticker){
    var tickerList = JSON.parse(localStorage.getItem('tickers_W'));
    if(tickerList.length <= 1){
      localStorage.removeItem('tickers_W');
    }
    else{
    for(var x = 0; x < tickerList.length; x++){
      if(ticker == tickerList[x]){
          tickerList.splice(x, 1);
        }
        break;
      }
    localStorage.removeItem('tickers_W');
    localStorage.setItem('tickers_W', JSON.stringify(tickerList));
    }
    localStorage.removeItem(ticker+'_W');
    //callback();
  }

  formulateWatcherlist(){
    if(localStorage.getItem('tickers_W') != null){
      var tickerList = JSON.parse(localStorage.getItem('tickers_W'));
      for(var x = 0; x < tickerList.length; x++){
        this.tickers[x] = tickerList[x];
      }

      for(var x = 0; x < tickerList.length; x++){
          var oneTickerList = JSON.parse(localStorage.getItem(this.tickers[x]+'_W'));

          oneTickerList.ticker = this.tickers[x];

          //this.names.push(oneTickerList.name);
          this.changes.push(oneTickerList.change);
          //this.changePercents.push(oneTickerList.changePercent);
          if(this.changes[x] < 0){
            oneTickerList.isPositive = false;
          }
          else{
            oneTickerList.isPositive = true;
          }
          this.tickerDetails.push(oneTickerList);
      }
    }
  }

  ngOnInit(): void {
    if(localStorage.getItem("tickers_W") === null){
      this.displayElements = false;
    }
    else{
      this.displayElements = true;
    }
    this.formulateWatcherlist()
  }

}
