namespace NerdStore.WebApp.MVC
{
    public static class StartupExtensions
    {
        public static WebApplicationBuilder UseStartup<TStartup>(this WebApplicationBuilder webAppBuilder) where TStartup : IStartup
        {
            var startup = Activator.CreateInstance(typeof(TStartup), webAppBuilder.Configuration) as IStartup;
            if (startup == null) throw new ArgumentException("Classe Startup.cs inválida");

            // Verificando ambiente

            if (!(startup is Startup))
            {
                webAppBuilder.Configuration
                    .SetBasePath(webAppBuilder.Environment.ContentRootPath)
                    .AddJsonFile("appsettings.json", true, true)
                    .AddJsonFile($"appsettings.{webAppBuilder.Environment.EnvironmentName}.json", true, true)
                    .AddEnvironmentVariables();
            }

            startup.ConfigureServices(webAppBuilder.Services);
            var app = webAppBuilder.Build();
            startup.Configure(app, app.Environment);

            app.Run();

            return webAppBuilder;
        }
    }
}
