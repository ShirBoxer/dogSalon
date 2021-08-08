import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR, RequiredValidator } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
  providers:[
    {
      provide: NgControl,
      useExisting: TextInputComponent
    }
  ]
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label!: string;
  @Input() type = 'text';

  constructor(@Self() public ngControl: NgControl) { 
    ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }



}
