const express = require('express');
const { Pool } = require('pg');


const app = express();
const PORT = 4000;

app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'joaorocha',
  password: 'ds564',
  port: 7007,
});


function escolherPatrono(patrono) {

  var animais = [
    "Leão",
    "Tigre",
    "Elefante",
    "Girafa",
    "Urso",
    "Rinoceronte",
    "Hipopótamo",
    "Crocodilo",
    "Lobo",
    "Leopardo",
    "Pantera",
    "Zebra",
    "Cobra",
    "Águia",
    "Falcão",
    "Coruja",
    "Lince",
    "Orangotango",
    "Gorila",
    "Jaguar"];

  var indiceAleatorio = Math.floor(Math.random() * animais.length);

  var animalSelecionado = animais[indiceAleatorio];

  patrono = animalSelecionado;

  return patrono;
}


// buscar todos os bruxos

app.get('/bruxos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM bruxos');
    res.json({
      total: resultado.rowCount,
      bruxos: resultado.rows
    })
  } catch (error) {
    console.log({ erro: error });
    res.status(400).send({ mensagem: 'Obteve FALHA na tentativa de buscar todos os bruxos' });
  }
});



// buscar bruxos por ID

app.get('/bruxos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM bruxos WHERE id=$1', [id]);

    if (resultado.rowCount == 0) {
      res.status(404).send({ mensagem: `Bruxo com o ID "${id}" não foi encontrado 🧙` });
    } else {
      res.json(resultado.rows[0])
    }
  } catch (error) {
    console.log({ erro: error });
    res.status(500).send({ mensagem: `Erro ao tentar encontrar o bruxo do do ID "${id}"` });
  }
});



// criar novo bruxo

app.post('/bruxos', async (req, res) => {
  try {
    const { nome, idade, casa, habilidade, status_sangue } = req.body;

    let animal = escolherPatrono();

    let tiposDeCasa = [
      'Grifinória',
      'Sonserina',
      'Corvinal',
      'Lufa-Lufa'
    ];

    let tiposDeSangue = [
      'Puro',
      'Mestiço',
      'Trouxa'
    ];

    //verificar se os campos estão preenchidos
    if (nome == '' || idade == '' || casa == '' || habilidade == '' || status_sangue == '') {
      return res.status(422).send({ mensagem: 'Preencha todos os campos para cadastrar um novo bruxo 👻' });
    }

    // verificação da casa
    if (!tiposDeCasa.includes(casa)) {
      res.status(422).send({ mensagem: 'Esse tipo de casa não existe 🏠' });
    }

    // verificação dos tipos de sangue
    if (!tiposDeSangue.includes(status_sangue)) {
      return res.status(422).send({ mensagem: 'Esse tipo de sangue não existe! ☢️' });
    }


    await pool.query('INSERT INTO bruxos (nome, idade, casa, habilidade, status_sangue, patrono) VALUES ($1, $2, $3, $4, $5, $6)', [nome, idade, casa, habilidade, status_sangue, animal]);
    res.status(200).send({ mensagem: 'Sucesso ao Cadastrar um novo Bruxo 🧙' })
  } catch (error) {
    console.error('Erro ao criar bruxo:', error);
    res.status(500).send({ mensagem: 'Obteve FALHA ao tentar cadastrar um novo bruxo', erro: error });
  }
});


// deletar bruxo

app.delete('/bruxos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bruxos WHERE id = $1', [id]);
    res.status(200).send({ mensagem: `Bruxo com o ID ${id} foi DELETADO com SUCESSO 💀` });
  } catch (error) {
    console.log('error:', error);
    res.status(500).send(`Erro ao tentar deletar o bruxo 🧙, ou ele não existe.`)
  }
});



// editar/atualizar bruxo

