import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisesSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup= this.fb.group({
    region: ['', Validators.required ],
    pais: ['', Validators.required ],
    frontera: ['', Validators.required ]
  })

  // llenar selectores
  regiones: string[] = [];
  paises: PaisesSmall[] = [];
  fronteras: string[] = [];

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // Cuando cambia la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('pais')?.reset('');
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
      )
      .subscribe( paises => {
        this.paises = paises;
      })

      // Cuando cambie el pais
      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( ()=> {
            this.fronteras = [];
            this.miFormulario.get('frontera')?.reset('');

          }),
          switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ))
        )
        .subscribe( pais => {
          this.fronteras = pais?.borders || [];
        })

      

  }

  guardar() {
    console.log(this.miFormulario.value);
  }

}
