SELECT *
  FROM [NerdStoreDb].[dbo].[Categorias]

    declare @Id UNIQUEIDENTIFIER = newid();

  insert into [dbo].[Categorias](Id, Nome, Codigo) 
    values(@Id, 'Bone', 3)

    select @Id
    SELECT * from [dbo].[Categorias]