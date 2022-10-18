using System;
using NerdStore.Core.DomainObjects;
using Xunit;

namespace NerdStore.Catalogo.Domain.Tests
{
    public class ProdutoTests
    {
        [Fact]
        public void Produto_Validar_ValidacoesDevemRetornarExceptions()
        {
            // Arrange & Act & Assert

            var ex = Assert.Throws<DomainException>(testCode: () =>
                new Produto(nome: String.Empty, descricao: "Descrição", ativo: false, valor: 1209, dataCadastro: DateTime.Now, imagem: "https://...", dimensoes: new Dimensoes(altura: 2, largura: 3, profundidade: 4), categoriaId: Guid.NewGuid())
            );

            Assert.Equal(expected: "O campo Nome do produto não pode estar vazio", actual: ex.Message);

            ex = Assert.Throws<DomainException>(testCode: () =>
                new Produto(nome: "Nome", descricao: String.Empty, ativo: false, valor: 1209, dataCadastro: DateTime.Now, imagem: "https://...", dimensoes: new Dimensoes(altura: 2, largura: 3, profundidade: 4), categoriaId: Guid.NewGuid())
            );

            Assert.Equal(expected: "O campo Descricao do produto não pode estar vazio", actual: ex.Message);

            ex = Assert.Throws<DomainException>(testCode: () =>
                new Produto(nome: "Nome", descricao: "Descrição", ativo: false, valor: 0, dataCadastro: DateTime.Now, imagem: "https://...", dimensoes: new Dimensoes(altura: 2, largura: 3, profundidade: 4), categoriaId: Guid.NewGuid())
            );

            Assert.Equal(expected: "O campo Valor do produto não pode ser menor ou igual a 0", actual: ex.Message);

            ex = Assert.Throws<DomainException>(testCode: () =>
                new Produto(nome: "Nome", descricao: "Descrição", ativo: false, valor: 780, dataCadastro: DateTime.Now, imagem: "https://...", dimensoes: new Dimensoes(altura: 2, largura: 3, profundidade: 4), categoriaId: Guid.Empty)
            );

            Assert.Equal(expected: "O campo Categoria do produto deve ser informado", actual: ex.Message);

            ex = Assert.Throws<DomainException>(testCode: () =>
                new Produto(nome: "Nome", descricao: "Descrição", ativo: false, valor: 1209, dataCadastro: DateTime.Now, imagem: String.Empty, dimensoes: new Dimensoes(altura: 2, largura: 3, profundidade: 4), categoriaId: Guid.NewGuid())
            );

            Assert.Equal(expected: "O campo Imagem do produto não pode estar vazio", actual: ex.Message);
        }
    }
}

