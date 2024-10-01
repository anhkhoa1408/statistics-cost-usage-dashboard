import { Component, EventEmitter, Output } from '@angular/core';
import { doc, Firestore, Timestamp } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { forkJoin, take } from 'rxjs';
import { CostService } from '../../../../services/cost.service';
import { PurposeService } from '../../../../services/purpose.service';
import { UserService } from '../../../../services/user.service';
import { Purpose } from '../../../../types/purpose.type';
import { User } from '../../../../types/user.type';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cost-addition',
  templateUrl: './cost-addition.component.html',
  styleUrl: './cost-addition.component.scss',
})
export class CostAdditionComponent {
  @Output() toggleSidenavEmitter: EventEmitter<undefined> = new EventEmitter();

  maxDate = new Date();

  users: User[] = [];
  purposes: Purpose[] = [];

  addCostForm = this.formBuilder.group({
    date: [new Date(), Validators.required],
    amount: ['', Validators.required],
    type: ['', Validators.required],
    purpose: ['', Validators.required],
    payer: [''],
  });

  costsType = ['Budget', 'Debit'];

  payer = [
    {
      value: 'budget',
      label: 'Budget',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly costService: CostService,
    private readonly purposeService: PurposeService,
    private readonly firestore: Firestore,
    private currencyPipe: CurrencyPipe
  ) {
    forkJoin([
      this.userService.getAllUsers().pipe(take(1)),
      this.purposeService.getAllPurposes().pipe(take(1)),
    ]).subscribe(([users, purposes]) => {
      this.users = users;
      this.purposes = purposes;
    });
  }

  formatCurrency() {
    const amountValue = this.addCostForm.get('amount')?.value;

    if (amountValue) {
      const formattedValue =
        this.currencyPipe.transform(amountValue, 'VND', '', '1.0-0') || '';

      // Manually update the input field in the template with the formatted value
      const inputElement = document.querySelector(
        '#amount'
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = formattedValue; // Update view with formatted value
      }
    }
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value || '0';
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    this.addCostForm.patchValue({
      amount: inputValue,
    });
    this.formatCurrency();
  }

  submit() {
    if (!this.addCostForm.valid) {
      toast.error('Please fill in all the fields below!', {
        position: 'top-center',
        duration: 1000,
      });
      return;
    }

    const {
      amount = 1000,
      purpose = '',
      payer = '',
      type = 'Budget',
    } = this.addCostForm.value;

    const timeStampDate = Timestamp.fromDate(
      this.addCostForm.value.date || new Date()
    );

    this.costService.createCost({
      amount: Number(amount) || 1000,
      payer: payer ? doc(this.firestore, 'users', payer) : null,
      purpose: purpose ? doc(this.firestore, 'purposes', purpose) : null,
      type: type || 'Budget',
      date: timeStampDate,
    });

    this.toggleSidenavEmitter.emit();
    this.addCostForm.reset();
    const inputElement = document.querySelector('#amount') as HTMLInputElement;
    inputElement.value = '';

    toast.success('Add cost successfully!', {
      duration: 1000,
    });
  }
}
