// -----------------------------------------------------------------------
// <copyright file="Program.cs" company="M+F Engineering AG">
// Copyright (c) M+F Engineering AG. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

using CrazyTowers.Persistence;
using Microsoft.Extensions.Hosting;

namespace CrazyTowers;

/// <summary>
/// The class defining the entry point of the application.
/// </summary>
public static class Program
{
  /// <summary>
  /// Defines the entry point of the application.
  /// </summary>
  /// <param name="args">The arguments.</param>
  /// <returns><c>0</c> if the program terminated successfully, a non-zero value otherwise.</returns>
  public static async Task<int> Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);

    var allowSpecificOrigins = "allowSpecificOrigins";
    builder.Services.AddCors(options =>
    {
      options.AddPolicy(name: allowSpecificOrigins,
        policy =>
        {
          policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
        });
    });

    // Add services to the container
    var startup = new Startup(builder.Configuration);
    startup.ConfigureServices(builder.Services);

    builder.Services.AddControllers();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var app = builder.Build();
    app.UseCors(allowSpecificOrigins);

    startup.Configure(app, app.Environment);

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
      app.UseSwagger();
      app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();
    app.MapControllers();

    using (var scope = app.Services.CreateScope())
    {
      var services = scope.ServiceProvider;
      await ScoreDbInitializer.Initialize(services);
    }

    await app.RunAsync();

    return 0;
  }
}
