using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NerdStore.Catalogo.Application.AutoMapper;
using NerdStore.Catalogo.Data;
using NerdStore.Vendas.Data;
using NerdStore.Pagamentos.Data;
using NerdStore.WebApp.MVC.Data;
using NerdStore.WebApp.MVC.Setup;

var builder = WebApplication.CreateBuilder(args);

//"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=NerdStoreDb;Trusted_Connection=True;MultipleActiveResultSets=true"
//"Server=localhost, 1433;Database=NerdStoreDb;User ID=sa;Password=1q2w3e4r@#$;Trusted_Connection=True;MultipleActiveResultSets=true"

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<CatalogoContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<VendasContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<PagamentoContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

// AutoMapper
builder.Services.AddAutoMapper(
    typeof(DomainToViewModelMappingProfile),
    typeof(ViewModelToDomainMappingProfile)
);

// MediatR
builder.Services.AddMediatR(typeof(Program));

// DI
builder.Services.RegisterServices();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Vitrine}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();

