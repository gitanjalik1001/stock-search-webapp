import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockTickerBoxComponent } from './stock-ticker-box/stock-ticker-box.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import {DetailsComponent} from './details/details.component';

const routes: Routes = [
   { path: '', component: StockTickerBoxComponent },
   {path: 'details/:ticker', component : DetailsComponent},
   {path: 'watchlist', component: WatchlistComponent },
   {path: 'portfolio', component : PortfolioComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
