import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../data.service';
import {MatTabsModule} from '@angular/material/tabs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Highcharts from "highcharts/highstock";
import { Options } from "highcharts/highstock";
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import IndicatorsCore from "highcharts/indicators/indicators";
import vbp from 'highcharts/indicators/volume-by-price';
import {ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

IndicatorsCore(Highcharts);
vbp(Highcharts);
//import { StockTickerBoxComponent } from './stock-ticker-box/stock-ticker-box.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private dataService: DataService, private modalService: NgbModal) { }
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options = {
    rangeSelector:{
      enabled:false
    },
    title:{
      text:'Unknown'
    },
    series: [
      {
        name:'Unknown',
        type: 'line',
        data: [1,2,3],
        tooltip: {
                valueDecimals: 2
            },
        color: 'red'
      }
    ]
  }
  updateFlag:boolean = false;
  o = [[1,2,3,4,5]]
  v = [[1,2]]
  Highcharts2: typeof Highcharts = Highcharts;
  chartOptions2: Options = {
    rangeSelector: {
            selected: 2
        },

        title: {
            text: 'Unknown'
        },

        subtitle: {
            text: 'With SMA and Volume by Price technical indicators'
        },

        yAxis: [{
            startOnTick: false,
            endOnTick: false,
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true
        },

        plotOptions: {
            series: {
                dataGrouping: {
                    units: [['week',[1]], ['month',[1, 2, 3, 4, 6]]]//groupingUnits
                }
            }
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL',
            id: 'aapl',
            zIndex: 2,
            data: this.o//ohlc
        }, {
            type: 'column',
            name: 'Volume',
            id: 'volume',
            data: this.v,//volume,
            yAxis: 1
        }, {
            type: 'vbp',
            linkedTo: 'unknown',
            params: {
                volumeSeriesID: 'volume'
            },
            dataLabels: {
                enabled: false
            },
            zoneLines: {
                enabled: false
            }
        }, {
            type: 'sma',
            linkedTo: 'unknown',
            zIndex: 1,
            marker: {
                enabled: false
            }
        }]
    };
  updateFlag2:boolean = false;
  newsDetails : any[] = [];
  newsDetails1 : any[] = [];
  newsDetails2 : any[] = [];

  chartDetails:any;
  ticker : string=' ';
  details : any;
  prices : any;
  prices_ : any;
  closeResult = '';
  total: number = 0.00;
  quantityBox: number = 0;
  change: number = 0;
  changePercent: number= 0;
  prevClose: number = 0;
  lastTime: string;
  isPositive: boolean;
  timeStamp: any;
  marketOpen:boolean = false;
  startDate:any;
  valid : boolean = true;
  DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  _now: any;
  isPresent : boolean = false;
  todayChartData : any;
  obj:string[] = JSON.parse(localStorage.getItem('tickers_W')) || [];

  // sub_charts:Subscription = Subscription.EMPTY;
  // sub_hist:Subscription = Subscription.EMPTY;

  stars = document.getElementsByClassName("bi") as HTMLCollectionOf<HTMLElement>;
  private _success = new Subject<string>();
  successMessage = '';
  @ViewChild('selfClosingAlert', {static: true}) selfClosingAlert: NgbAlert;

  getDetails(){
    this.dataService.getTickerDetails(this.ticker).subscribe(data => {
        this.details = data;
      });
      var tickers = this.obj;
      console.log(tickers)
      if(tickers != null){
         for(var x = 0; x < tickers.length; x++){
           if(tickers[x] == this.ticker){
             this.isPresent = true;
             break;
           }
         }
      }
      if(localStorage.getItem(this.ticker) != null){
        this.total = Number(this.prices?.last) * Number(localStorage.getItem(this.ticker));
      }
  }

  getHistoricalDetails(){
    timer(0, 15000).pipe(
      switchMap(() => this.dataService.getHistoricalTickerDetails(this.ticker))
    ).subscribe(data =>{
      this.prices = data[0]
      var last = this.prices?.last;
      var prevClose = this.prices?.prevClose;
      this.change = Number(last) - Number(prevClose);
      this.changePercent =  Number(this.change) * 100 / Number(prevClose);
      if(this.change < 0){
        this.isPositive = false;
      }
      else{
        this.isPositive = true;
      }
      this.timeStamp = moment(this.prices?.timestamp).format(this.DATE_TIME_FORMAT);
      this._now = moment(new Date()).format(this.DATE_TIME_FORMAT);//, this.DATE_TIME_FORMAT);

      var now = new Date();
      var timestamp_not_formatted = new Date(this.prices?.timestamp);

      if(now.getTime() - timestamp_not_formatted.getTime() < 60000){
        this.marketOpen = true;
      }
      if(this.prices == null){
        this.valid = false;
      }
    });
  }

  getTodayStock(){
    var d;
    if(this.marketOpen == true){
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      var date = (new Date(Date.now() - tzoffset)).toISOString().split("T")[0];
    timer(0, 15000).pipe(
      switchMap(() => this.dataService.getTodayStockChart(this.ticker, date))
    ).subscribe(data => {
        this.todayChartData = data;
        var dailyChartData = [];
        for(var i=0;i<this.todayChartData.length;i++){
          var d = new Date(this.todayChartData[i]?.date).getTime();
          dailyChartData.push([d,this.todayChartData[i]?.close]);
        }

        var title = this.ticker.toUpperCase();
        this.chartOptions.title.text = title;
        if(this.isPositive){
          this.chartOptions.series[0] = {
            name: title,
            type: 'line',
            data: dailyChartData,
            tooltip: {
                    valueDecimals: 2
                  },
            color: 'green'
           }

        }
        else{
          this.chartOptions.series[0] = {
            name: title,
            type: 'line',
            data: dailyChartData,
            tooltip: {
                    valueDecimals: 2
                  },
            color: 'red'
           }
        }
        this.updateFlag = true;
      });
    }
    else{
      this.dataService.getHistoricalTickerDetails(this.ticker).subscribe(data => {
      this.prices_ = data[0];

      d = new Date(this.prices_?.timestamp);

      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      var date_: any = (new Date(d - tzoffset)).toISOString().split("T")[0];

    timer(0, 15000).pipe(
      switchMap(() => this.dataService.getTodayStockChart(this.ticker, date_))
    ).subscribe(data => {
        this.todayChartData = data;
        var dailyChartData = [];
        for(var i=0;i<this.todayChartData.length;i++){
          var d = new Date(this.todayChartData[i]?.date).getTime();
          dailyChartData.push([d,this.todayChartData[i]?.close]);
        }

        var title = this.ticker.toUpperCase();
        this.chartOptions.title.text = title;
        if(this.isPositive){
          this.chartOptions.series[0] = {
            name: title,
            type: 'line',
            data: dailyChartData,
            tooltip: {
                    valueDecimals: 2
                  },
            color: 'green'
           }

        }
        else{
          this.chartOptions.series[0] = {
            name: title,
            type: 'line',
            data: dailyChartData,
            tooltip: {
                    valueDecimals: 2
                  },
            color: 'red'
           }
        }
        this.updateFlag = true;
      });
  });
    }
  }

  getNews(){
    this.dataService.getNewsAPI(this.ticker).subscribe(data => {
      this.newsDetails = data.articles;
      for(var i = 0; i < this.newsDetails.length/2; i++){
        this.newsDetails[i].publishedAt = moment(this.newsDetails[i].publishedAt).format('LL');
        this.newsDetails1.push(this.newsDetails[i]);
      }
      for(var i = 10; i < this.newsDetails.length; i++){
        this.newsDetails[i].publishedAt = moment(this.newsDetails[i].publishedAt).format('LL');
        this.newsDetails2.push(this.newsDetails[i]);
      }

    });
  }

  getMainChart(){
    this.dataService.getChart(this.ticker).subscribe(data => {
        this.chartDetails = data;
        var ohlc = [], volume = [], dataLength = this.chartDetails.length;
       // set the allowed units for data grouping
       var groupingUnits = [[
           'week',                         // unit name
           [1]                             // allowed multiples
       ], [
           'month',
           [1, 2, 3, 4, 6]
       ]],

       i = 0;

   for (i; i < dataLength; i += 1) {
       ohlc.push([
           this.chartDetails[i]?.date, // the date
           this.chartDetails[i]?.open, // open
           this.chartDetails[i].high, // high
           this.chartDetails[i]?.low, // low
           this.chartDetails[i]?.close // close
       ]);

       volume.push([
           this.chartDetails[i]?.date, // the date
           this.chartDetails[i]?.volume // the volume
       ]);
   }
   var pltOp = {
       dataGrouping: {
           units: groupingUnits
       }
   }

   this.chartOptions2.title.text = this.ticker.toUpperCase();
   this.chartOptions2.plotOptions.series[0] = pltOp;
   this.chartOptions2.series[1]['data'] = ohlc;
   this.chartOptions2.series[0]['data'] = volume;
   this.updateFlag2 = true;
   // console.log(this.chartOptions2.series[0]['data']);
   // console.log(this.chartOptions2.series[1]['data']);
      });
  }

  open1(content) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

open2(content){
  this.modalService.open(content, {ariaLabelledBy: 'exampleModalLabel3'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

close(callback){
  var quantity:string = String(this.quantityBox);
  //this.total = this.prices?.last * Number(quantity);
  var last = this.prices?.last;
  var total :string = String(Number(this.prices?.last) * Number(quantity));
  var change = Number(total)/Number(quantity) - Number(last);
  if(localStorage.getItem(this.ticker+'_P') === null){
    var quantityList = {"name": this.details?.name, 'quantity':quantity, 'total': total,'change': change, 'changePercent': this.changePercent, 'last': last};
    localStorage.setItem(this.ticker+'_P', JSON.stringify(quantityList));
  }
  else{
    var in_local = JSON.parse(localStorage.getItem(this.ticker+'_P'));
    var q = Number(in_local.quantity) + Number(quantity);
    var t = Number(in_local.total) + Number(total);
    var change_ = t/q - last;
    var quantityList = {"name": this.details?.name, 'quantity':String(q), 'total': String(t), 'change': change, 'changePercent': this.changePercent, 'last': last};
    localStorage.setItem(this.ticker+'_P', JSON.stringify(quantityList));
  }
  var tickers_P = [];

  if(localStorage.getItem('tickers_P') === null){
    tickers_P.push(this.ticker);
    localStorage.setItem('tickers_P', JSON.stringify(tickers_P));
  }
  else{
    var exists = false;
    var tick = JSON.parse(localStorage.getItem('tickers_P'));
    for(var x =0; x< tick.length; x++){
      if(tick[x] == this.ticker){
        exists = true;
        break;
      }
    }
    if(exists == false){
      tick.push(this.ticker);
      tick.sort();
      localStorage.setItem('tickers_P', JSON.stringify(tick));
    }
  }
  callback();
}

closeX(callback){
  callback();
}

 swapImages(){
   var tickers = this.obj;//JSON.parse(localStorage.getItem('tickers'));
   if(tickers != null){
      for(var x = 0; x < tickers.length; x++){
        if(tickers[x] == this.ticker){
          this.isPresent = true;
          break;
        }
      }
   }
   if(this.isPresent){
     // this.stars[1].style.display = "block";
     // this.stars[2].style.display = "none";
     var index = this.obj.indexOf(this.ticker);
     if (index > -1) {
        this.obj.splice(index, 1);
     }
     if(this.obj.length > 0){
        localStorage.setItem('tickers_W', JSON.stringify(this.obj));
      }
      else{
        localStorage.removeItem('tickers_W');
      }
      localStorage.removeItem(this.ticker+'_W');
      this.isPresent = false;
      this._success.next(`${this.ticker.toUpperCase()} was removed from Watchlist`);
   }
   else {
     // this.stars[1].style.display = "none";
     // this.stars[2].style.display = "block";
     var tick: string = this.ticker;
     this.obj.push(tick);
     this.obj.sort();
     localStorage.setItem('tickers_W', JSON.stringify(this.obj));

     var thisTickersValues = {"name": this.details?.name, 'last': this.prices?.last, 'change':this.change, 'changePercent': this.changePercent};
     localStorage.setItem(String(this.ticker)+'_W', JSON.stringify(thisTickersValues));

     this.isPresent = true;
     this._success.next(`${tick.toUpperCase()} was added to Watchlist`);
   }
   // if (stars[1].style.display === "none" && stars[2].style.display == "block") {
   //   stars[1].style.display = "block";
   //   stars[2].style.display = "none";
   //   if(this.isPresent){
   //      var index = this.obj.indexOf(this.ticker);
   //      if (index > -1) {
   //        this.obj.splice(index, 1);
   //      }
   //      if(this.obj.length > 0){
   //        localStorage.setItem('tickers', JSON.stringify(this.obj));
   //      }
   //      else{
   //        localStorage.removeItem('tickers');
   //      }
   //      localStorage.removeItem('ticker'+ String(this.ticker))
   //      thisisPresent = false;
   //   }
   // }
   // else {
   //   stars[1].style.display = "none";
   //   stars[2].style.display = "block";
   //
   //   if(!this.isPresent){
   //     var tick: string = this.ticker;
   //     this.obj.push(tick);
   //     this.obj.sort();
   //     localStorage.setItem('tickers', JSON.stringify(this.obj));
   //     var thisTickersValues = {'name': this.details?.name, 'last': this.prices?.last, 'change':this.change,'changePercent': this.changePercent}
   //     localStorage.setItem('ticker'+ String(this.ticker), JSON.stringify(thisTickersValues));
   //   }
   // }

 }

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.ticker = params['ticker'];

    });
      this.getDetails();
      this.getHistoricalDetails();
      this.getTodayStock();
      //this.getMainChart();
      this.getNews();
      //setTimeout(()=>this.getTodayStock(),1000);
      this.obj = JSON.parse(localStorage.getItem('tickers_W')) || [];
      this._success.subscribe(message => this.successMessage = message);

      // this._success.pipe(debounceTime(5000)).subscribe(() => {
      //   if (this.selfClosingAlert) {
      //     this.selfClosingAlert.close();
      //   }
      // });

  };

  ngOnDestroy(): void{
    // console.log(typeof(this.sub_hist))
      // this.sub_hist.unsubscribe();
      // this.sub_charts.unsubscribe();
  }
}
