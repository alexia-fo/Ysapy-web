import { Component } from '@angular/core';
import {Validators, FormGroup,FormBuilder} from '@angular/forms';
import { Router} from '@angular/router';
import { AlertifyService } from 'src/app/utilidades/servicios/mensajes/alertify.service';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { Perfil, RespuestaPerfil } from '../../modelos/autentificacion';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  //controladores agrupados del formulario
  form!:FormGroup;
  //--
  mensaje='';

  constructor(
    //inyecciones de dependencias
    private formBuilder:FormBuilder,
    private router:Router,
    private authService:AutentificacionService,
    private mensajeAlertify: AlertifyService,
  ) {}

  ngOnInit(): void {
    //construimos el controlador del formulario
    this.form=this.formBuilder.group({
      correo: ['',[Validators.required]],
      contra: ['',[Validators.required]],
    });
  }

  login(){
    console.log("Login")

    if(this.form.valid){
      this.authService.ingresarRetornarPerfil(this.form.get('correo')?.value, this.form.get('contra')?.value)
      .subscribe({
        next:(respuesta:RespuestaPerfil)=>{        
          
          if(this.authService.usuario.Rol.rol=="ROOT"){
            this.mensaje="Root";
          }else if(this.authService.usuario.Rol.rol=="ADMINISTRACION"){
            this.mensaje="Administrador";
          }else if(this.authService.usuario.Rol.rol=="FUNCIONARIO"){
            this.mensaje="Funcionario";
          }else if(this.authService.usuario.Rol.rol=="CLIENTE"){
            this.mensaje="Cliente";
          }else{
            this.mensaje="Rol no definido";
          }

          this.mensajeAlertify.mensajeExito(
            `Has ingresado como ${this.mensaje}`
          );
          
          this.router.navigate(['/autentificacion/perfil']); 
        },
        error:(errores: string[])=>{
          errores.forEach((error: string) => {
            this.mensajeAlertify.mensajeError(error);
          });
        }
      })
    }else{
      this.form.markAllAsTouched();
    }
  }  
   
  isInvalid(field:string){
   let valido=(this.form.get(field)?.touched || this.form.get(field)?.dirty) && this.form.get(field)?.invalid;
   let input = document.getElementById(field);
    if(valido){
      input?.classList.add("is-invalid");
    }else{
      input?.classList.remove("is-invalid");
    }
    return valido;
  }

  mensajeError(campo:string): string{
    let mensaje="";
    if(this.form.get(campo)?.hasError('required')){
      if(campo=="correo"){
        mensaje="El correo es requerido !!";
      }else if(campo=="contra"){
        mensaje="La contraseña es requerida !!";
      }
    }
    return mensaje;
  }

  invalidarCampos(){
    let inputUsuario = document.getElementById("correo");
    inputUsuario!.className += " is-invalid";

    let inputContrasena = document.getElementById("contra");
    inputContrasena!.className += " is-invalid";
  }

}
