using CrazyTowers.Model;

namespace CrazyTowers.Persistence;

public interface IPlayerScoreService
{
  Task<int> Delete(int id);
  Task<IEnumerable<PlayerScore?>> FindAll();
  Task<PlayerScore?> FindOne(int id);
  Task<int> Insert(PlayerScore score);
}
