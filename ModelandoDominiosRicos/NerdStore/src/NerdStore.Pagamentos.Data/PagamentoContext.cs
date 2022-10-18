using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using NerdStore.Core.Communication.Mediator;
using NerdStore.Core.Data;
using NerdStore.Core.Messages;
using NerdStore.Pagamentos.Business;

namespace NerdStore.Pagamentos.Data;

public class PagamentoContext : DbContext, IUnitOfWork
{

    public PagamentoContext(DbContextOptions<PagamentoContext> options)
    : base(options)
    {
    }

    public PagamentoContext(DbContextOptions<PagamentoContext> options, IMediatorHandler rebusHandler)
        : base(options)
    {
        _mediatorHandler = rebusHandler ?? throw new ArgumentNullException(nameof(rebusHandler));
    }

    private readonly IMediatorHandler? _mediatorHandler;
    public DbSet<Pagamento>? Pagamentos { get; set; }
    public DbSet<Transacao>? Transacoes { get; set; }


    public async Task<bool> Commit()
    {
        foreach (var entry in ChangeTracker.Entries().Where(entry => entry.Entity.GetType().GetProperty("DataCadastro") != null))
        {
            if (entry.State == EntityState.Added)
            {
                entry.Property("DataCadastro").CurrentValue = DateTime.Now;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Property("DataCadastro").IsModified = false;
            }
        }

        var sucesso = await base.SaveChangesAsync() > 0;
        if (sucesso) await _mediatorHandler.PublicarEventos(this);

        return sucesso;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        /// <summary>
        /// O foreach abaixo pega todas as entidades mapeadas, verifica quais as propriedades são
        /// do tipo "string" e mapear automaticamente o tipo da coluna como "varchar(100)" caso
        /// a coluna já não tenha uma especificação diferente. Isso por motivos de segurança, impedindo
        /// a criação de uma coluna como "NVARCHAR(MAX)"
        /// </summary>
        foreach (var property in modelBuilder.Model.GetEntityTypes().SelectMany(
            e => e.GetProperties().Where(p => p.ClrType == typeof(string))))
        {
            property.SetColumnType("varchar(100)");
        }

        // Ignore é para ignorar o Event pois ele não deve ser persistido na base
        modelBuilder.Ignore<Event>();

        // Vai buscar todas as entidades e seus mappings via "reflection" apenas um vez
        // e irá configrar para que siga as configurações feitas nos mappings
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PagamentoContext).Assembly);

        foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys())) relationship.DeleteBehavior = DeleteBehavior.ClientSetNull;
        base.OnModelCreating(modelBuilder);
    }

    public class PagamentoContextFactory : IDesignTimeDbContextFactory<PagamentoContext>
    {
        public PagamentoContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<PagamentoContext>();
            optionsBuilder.UseSqlServer(connectionString: "Server=localhost, 1433;Database=NerdStoreDb;User ID=sa;Password=1q2w3e4r@#$;Integrated Security=false;Trusted_Connection=false;MultipleActiveResultSets=true");

            return new PagamentoContext(optionsBuilder.Options);
        }
    }
}
