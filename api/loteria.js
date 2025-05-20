export default async function handler(req, res) {
  const { nome, concurso } = req.query;

  if (!nome) {
    return res.status(400).json({ erro: "Parâmetro 'nome' da loteria é obrigatório." });
  }

  let url = `https://servicebus2.caixa.gov.br/portaldeloterias/api/${nome}`;
  if (concurso) {
    url += `/${concurso}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      },
    });

    const status = response.status;

    if (status !== 200) {
      return res.status(status).json({ erro: `Erro ao acessar API da Caixa (${status})` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno ao acessar a API", detalhe: err.message });
  }
}
