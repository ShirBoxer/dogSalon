import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder,FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
     private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.intitializeForm();
  }


  intitializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, 
        Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword:new FormControl ('', [Validators.required, this.matchValues('password')]),
      phonenum:new FormControl ('', [Validators.required,Validators.pattern("[0]{1}[5]{1}[0-9]{8}")]),
      firstName:new FormControl ('', Validators.required)

    });
    //TODO DELETE?
    this.registerForm.controls.password.valueChanges.subscribe(()=> {
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
      //TODO change the page to cleann with ask to log in
      this.cancel();
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
