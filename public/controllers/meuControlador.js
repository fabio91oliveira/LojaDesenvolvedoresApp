// Iniciando Angular
var myApp = angular.module("meuApp", []);
myApp.controller("meuControlador", ['$scope', '$http', function($scope, $http) {

// Declaração de variáveis de escopo
  $scope.listaDesenvolvedores = [];
  $scope.pedido = [];
  $scope.totalCarrinho = 0;
  $scope.totalComDesconto = 0;

// Método para adicionar desenvolvedor ao carrinho de compras
  $scope.adicionarDesenvolvedor = function (desenvolvedor) {
   console.log('LOG: Adicionando desenvolvedor ao carrinho de compras.');
    // Verifica se já existe no carrinho
   if(!$scope.verificarUsuarioExistente(desenvolvedor)){
     // Adicionar desenvolvedor a lista
     $scope.listaDesenvolvedores.push(angular.copy(desenvolvedor));
     //Faz o somatório de todos os preços e adiciona o total ao carrinho
     $scope.totalCarrinho = $scope.totalCarrinho + ($scope.desenvolvedor.preco * $scope.desenvolvedor.hora);
     // Remove os dados do escopo da variável
     delete $scope.desenvolvedor;
     // Validação para desabilitar o botão Adicionar no FrontEnd
     $scope.isRetornoTrue = false;
     $scope.refreshTotal();
     console.log('LOG: Desenvolvedor adicionado ao carrinho.');
    }
    else{
      alert('O usuário já consta no carrinho de compras!');
      console.log('LOG: Não foi possível adicionar ao carrinho.');
    }
  };

// Método para verificar se já existe usuário no carrinho de compras
 $scope.verificarUsuarioExistente = function(desenvolvedor){
   console.log('LOG: Verificando usuário existente.');
   var isExistente = false;
   for(var i = 0; i < $scope.listaDesenvolvedores.length; i++){
     if(desenvolvedor.id == $scope.listaDesenvolvedores[i].id){
       isExistente = true;
    }
  }
  return isExistente;
};

// Método para remover desenvovledor do carrinho de compras
  $scope.removerDesenvolvedor = function (listaDesenvolvedores) {
    console.log("LOG: Removendo usuário do carrinho.");
    // Lógico que diz quando o desenvovledor é diferente de selecionado
    // e então retorna todos eles, fazendo com que remova os selecionados do carrinho
    $scope.listaDesenvolvedores = listaDesenvolvedores.filter(function (desenvolvedor) {
      if (!desenvolvedor.selecionado)  return desenvolvedor;
    });
    $scope.refreshTotal();
    console.log('LOG: Adicionando desenvolvedor ao carrinho de compras.');
  };

// Validação para habilitar o botão remover desenvolvedor quando algum for selecionado
  $scope.isDesenvolvedorSelecionado = function (listaDesenvolvedores) {
    return listaDesenvolvedores.some(function (desenvolvedor) {
      return desenvolvedor.selecionado;
    });
  };

  // Retorna dados da API do gitHub
  $scope.pesquisarDesenvolvedor = function() {
    console.log("LOG: Pesquisando...");
    $http.get('https://api.github.com/users/'+$scope.desenvolvedor.login).success (function(data){
      // Se retornar dados, habilita o botão adicionar
      $scope.isRetornoTrue = true;
      $scope.desenvolvedor = data;
      $scope.desenvolvedor.preco = (data.followers +1) * 2 + (data.public_repos +1) * 2;
      $scope.desenvolvedor.hora = 1;
      $scope.desenvolvedor.precoFinal = $scope.desenvolvedor.preco;
      console.log("LOG: Usuário encontrado.");
    }).error(function () {
      console.log("LOG: Usuário não encontrado.");
      alert("Usuário não existente. Tente Novamente!");
      $scope.isRetornoTrue = false;
      });
  };

  // Método para validar cupom de desconto
  $scope.validarCupom = function(){
    $scope.refreshTotal();
    if($scope.cupom.toUpperCase() === 'SHIPIT'){
      console.log("LOG: Cupom validado.");
      $scope.totalCarrinho = $scope.totalCarrinho / 100 * 90 ;
    }
    else{
      console.log("LOG: Cupom inválido.");
      alert('Cupom Inválido!');
    }
  };

// Método para atualizar preço dinamicamente
  $scope.refreshTotal = function(){
    $scope.totalCarrinho = 0;
    for(var i = 0; i < $scope.listaDesenvolvedores.length; i++){
      $scope.totalCarrinho = $scope.totalCarrinho + ($scope.listaDesenvolvedores[i].preco * $scope.listaDesenvolvedores[i].hora);
    }
  };

  // Método para inserir preco total a pedido
  var inserirPrecoTotal = function(){
  console.log("LOG: Validando total do pedido.");
  $scope.listaDesenvolvedores.push({'precoTotal' : $scope.totalCarrinho});
  console.log("LOG: Total do pedido validado.");
  };

// Listando Histórico de Pedidos
var refresh = function() {
  $http.get('/historicoPedidos').success(function(response) {
  console.log("LOG: Atualizando página.");
  $scope.refreshTotal();
	$scope.historicoPedidos = response;
    $scope.historico = "";
  });
};

// Chama atualização de pedidos do banco
refresh();


// Função para atualizar subtotal
$scope.atualizarSubTotal = function(listaDesenvolvedores){
      for(var i = 0; i < $scope.listaDesenvolvedores.length; i++){
        $scope.listaDesenvolvedores[i].precoFinal = $scope.listaDesenvolvedores[i].preco * $scope.listaDesenvolvedores[i].hora;
      }
      $scope.refreshTotal();
    };


// Limpa lista de desenvolvedores
var limparLista = function() {
  $scope.listaDesenvolvedores = [];
}

// Recarrega página ao inserir
var recarregar = function(){
setTimeout(location.reload(),2000)
}

// Finaliza pedido e insere no banco
$scope.finalizarPedido = function() {
    $scope.pedido.push({'pedido' : $scope.listaDesenvolvedores, 'precoTotal': $scope.totalCarrinho});
    $http.post('/historicoPedidos', $scope.pedido).success(function(response) {
    console.log("LOG: Pedido Finalizado.");
    limparLista();
    recarregar();
    alert('Pedido Finalizado!');
  }).error(function () {
    console.log("LOG: Error ao tentar gravar no banco!");
    alert("Erro ao gravar no banco! Verifique a conexão com o mesmo!");
    });;
};
}]);﻿
