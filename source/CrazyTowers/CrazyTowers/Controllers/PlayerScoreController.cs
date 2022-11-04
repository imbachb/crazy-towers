using CrazyTowers.Model;
using CrazyTowers.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace CrazyTowers.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class PlayerScoreController : ControllerBase
  {
    private readonly ILogger<PlayerScoreController> _logger;
    private readonly IPlayerScoreService _playerScoreService;

    public PlayerScoreController(ILogger<PlayerScoreController> logger, IPlayerScoreService playerScoreService)
    {
      _playerScoreService = playerScoreService;
      _logger = logger;
    }

    [HttpGet]
    public async Task<IEnumerable<PlayerScore>> Get()
    {
      return await _playerScoreService.FindAll();
    }

    [HttpGet("Top3", Name = "FindTop3")]
    public async Task<IEnumerable<PlayerScore>> GetTop3()
    {
      return await _playerScoreService.FindTop3();
    }

    [HttpGet("{id}", Name = "FindOne")]
    public async Task<ActionResult<PlayerScore>> Get(int id)
    {
      var result = await _playerScoreService.FindOne(id);
      if (result != default)
        return Ok(result);
      else
        return NotFound();
    }

    [HttpPost]
    public async Task<ActionResult<PlayerScore>> Insert(PlayerScore dto)
    {
      if (dto.Id != null)
      {
        return BadRequest("Id cannot be set for insert action.");
      }

      var id = await _playerScoreService.Insert(dto);
      if (id != default)
        return CreatedAtRoute("FindOne", new { id = id }, dto);
      return BadRequest();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<PlayerScore>> Delete(int id)
    {
      var result = await _playerScoreService.Delete(id);
      if (result > 0)
        return NoContent();
      else
        return NotFound();
    }
  }
}
