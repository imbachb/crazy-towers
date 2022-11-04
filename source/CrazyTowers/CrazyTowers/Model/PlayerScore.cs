namespace CrazyTowers.Model;

public class PlayerScore
{
    public int? Id { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public int Score { get; set; }

    public bool HasNewsletter { get; set; }

    public string? School { get; set; }
}
