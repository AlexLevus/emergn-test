import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { User, UserInfo } from "../interfaces";
import { UsersService } from "../services/users.service";
import { PassValidator } from "../pass.validator";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"]
})
export class UserFormComponent implements OnInit {
  @ViewChild("formElement", { static: false })
  formRef: ElementRef;
  @ViewChild("cancelElement", { static: false })
  cancelRef: ElementRef;

  submitted = false;
  message: string;
  form: FormGroup;
  constructor(
    public auth: AuthService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup(
      {
        login: new FormControl(null, [
          Validators.required,
          Validators.minLength(6)
        ]),
        name: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6)
        ]),
        retryPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6)
        ])
      },
      { validators: PassValidator }
    );
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    const userInfo: UserInfo = {
      login: this.form.value.login,
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.auth.registr(user).subscribe(
      () => {
        this.auth.login(user).subscribe(() => {
          this.router.navigate([""]);
        });
        this.userService.create(userInfo).subscribe(() => {});
        this.submitted = false;
      },
      () => {
        this.submitted = false;
      }
    );
  }

  cancel(e?: EventTarget) {
    if (
      e === this.formRef.nativeElement ||
      e === this.cancelRef.nativeElement
    ) {
      this.router.navigate(["/login"]);
    }
  }
}
