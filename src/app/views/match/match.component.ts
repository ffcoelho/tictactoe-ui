import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit, OnDestroy {

  private subscription: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private socketSvc: SocketService) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.socketSvc.setInvite(params.id);
      this.router.navigateByUrl('/');
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
