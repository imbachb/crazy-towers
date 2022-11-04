export class PlayerScore {
  id?: number | undefined = undefined;
  name = '';
  email = '';
  score = 0;
  hasNewsletter = false;
  school = '';

  constructor(guest: Partial<PlayerScore>) {
    Object.assign(this, guest);
  }
}
