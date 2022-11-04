using CrazyTowers.Persistence;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

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
      services.AddDbContextPool<ScoreDbContext>(options => options
        .UseMySql(
          Configuration.GetConnectionString("ScoreDbConnectionString"),
          mySqlOptions => mySqlOptions.ServerVersion(new Version(10, 5, 4), ServerType.MariaDb)
        )
      );

      services.AddScoped<IPlayerScoreService, PlayerScoreService>();

      services.AddControllers();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      app.UseHttpsRedirection();

      app.UseRouting();

      app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
    }
  }
}
