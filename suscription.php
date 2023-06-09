<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="assets/images/favicon.ico">

    <link href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet">

    <title>TORQUE RACING S.A.S</title>

    <!-- Bootstrap core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Additional CSS Files -->
    <link rel="stylesheet" href="assets/css/fontawesome.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/owl.css">

  </head>

  <body>

    <!-- ***** Preloader Start ***** -->
    <div id="preloader">
        <div class="jumper">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>  
    <!-- ***** Preloader End ***** -->

    <!-- Header -->
    <header class="">
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.php"><h2><em>Torque Racing</em></h2></a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="index.php">Inicio
                      <span class="sr-only">(current)</span>
                    </a>
                </li> 
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Categorías</a>
                  <div class="dropdown-menu drp-menu-categorias"></div>
                </li>                
                <li class="nav-item"><a class="nav-link" href="about-us.php">Sobre Nosotros</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="goToShopping();">Carrito de compras(<span id="cntItems">0</span>)</a></li>
                <li class="nav-item pedidos"><a class="nav-link" href="my-orders.php">Mis pedidos</a></li>
                <li class="nav-item active"><a class="nav-link" href="login.php">Ingresar</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Page Content -->
    <div class="" style="">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="text-content">
              <!-- <h4>Lorem ipsum dolor</h4>
              <h2>Contact Us</h2> -->
            </div>
          </div>
        </div>
      </div>
    </div>   
    
    <div class="send-message">
      <div class="container">

        <div class="card" style="width:90%; margin: 0 auto;">
          <h5 class="card-header">Suscribirse</h5>
          <div class="card-body">
            <div class="col-md-12">
              <div class="contact-form">
                <div class="row" id="form-suscription">

                  <div class="row col-lg-12 col-md-12 col-sm-12">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <fieldset>
                        <input name="name" type="text" class="form-control" id="name" placeholder="Nombres*" autocomplete="off">
                      </fieldset>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <fieldset>
                        <input name="lastnames" type="text" class="form-control" id="lastnames" placeholder="Apellidos*" autocomplete="off">
                      </fieldset>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <fieldset>
                        <input name="identification" type="text" class="form-control" id="identification" placeholder="Identificación*" autocomplete="off">
                      </fieldset>
                    </div>
                  </div>

                  <div class="row col-lg-12 col-md-12 col-sm-12">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <fieldset>
                        <input name="email" type="text" class="form-control" id="email" placeholder="E-Mail*" autocomplete="off">
                      </fieldset>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <fieldset>
                        <select name="dptos" class="form-control" id="dptos" placeholder="Departamentos*" ></select>
                      </fieldset>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <fieldset>
                        <select name="cities" class="form-control" id="cities" placeholder="Ciudades*"></select>
                      </fieldset>
                    </div>
                  </div>

                  <div class="row col-lg-12 col-md-12 col-sm-12">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <fieldset>
                        <input name="direction" type="text" class="form-control" id="direction" placeholder="Dirección*" autocomplete="off">
                      </fieldset>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <fieldset>
                        <input name="telephone" type="text" class="form-control" id="telephone" placeholder="Teléfono*" autocomplete="off">
                      </fieldset>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <fieldset>
                        <input name="cellphone" type="text" class="form-control" id="cellphone" placeholder="Celular*" autocomplete="off">
                      </fieldset>
                    </div>
                  </div>

                  <div class="col-lg-6">
                    <fieldset>
                      &nbsp;
                    </fieldset>
                  </div>
                  <div class="col-lg-6 text-right">
                    <fieldset>
                      <a href="#" class="btn btn-primary" id="subscribe" onclick="suscribirse()">Suscribirse</a>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="inner-content">
              <p>Copyright © 2023 Torque Racing S.A.S</p>
            </div>
          </div>
        </div>
      </div>
    </footer>


    <!-- Bootstrap core JavaScript -->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.5.2/bootbox.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/mgalante/jquery.redirect@master/jquery.redirect.js"></script>

    <!-- Additional Scripts -->
    <script src="assets/js/custom.js"></script>
    <script src="assets/js/owl.js"></script>
    <script src="assets/js/general.js"></script>
    <script src="assets/js/generalcategorias.js"></script>
    <script src="assets/js/suscription/suscription.js"></script>
  </body>

</html>
