import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http'
import { switchMap } from 'rxjs/operators';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router } from '@angular/router';
//import { Subscription } from 'rxjs';
//import {Observable} from "rxjs";

@Component({
  selector: 'app-stock-ticker-box',
  templateUrl: './stock-ticker-box.component.html',
  styleUrls: ['./stock-ticker-box.component.css']
})
export class StockTickerBoxComponent implements OnInit{
  //
  constructor(private router: Router) {}
  myControl = new FormControl();
  ticker : string='';
  options: string[] = [];
  valid: boolean = false;
  // //router: Router;
  // setTicker(stock : string){
  //   this.ticker = stock;
  // }
    ngOnInit(): void {
    }
  getDescription(stock : string){
    if(stock != ""){
      this.router.navigate(['/details', stock]);
    }
    else{
      this.valid = true;
    }

  }


  // search(){
  //   this.ticker = this.getTicker();
  //   console.log(this.ticker);
  //   return this.http.get('http://localhost:8080/api/tickerSearch/' + this.ticker)
  //       .pipe(
  //           debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
  //           switchMap(
  //               (data: any) => {
  //                   return (
  //                       data.length != 0 ? data as any[] : [{"Ticker Name": "No Record Found"} as any]
  //                   );
  //               }
  //       ).subscribe()
  //     );
  //   }
  //  this.options = this.search()

}
  // ticker : string = document.getElementById("stock-search").innerText;
  // filteredStates: Subscription;
  //
