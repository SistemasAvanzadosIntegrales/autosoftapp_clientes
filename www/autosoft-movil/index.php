<!doctype html>
<html>
<?php include('head.php');	?>

<body>
	<div id="wrapper">
		<?php include('header.php');	?>
		<main id="main" role="main">
			<div id="" class=" container-flow ">
				<div class="row">
					<div class="col-sm-12 col-md-12 col-lg-12 ">
						<figure class="col-sm-12 col-md-1 col-lg-1 margin-v-sm text-center">
							<img class="img-responsive margin-center" src="img/logo-bosh.jpg" alt="marca">
						</figure>

						<div class="col-sm-12 col-md-11 col-lg-11 ">
							<h1 class="text-blanco sombra-text text-center">Bienvenido Juan Pérez</h1>
						</div>
						<div class="col-sm-12 col-md-12 col-lg-12 text-center margin-v-md">
							<div class="panel panel-default">
								<div class="col-sm-12 col-md-12 col-lg-12 panel-heading">
									<div class="col-md-3 margin-v-sm">
										<select class="form-control  selectpicker">
											<option>Opción 01</option>
											<option>Opción 02</option>
										</select>
									</div>
									<div class="col-md-3 margin-v-sm text-right">
										<div class="input-group">
											<input type="text" class="form-control" placeholder="Buscar">
											
											<span class="input-group-btn">
												<button class="btn btn-default pull-right" type="button"><i class="fa fa-search text-color-marca"> </i></button>
		      								</span>
										</div>
									</div>
									<div class="col-md-6 text-right margin-v-sm">
										<button class="btn-default btn"><i class="fa fa-refresh text-color-marca"> </i> Actualizar</button>
										<button class="btn-default btn"><i class="fa fa-plus text-color-marca"> </i> Nuevo Servicio</button>
									</div>
								</div>
								<div class="panel-body padding-0">
									<table class="table table-responsive table-striped table-bordered">
										<thead class="margin-0">
											<tr>
												<th>Órden de servicio</th>
												<th>Vehículo</th>
												<th>Placas</th>
												<th>Cliente</th>
												<th>Servicio</th>
												<th>Asesor</th>
												<th>Estatus</th>
												<th>Opciones</th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
								<div class="panel-footer"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
		<?php include('footer.php');	?>
	</div>
	<?php include('js.php');	?>
</body>

</html>