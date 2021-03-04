import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StockTickerBoxComponent } from './stock-ticker-box/stock-ticker-box.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TopNavBarComponent } from './top-nav-bar/top-nav-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DetailsComponent } from './details/details.component';
import { FooterComponent } from './footer/footer.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { DataService } from './data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    StockTickerBoxComponent,
    TopNavBarComponent,
    DetailsComponent,
    FooterComponent,
    PortfolioComponent,
    WatchlistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    NgbModule,
    HttpClientModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    HighchartsChartModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})


export class AppModule { }
