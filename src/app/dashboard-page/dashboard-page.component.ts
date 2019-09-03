import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Subject, Subscription } from "rxjs";
import { UserInfo } from "../interfaces";
import { UsersService } from "../services/users.service";
import { filter, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-dashboard-page",
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.scss"]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    public auth: AuthService,
    private usersService: UsersService
  ) {}

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(["/login"]);
  }

  users: UserInfo[] = [];
  userEmail: string;
  pSub: Subscription;
  dSub: Subscription;
  searchStr = "";
  destroyed = new Subject<any>();

  ngOnInit() {
    this.userEmail = localStorage.getItem("user-email");
    this.pSub = this.usersService.getAll().subscribe(users => {
      this.users = users;
    });

    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.destroyed)
      )
      .subscribe(() => {
        this.usersService.getAll().subscribe(users => {
          this.users = users;
        });
      });
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
    if (this.dSub) {
      this.dSub.unsubscribe();
    }
    this.destroyed.next();
    this.destroyed.complete();
  }
}
