import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import {Subject} from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  constructor(private modalService: NgbModal,private dataService: DataService ) {}
  displayElements: boolean;
  tickerDetails: any[]= [];
  tickers:string[] = [];
  quantityBox : string;
  closeResult = '';
  currentPrice: any;
  total : number;
  private storageSub= new Subject<string>();
 currentPrice_sell : any;
  formulatePortfolio(){
    if(localStorage.getItem('tickers_P') != null){
      var tickerList = JSON.parse(localStorage.getItem('tickers_P'));
      for(var x = 0; x < tickerList.length; x++){
        this.tickers[x] = tickerList[x];
      }
      for(var x = 0; x < tickerList.length; x++){
          var oneTickerList = JSON.parse(localStorage.getItem(this.tickers[x]+'_P'));
          oneTickerList.ticker = this.tickers[x];
          this.tickerDetails.push(oneTickerList);
      }
    }

  }

  watchStorage(): Observable<any> {
   return this.storageSub.asObservable();
 }

  showBuyModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'buyModal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    }
  showSellModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'sellModal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    }

 closeX(callback){
   callback();
 }

 closeBuy(callback, ticker){
   var quantity:string = String(this.quantityBox);
   this.dataService.getHistoricalTickerDetails(ticker).subscribe(data => {
       this.currentPrice = data[0];
       this.total = Number(this.currentPrice?.last) * Number(quantity);
       var ticker_list = JSON.parse(localStorage.getItem(ticker+'_P'));
       ticker_list['last'] = this.currentPrice?.last;
       ticker_list['quantity'] = Number(ticker_list['quantity']) + Number(quantity);
       ticker_list['total'] = Number(ticker_list['total']) + this.total;
       ticker_list['change'] = Number(this.total)/Number(quantity) - Number(this.currentPrice?.last);
       this.tickerDetails = ticker_list;
      // console.log(localStorage.getItem(ticker+'_P'));
       localStorage.setItem(ticker+'_P', JSON.stringify(this.tickerDetails));
       this.storageSub.next('added');
     });
   callback();
 }

 closeSell(callback, ticker){
   var quantity:string = String(this.quantityBox);
   this.dataService.getHistoricalTickerDetails(ticker).subscribe(data => {
       this.currentPrice_sell = data[0];
       this.total = Number(this.currentPrice_sell?.last) * Number(quantity);
       var avg = Number(this.total)/ Number(quantity);
       var ticker_list = JSON.parse(localStorage.getItem(ticker+'_P'));
       ticker_list['last'] = this.currentPrice_sell?.last;
       ticker_list['quantity'] = Number(ticker_list['quantity']) - Number(quantity);
       ticker_list['total'] = Number(ticker_list['total']) - avg;
       ticker_list['change'] = Number(this.total)/Number(quantity) - Number(this.currentPrice_sell?.last);
       this.tickerDetails = ticker_list;

       if(Number(ticker_list['quantity']) > 0){
         localStorage.setItem(ticker+'_P', JSON.stringify(this.tickerDetails));
         this.storageSub.next('added');
       }
       else if(Number(ticker_list['quantity']) <= 0){
         localStorage.removeItem(ticker+'_P');
         var list = JSON.parse(localStorage.getItem('tickers_P'));
         var index = list.indexOf(ticker);
         if(index > -1){
           list.splice(index , 1);
         }
        if(list.length > 0){
         localStorage.setItem('tickers_P', JSON.stringify(list));
        }
        else{
          localStorage.removeItem('tickers_P');
        }
       }

     });
   callback();
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
    if(localStorage.getItem("tickers_P") === null){
          this.displayElements = false;
    }
    else{
      this.displayElements = true;
    }

    this.formulatePortfolio();
  }

}
