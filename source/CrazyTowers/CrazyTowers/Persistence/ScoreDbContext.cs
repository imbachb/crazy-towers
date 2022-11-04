using CrazyTowers.Model;
using Microsoft.EntityFrameworkCore;

namespace CrazyTowers.Persistence;

public class ScoreDbContext : DbContext
{
  public ScoreDbContext(DbContextOptions<ScoreDbContext> options)
    : base(options)
  {
  }

  public virtual DbSet<PlayerScore?> PlayerScores { get; set; }
}