app.put('/bruxos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, idade, casa, habilidade, status_sangue, patrono } = req.body;

    let tiposDeCasa = [
      'Grifinória',
      'Sonserina',
      'Corvinal',
      'Lufa-Lufa'
    ];

    let tiposDeSangue = [
      'Puro',
      'Mestiço',
      'Trouxa'
    ];

    //verificar se os campos estão preenchidos
    if (nome == '' || idade == '' || casa == '' || habilidade == '' || status_sangue == '') {
      return res.status(400).send({ mensagem: 'Preencha todos os campos para cadastrar um novo bruxo 👻' });
    }

    // verificação da casa
    if (!tiposDeCasa.includes(casa)) {
      return res.status(422).send({ mensagem: 'Esse tipo de casa não existe 🏠' });
    }

    // verificação dos tipos de sangue
    if (!tiposDeSangue.includes(status_sangue)) {
      return res.status(422).send({ mensagem: 'Esse tipo de sangue não existe! ☢️' });
    }

    await pool.query('UPDATE bruxos SET nome = $1, idade = $2, casa = $3, habilidade = $4, status_sangue = $5, patrono = $6 WHERE id = $7', [nome, idade, casa, habilidade, status_sangue, patrono, id]);
    res.status(201).send({ mensagem: 'Bruxo editado com sucesso 🧙' })
  } catch (error) {
    console.log('erorr:', error);
    res.status(500).send({ mensagem: `Falha ao tentar editar/atualizar o bruxo 🕷` });
  }
});



// buscar todas as varinhas

app.get('/varinhas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM varinhas');
    res.json({
      total: resultado.rowCount,
      varinhas: resultado.rows
    })
  } catch (error) {
    console.log({ erro: error });
    res.status(400).send({ mensagem: 'Obteve FALHA na tentativa de buscar todas as varinhas 🌠' });
  }
});



// buscar varinhas por ID

app.get("/varinhas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM varinhas WHERE id=$1', [id]);

    if (resultado.rowCount == 0) {
      res.status(404).send({ mensagem: `Variha com o ID "${id}" não foi encontrado 🔍` });
    } else {
      res.json(resultado.rows[0])
    }
  } catch (error) {
    console.log({ erro: error });
    res.status(500).send({ mensagem: `Erro ao tentar encontrar a varinha do ID "${id}"` });
  }
 });



// cadastrar uma nova varinha

app.post("/varinhas", async (req, res) => {
  try {
    const { material, comprimento, nucleo, data_fabricacao } = req.body;

    if (material == '' || comprimento == '' || nucleo == '' || data_fabricacao == '') {
      res.status(422).send({ mensagem: 'Preencha todos os campos para cadastrar uma nova varinha 👾' });
    }

    await pool.query('INSERT INTO varinhas (material, comprimento, nucleo, data_fabricacao) VALUES ($1, $2, $3, $4)', [material, comprimento, nucleo, data_fabricacao]);
    res.status(200).send({ mensagem: 'Sucesso ao Cadastrar uma nova Varinha ✨' })
  } catch (error) {
    console.error('Erro ao cadastrar a varinha:', error);
    res.status(500).send({ mensagem: 'Obteve FALHA ao tentar cadastrar uma nova varinha', erro: error });
  }
});



// deletar varinha

app.delete("/varinhas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM varinhas WHERE id = $1', [id]);
    res.status(200).send({ mensagem: `Varinha com o ID ${id} foi DELETADO com SUCESSO ☠` });
  } catch (error) {
    console.log('error:', error);
    res.status(500).send(`Erro ao tentar deletar a varinha ✨, ou ela não existe.`)
  }
 });



 // editar/atualizar varinha

 app.put("/varinhas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { material, comprimento, nucleo, data_fabricacao } = req.body;
    
    if (material == '' || comprimento == '' || nucleo == '' || data_fabricacao == '') {
      res.status(422).send({ mensagem: 'Preencha todos os campos para cadastrar uma nova varinha 👾' });
    }

    await pool.query('UPDATE varinhas SET material = $1, comprimento = $2, nucleo = $3, data_fabricacao = $4 WHERE id = $5', [material, comprimento, nucleo, data_fabricacao, id]);
    res.status(201).send({ mensagem: 'Varinha editada com sucesso 🎉' })
  } catch (error) {
    console.log('erorr:', error);
    res.status(500).send({ mensagem: `Falha ao tentar editar a varinha 💩` });
  }
  });

app.get('/', async (req, res) => {
  res.status(200).send({ mensagem: 'SERVER BY RNCHX ONN 👻.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 👻`);
});