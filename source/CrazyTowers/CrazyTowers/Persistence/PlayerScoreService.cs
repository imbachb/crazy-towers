using CrazyTowers.Model;
using Microsoft.EntityFrameworkCore;

namespace CrazyTowers.Persistence;

public class PlayerScoreService : IPlayerScoreService
{
  private readonly ScoreDbContext _dbContext;

  public PlayerScoreService(ScoreDbContext dbContext)
  {
    _dbContext = dbContext;
  }

  public async Task<int> Delete(int id)
  {
    try
    {
      _dbContext.PlayerScores.Remove(
        new PlayerScore
        {
          Id = id
        }
      );

      return await _dbContext.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      return 0;
    }
  }

  public async Task<IEnumerable<PlayerScore?>> FindAll()
  {
    return await _dbContext.PlayerScores.ToListAsync();
  }

  public async Task<IEnumerable<PlayerScore?>> FindTop3()
  {
    return await _dbContext.PlayerScores.OrderByDescending(x => x.Score).Take(3).ToListAsync();
  }

  public async Task<PlayerScore?> FindOne(int id)
  {
    return await _dbContext.PlayerScores.FirstOrDefaultAsync(x => x.Id == id);
  }

  public async Task<int> Insert(PlayerScore score)
  {
    _dbContext.Add(score);
    return await _dbContext.SaveChangesAsync();
  }
}
