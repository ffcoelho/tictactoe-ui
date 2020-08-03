import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InitializerService } from '../../services/initializer.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

  assetsLoaded = false;

  constructor(private router: Router,
              private initSvc: InitializerService) { }

  ngOnInit(): void {
    this.initSvc.start().then(() => {
      console.log('A');
      this.assetsLoaded = true;
      this.navigateUser();
    });
  }

  navigateUser(): void {
    console.log('B');
    setTimeout(() => {
      console.log('C');
      this.router.navigateByUrl('/home');
    }, 3500);
  }

}
