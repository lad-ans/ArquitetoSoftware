using System;
using System.Security.Cryptography;
using NerdStore.Core.DomainObjects;

namespace NerdStore.Catalogo.Domain
{
    public class Produto : Entity, IAggregateRoot
    {
        public Produto(string? nome, string? descricao, bool ativo, decimal valor, DateTime dataCadastro, string? imagem, Dimensoes dimensoes, Guid categoriaId)
        {
            Nome = nome;
            Descricao = descricao;
            Ativo = ativo;
            Valor = valor;
            DataCadastro = dataCadastro;
            Imagem = imagem;
            Dimensoes = dimensoes;
            CategoriaId = categoriaId;

            Validar();
        }

        protected Produto()
        {
        }

        public string? Nome { get; private set; }
        public string? Descricao { get; private set; }
        public bool Ativo { get; private set; }
        public decimal Valor { get; private set; }
        public DateTime DataCadastro { get; private set; }
        public string? Imagem { get; private set; }
        public int QuantidadeEstoque { get; private set; }
        public Dimensoes Dimensoes { get; private set; }

        public Guid CategoriaId { get; set; }
        public Categoria? Categoria { get; private set; }

        /// <summary>
        /// Ad hoc setters
        /// </summary>
   
        public void Ativar() => Ativo = true;

        public void Desativar() => Ativo = false;

        public void AlterarCategoria(Categoria categoria)
        {
            CategoriaId = categoria.Id;
            Categoria = categoria;
        }

        public void AlterarDescricao(string descricao)
        {
            Validacoes.ValidarSeVazio(descricao, "O campo Descrição do produto não pode estar vazio");
            Descricao = descricao;
        }

        public void DebitarEstoque(int quantidade)
        {
            if (quantidade < 0) quantidade *= -1;
            if (!PossuiEstoque(quantidade)) throw new DomainException("Estoque insufucuente");
            QuantidadeEstoque -= quantidade;
        }

        public void ReporEstoque(int quantidade)
        {
            QuantidadeEstoque += quantidade;
        }


        public bool PossuiEstoque(int quantidade)
        {
            return QuantidadeEstoque >= quantidade;
        }

        public void Validar() {
            Validacoes.ValidarSeVazio(valor: Nome!, mensagem: "O campo Nome do produto não pode estar vazio");
            Validacoes.ValidarSeVazio(valor: Descricao!, mensagem: "O campo Descricao do produto não pode estar vazio");
            Validacoes.ValidarSeDiferente(object1: CategoriaId, object2: Guid.Empty, mensagem: "O campo Categoria do produto deve ser informado");
            Validacoes.ValidarSeMenorQue(valor: Valor, minimo: 0, mensagem: "O campo Valor do produto não pode ser menor ou igual a 0");
            Validacoes.ValidarSeVazio(valor: Imagem!, mensagem: "O campo Imagem do produto não pode estar vazio");
        }
    }
}


