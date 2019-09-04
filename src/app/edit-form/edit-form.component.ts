import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { UsersService } from "../services/users.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PassValidator } from "../pass.validator";
import { FbAuthResponse, User, UserInfo, UserUpdate } from "../interfaces";
import { of, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-edit-form",
  templateUrl: "./edit-form.component.html",
  styleUrls: ["./edit-form.component.scss"]
})
export class EditFormComponent implements OnInit, OnDestroy {
  @ViewChild("formElement", { static: false })
  formRef: ElementRef;
  @ViewChild("cancelElement", { static: false })
  cancelRef: ElementRef;

  submitted = false;
  message: string;
  form: FormGroup;
  user: User;
  userAuthId: string;
  userDbId: string;
  uSub: Subscription;

  constructor(
    private auth: AuthService,
    public userService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userAuthId = this.auth.token;
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.userDbId = params.id;
          return this.userService.getById(params.id);
        })
      )
      .subscribe((user: UserInfo) => {
        this.user = {
          email: user.email,
          password: user.password
        };
        this.form = new FormGroup(
          {
            login: new FormControl(user.login, [
              Validators.required,
              Validators.minLength(6)
            ]),
            name: new FormControl(user.name, [Validators.required]),
            email: new FormControl(user.email, [
              Validators.required,
              Validators.email
            ]),
            password: new FormControl(user.password, [
              Validators.required,
              Validators.minLength(6)
            ]),
            retryPassword: new FormControl(user.password, [
              Validators.required,
              Validators.minLength(6)
            ])
          },
          { validators: PassValidator }
        );
      });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    const userInfo: UserInfo = {
      id: this.userDbId,
      login: this.form.value.login,
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.userAuthId = this.auth.token;

    this.uSub = this.userService
      .updateUserInfo(userInfo)
      .pipe(
        switchMap(res => {
          if (this.user.email !== userInfo.email) {
            const userEmail: UserUpdate = {
              idToken: this.userAuthId,
              email: this.form.value.email
            };
            return this.userService.updateUser(userEmail);
          } else if (this.user.password !== userInfo.password) {
            const userPassword: UserUpdate = {
              idToken: this.userAuthId,
              password: this.form.value.password
            };
            return this.userService.updateUser(userPassword);
          }
          return of({} as any);
        }),
        switchMap(res => {
          if (res.idToken) {
            this.userAuthId = res.idToken;
            if (this.user.password !== userInfo.password) {
              const userPassword: UserUpdate = {
                idToken: this.userAuthId,
                password: this.form.value.password
              };
              return this.userService.updateUser(userPassword);
            }
          }
          return of({} as any);
        })
      )
      .subscribe(res => {
        if (res.idToken) {
          this.userAuthId = res.idToken;
        }
        this.submitted = false;
        this.router.navigate([""]);
      });
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
    if (this.userAuthId !== this.auth.token) {
      const authToken: FbAuthResponse = {
        idToken: this.userAuthId
      };
      this.auth.setToken(authToken);
    }
  }

  cancel(e?: EventTarget) {
    if (
      e === this.formRef.nativeElement ||
      e === this.cancelRef.nativeElement
    ) {
      this.router.navigate([""]);
    }
  }
}
