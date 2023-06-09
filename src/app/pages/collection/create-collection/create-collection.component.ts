import { AlertService } from 'src/app/services/alert.service';
import { IAlert } from './../../../models/alert';
import { ICollection } from './../../../models/collection';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CollectionService } from './../../../services/collection.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ERROR, SUCCESS } from 'src/app/common/alert-state';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent implements OnInit {
  collectionCreateForm!: FormGroup;
  alertMessage!: IAlert;
  collection: ICollection = {
    name: '',
    accountable: '',
    season: '',
    brand: '',
    budget: 0,
    release: ''
  }

  constructor(private router: Router, private collectionService: CollectionService, private alertService: AlertService) {

  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.collectionCreateForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      accountable: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      season: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      brand: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      budget: new FormControl(null, [Validators.required, Validators.min(0)]),
      release: new FormControl(null, [Validators.required, Validators.min(new Date().getFullYear()), Validators.minLength(4)]),
    });
  }

  get name() {
    return this.collectionCreateForm.get('name');
  }

  get accountable() {
    return this.collectionCreateForm.get('accountable');
  }

  get season() {
    return this.collectionCreateForm.get('season');
  }

  get brand() {
    return this.collectionCreateForm.get('brand');
  }

  get budget() {
    return this.collectionCreateForm.get('budget');
  }

  get release() {
    return this.collectionCreateForm.get('release');
  }

  createCollection(): Boolean {
    const collection = this.createObjectCollection();

    try {
      this.collectionService.createCollection(collection).subscribe({
        next: (r) => this.collectionSuccessAlert(r),
        error: (e) => this.collectionErrorAlert(),
      })
    } catch (error) {
      this.collectionErrorAlert();
      return false;
    }
    this.collectionCreateForm.reset();
    return true;
  }

  createObjectCollection(): ICollection {
    return {
      name: this.name?.value,
      accountable: this.accountable?.value,
      season: this.season?.value,
      brand: this.brand?.value,
      budget: this.budget?.value,
      release: this.release?.value
    }
  }

  onSubmit(): void {
    if (this.collectionCreateForm.valid) {
      this.createCollection();
    } else {
      this.blankInputsErrorAlert();
    }
  }

  cancel(): void {
    this.router.navigate(['/collections']);
  }

  collectionSuccessAlert(result: any): void {
    if (result.name) {
      this.alertMessage = {
        title: '',
        message: 'Coleção cadastrada com sucesso!',
        typeAlert: SUCCESS,
      }
      this.alertService.showGenericAlert(this.alertMessage);
    } else {
      this.alertMessage = {
        title: 'Ocorreu um erro ao cadastrar uma Coleção',
        message: 'Entrar em contato com o administrador do sistema.',
        typeAlert: ERROR,
      }
    }
  }

  collectionErrorAlert(): void {
    this.alertMessage = {
      title: 'Ocorreu um erro ao cadastrar uma Coleção',
      message: 'Entrar em contato com o administrador do sistema.',
      typeAlert: ERROR,
    };
    this.alertService.showGenericAlert(this.alertMessage);
  }

  blankInputsErrorAlert(): void {
    this.alertMessage = {
      title: '',
      message: 'Preencha os campos',
      typeAlert: ERROR,
    };
    this.alertService.showGenericAlert(this.alertMessage);
  }
}
