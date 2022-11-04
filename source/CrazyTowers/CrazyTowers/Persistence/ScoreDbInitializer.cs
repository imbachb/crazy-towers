// ------------------------------------------------------------------------------------------
//  <copyright file="ScoreDbInitializer.cs" company="M+F Engineering AG">
//      Copyright (c) M+F Engineering AG. All rights reserved.
//  </copyright>
// ------------------------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;

namespace CrazyTowers.Persistence;

public static class ScoreDbInitializer
{
  /// <summary>
  /// Initializes the database.
  /// </summary>
  /// <param name="serviceProvider">The service provider.</param>
  /// <returns>The async task.</returns>
  public static async Task Initialize(IServiceProvider serviceProvider)
  {
    var context = serviceProvider.GetRequiredService<ScoreDbContext>();
    await context.Database.MigrateAsync();
  }
}
