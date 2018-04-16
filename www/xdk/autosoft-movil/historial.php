<!doctype html>
<html>
<?php include('head.php');	?>

<body>
<div id="wrapper">
  <?php include('header.php');	?>
  <main id="main" role="main" class="fondo-blanco">
    <div id="" class=" container-flow ">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12"> 
			<!--<figure class="col-sm-12 col-md-1 col-lg-1 margin-v-sm text-center">
				<img class="img-responsive margin-center" src="img/logo-bosh.jpg" alt="marca">
			</figure>
			<div class="col-sm-12 col-md-11 col-lg-11 ">
				<h1 class="text-blanco sombra-text text-center">App Recepción de Vehículos</h1>
			</div>-->
          <div class="col-md-3 col-lg-2 "></div>
             <div class="col-sm-12 col-md-6 col-lg-6 margin-v-lg">
            <form id="form-cliente" action="" class="form-group">
             
              <div class="margin-v-sm input-group"> <span class="input-group-addon">Fecha taller</span>
                <input type="text" class="form-control" placeholder="16/08/17">
              </div>
              <div class="margin-v-sm input-group"> <span class="input-group-addon">Fecha atención</span>
                <input type="text" class="form-control" placeholder="16/08/17">
              </div>
              <div class="margin-v-sm input-group"> <span class="input-group-addon">Precio</span>
                <input type="text" class="form-control" placeholder="$100.00">
              </div>
              
              <div class="margin-v-sm text-right ">
                <button class="btn btn-color-marca"><i class="fa fa-search"> </i> Buscar</button>
              </div>
            </form>
          </div>
        </div>
                  <div class="col-sm-12 col-md-12 col-lg-12"> 

          <div class="list-group"> <a href="#" class="list-group-item"><i class="fa fa-check-circle color-verde"></i> Chasis</a> <a href="#" class="list-group-item"><i class="fa fa-times-circle color-rojo"></i> Motor</a> <a href="#" class="list-group-item"><i class="fa fa-exclamation-circle color-amarillo"></i> Suspensión</a> <a href="#" class="list-group-item"><i class="fa fa-ban color-gris"></i> Frenos</a> </div>
          </div>
      </div>
    </div>
  </main>
</div>
<?php include('js.php');	?>
</body>
</html>