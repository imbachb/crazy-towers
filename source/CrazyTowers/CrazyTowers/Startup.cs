using CrazyTowers.Persistence;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

namespace CrazyTowers
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddDbContext<ScoreDbContext>(options =>
      {
        var connectionString = this.Configuration["ConnectionStrings:ScoreDbConnectionString"];
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
      });

      services.AddScoped<IPlayerScoreService, PlayerScoreService>();

      services.AddControllers();

      services.AddSpaStaticFiles(config => this.Configuration.GetSection("Spa").Bind(config));
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseSpaStaticFiles(new StaticFileOptions { HttpsCompression = HttpsCompressionMode.Compress });
      }

      app.UseHttpsRedirection();

      app.UseRouting();

      app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

      app.UseSpa(spa => { });
    }
  }
}
