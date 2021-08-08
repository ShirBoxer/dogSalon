import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder,FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  registerForm!: FormGroup;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService,
     private toastr: ToastrService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.intitializeForm();
  }


  intitializeForm() {
    this.registerForm = new FormGroup({
      UserName: new FormControl('', Validators.required),
      Password: new FormControl('', [Validators.required, 
        Validators.minLength(4), Validators.maxLength(8),
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$")]),
      confirmPassword:new FormControl ('', [Validators.required, this.matchValues('Password')]),
      PhoneNum:new FormControl ('', [Validators.required,Validators.pattern("[0]{1}[5]{1}[0-9]{8}")]),
      FirstName:new FormControl ('', Validators.required)

    });
    this.registerForm.controls.Password.valueChanges.subscribe(()=> {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      if(control?.value == '') return {isMatching: false}
      return control?.value === this.registerForm.get(matchTo)?.value
        ? null : { isMatching: true }
    }
  }

  register(){
    this.accountService.register(this.registerForm?.value).subscribe(response => {
      this.router.navigateByUrl('/main');
    }, error =>{
      this.validationErrors = error;
      //TODO delete?
      console.log(error);
      this.toastr.error(error.error);
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
