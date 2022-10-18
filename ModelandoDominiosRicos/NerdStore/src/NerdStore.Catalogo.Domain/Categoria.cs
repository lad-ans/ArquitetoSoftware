using System.Collections;
using NerdStore.Core.DomainObjects;

namespace NerdStore.Catalogo.Domain
{
    public class Categoria : Entity
    {
        protected Categoria()
        {
        }

        public Categoria(string nome, int codigo)
        {
            Nome = nome;
            Codigo = codigo;

            Validar();
        }

        public string? Nome { get; private set; }
        public int? Codigo { get; private set; }

        //EF Relation
        public virtual ICollection<Produto>? Produtos { get; private set; }

        public override string ToString()
        {
            return $"{Nome} - {Codigo}";
        }

        public void Validar()
        {
            Validacoes.ValidarSeVazio(valor: Nome!, mensagem: "O campo Nome do produto não pode estar vazio");
            Validacoes.ValidarSeDiferente(object1: Codigo!, object2: Guid.Empty, mensagem: "O campo Categoria do produto não pode estar vazio");
        }
    }       
}


