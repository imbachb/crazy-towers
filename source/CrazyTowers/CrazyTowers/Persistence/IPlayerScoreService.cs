using CrazyTowers.Model;

namespace CrazyTowers.Persistence;

public interface IPlayerScoreService
{
  Task<int> Delete(int id);
  Task<IEnumerable<PlayerScore?>> FindAll();
  Task<IEnumerable<PlayerScore?>> FindTop3();
  Task<PlayerScore?> FindOne(int id);
  Task<int> Insert(PlayerScore score);
  Task<PlayerScore?> UpdateScore(PlayerScore playerScore);
}
