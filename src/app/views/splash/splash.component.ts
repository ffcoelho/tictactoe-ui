import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InitializerService } from '../../services/initializer.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

  assetsLoaded: boolean;

  constructor(private router: Router,
              private initSvc: InitializerService) { }

  ngOnInit(): void {
    this.initSvc.start().then(() => {
      this.assetsLoaded = true;
      this.navigateUser();
    });
  }

  navigateUser(): void {
    setTimeout(() => {
      this.router.navigateByUrl('/home');
    }, 4200);
  }

}
