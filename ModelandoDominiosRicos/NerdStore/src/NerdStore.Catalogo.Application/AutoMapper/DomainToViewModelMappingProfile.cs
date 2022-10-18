using System;
using AutoMapper;
using NerdStore.Catalogo.Application.ViewModels;
using NerdStore.Catalogo.Domain;

namespace NerdStore.Catalogo.Application.AutoMapper
{
    public class DomainToViewModelMappingProfile : Profile
    {
        public DomainToViewModelMappingProfile()
        {
            CreateMap<Produto, ProdutoViewModel>()
                .ForMember(destinationMember: d => d.Largura, memberOptions: o => o.MapFrom(mapExpression: s => s.Dimensoes.Largura))
                .ForMember(destinationMember: d => d.Altura, memberOptions: o => o.MapFrom(mapExpression: s => s.Dimensoes.Altura))
                .ForMember(destinationMember: d => d.Profundidade, memberOptions: o => o.MapFrom(mapExpression: s => s.Dimensoes.Profundidade));

            CreateMap<Categoria, CategoriaViewModel>();
        }
    }
}

