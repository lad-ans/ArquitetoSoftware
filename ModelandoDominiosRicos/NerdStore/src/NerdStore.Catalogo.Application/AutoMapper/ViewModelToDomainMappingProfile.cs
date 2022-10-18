using AutoMapper;
using NerdStore.Catalogo.Application.ViewModels;
using NerdStore.Catalogo.Domain;

namespace NerdStore.Catalogo.Application.AutoMapper
{
    public class ViewModelToDomainMappingProfile : Profile
    {
        public ViewModelToDomainMappingProfile()
        {
            CreateMap<ProdutoViewModel, Produto>()
                .ConstructUsing(ctor: p =>
                    new Produto(
                        p.Nome, p.Descricao, p.Ativo, p.Valor, p.DataCadastro, p.Imagem,
                        new Dimensoes(p.Altura, p.Largura, p.Profundidade), p.CategoriaId));

            CreateMap<CategoriaViewModel, Categoria>()
                .ConstructUsing(ctor: c => new Categoria(c.Nome, c.Codigo));
        }
    }
}

