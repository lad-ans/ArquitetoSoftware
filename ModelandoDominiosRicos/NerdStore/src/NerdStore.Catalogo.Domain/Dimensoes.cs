using System;
using NerdStore.Core.DomainObjects;

namespace NerdStore.Catalogo.Domain
{
    public class Dimensoes
    {
        public Dimensoes(decimal altura, decimal largura, decimal profundidade)
        {
            Validacoes.ValidarSeMenorQue(valor: altura, minimo: 1,  mensagem: "O campo Altura do produto não pode ser menor que 0");
            Validacoes.ValidarSeMenorQue(valor: largura, minimo: 1, mensagem: "O campo Largura do produto não pode ser menor que 0");
            Validacoes.ValidarSeMenorQue(valor: profundidade, minimo: 1, mensagem: "O Profundidade Nome do produto não pode ser menor que 0");

            Altura = altura;
            Largura = largura;
            Profundidade = profundidade;
        }

        public decimal Altura { get; private set; }
        public decimal Largura { get; private set; }
        public decimal Profundidade { get; private set; }

        public string DescricaoFormatada()
        {
            return $"LxAxP: {Largura} x {Altura} x {Profundidade}";
        }

        public override string ToString()
        {
            return DescricaoFormatada();
        }
    }
}

