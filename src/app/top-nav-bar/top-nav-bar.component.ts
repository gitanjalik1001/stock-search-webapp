import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css']
})
export class TopNavBarComponent implements OnInit {

  constructor() { }
myFunction() {
var x = document.getElementById("navbar_id");
if (x.className === "navbar") {
  x.className += " responsive";
} else {
  x.className = "navbar";
}
}


  ngOnInit(): void {

  }

}
