using NerdStore.WebApp.MVC;
using NerdStore.WebApp.Tests.Config;
using Xunit;

namespace NerdStore.WebApp.Tests
{
    [TestCaseOrderer("NerdStore.WebApp.Tests.Config.PriorityOrderer", "NerdStore.WebApp.Tests.Config")]
    [Collection(nameof(IntegrationWebTestsFixtureCollection))]
    public class UsuarioWebTests
    {
        private readonly IntegrationTestsFixture<StartupWebTests> _testsFixture;

        public UsuarioWebTests(IntegrationTestsFixture<StartupWebTests> testsFixture)
        {
            _testsFixture = testsFixture;
        }

        [Fact(DisplayName = "Realizar Login com Sucesso"), TestPriority(1)]
        [Trait("Categoria", "Integração Web - Usúario")]
        public async Task Usuario_RealizarLogin_DeveExecutarComSucesso()
        {
            // Arrange
            var initialResponse = await _testsFixture.Client.GetAsync("/Identity/Account/Register");
            initialResponse.EnsureSuccessStatusCode();

            var antiForgeryToken = _testsFixture.ObterAntiForgeryToken(await initialResponse.Content.ReadAsStringAsync());

            _testsFixture.GerarUsuarioSenha();

            var formData = new Dictionary<string, string>
            {
                { _testsFixture.AntiForgeryFieldName, antiForgeryToken           },
                { "Input.Email"                     , _testsFixture.UsuarioEmail },
                { "Input.Password"                  , _testsFixture.UsuarioSenha },
                { "Input.ConfirmPassword"           , _testsFixture.UsuarioSenha }
            };

            var postRequest = new HttpRequestMessage(HttpMethod.Post, "/Identity/Account/Register")
            {
                Content = new FormUrlEncodedContent(formData)
            };

            // Act
            var postResponse = await _testsFixture.Client.SendAsync(postRequest);

            // Assert
            var responseString = await postResponse.Content.ReadAsStringAsync();
            postResponse.EnsureSuccessStatusCode();
            Assert.Contains($"Hello {_testsFixture.UsuarioEmail}!", responseString);
        }

        [Fact(DisplayName = "Realizar Login senha fraca"), TestPriority(3)]
        [Trait("Categoria", "Integração Web - Usúario")]
        public async Task Usuario_UsuarioRealizarLoginComSenhaFraca_DeveRetornarMensagemDeErro()
        {
            // Arrange
            var initialResponse = await _testsFixture.Client.GetAsync("/Identity/Account/Register");
            initialResponse.EnsureSuccessStatusCode();

            var antiForgeryToken = _testsFixture.ObterAntiForgeryToken(await initialResponse.Content.ReadAsStringAsync());

            _testsFixture.GerarUsuarioSenha();
            var senhaFraca = "123456";

            var formData = new Dictionary<string, string>
            {
                { _testsFixture.AntiForgeryFieldName, antiForgeryToken           },
                { "Input.Email"                     , _testsFixture.UsuarioEmail },
                { "Input.Password"                  , senhaFraca },
                { "Input.ConfirmPassword"           , senhaFraca }
            };

            var postRequest = new HttpRequestMessage(HttpMethod.Post, "/Identity/Account/Register")
            {
                Content = new FormUrlEncodedContent(formData)
            };

            // Act
            var postResponse = await _testsFixture.Client.SendAsync(postRequest);

            // Assert
            var responseString = await postResponse.Content.ReadAsStringAsync();
            postResponse.EnsureSuccessStatusCode();
            Assert.Contains($"`Password must have at least one non alphanumeric character", responseString);
            Assert.Contains($"`Password must have at least one lowercase (&#x27;a&#x27;-&#x27;z&#x27)", responseString);
            Assert.Contains($"`Password must have at least one uppercase (&#x27;A&#x27;-&#x27;Z&#x27)", responseString);
        }
    }
}
