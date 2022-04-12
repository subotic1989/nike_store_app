import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CartService } from '@app/pages/service/cart.service';
import { ProductInterface } from '@app/pages/types/product.interface';
import { markFormGroupTouched } from '@app/shared/utils/form.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
})
export class SingleProductComponent implements OnInit {
  product: ProductInterface;
  indexImg: number = 0;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.initListener();
    this.initForm();
  }

  initListener() {
    this.route.params.subscribe((params: Params) => {
      this.afs
        .collection<any>('new-collection')
        .doc(params['name'])
        .valueChanges({ idField: 'eventId' })
        .subscribe((product: ProductInterface) => {
          this.product = product;
        });
    });
  }

  onShowImage(indexImg: number) {
    this.indexImg = indexImg;
  }

  onAddToCart(product: ProductInterface) {
    console.log(product);
  }

  initForm() {
    this.form = this.fb.group({
      size: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
      quantity: [
        null,
        {
          updateOn: 'change',
          validators: [Validators.required],
        },
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      let id = new Date().getTime();
      let { size, quantity } = this.form.value;
      let order = {
        ...this.product,
        id: id,
        size: size,
        quantity: quantity,
        total: this.product.price * +quantity,
      };
      this.cartService.addToCart(order);
    } else {
      markFormGroupTouched(this.form);
    }
  }
}
