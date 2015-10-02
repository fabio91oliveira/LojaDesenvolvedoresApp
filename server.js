// Declarando variáveis
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('historicoPedidos', ['historicoPedidos']);
var bodyParser = require('body-parser');


// Requisitando acesso a pasta public através do express
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


// Trazendo a lista de desenvolvedores
app.get('/historicoPedidos', function (req, res) {
  console.log('LOG: Requisição GET Recebida.');
  db.historicoPedidos.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

// Inserção de novo pedido ao histórico
app.post('/historicoPedidos', function (req, res) {
    console.log("LOG: Requisição POST Recebida.");
  db.historicoPedidos.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

// Rodar servidor
app.listen(3000);
console.log("Servidor está rodando na porta 3000.");
