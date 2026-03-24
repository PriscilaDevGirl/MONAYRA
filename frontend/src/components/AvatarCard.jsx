export function AvatarCard({ candidate }) {
  return (
    <article className="avatar-card">
      <div className="avatar-card__visual">
        <div className="cat-avatar">
          <span className="cat-avatar__ear cat-avatar__ear--left" />
          <span className="cat-avatar__ear cat-avatar__ear--right" />
          <span className="cat-avatar__face" />
          <span className="cat-avatar__badge">{candidate.mood}</span>
        </div>
      </div>
      <div className="avatar-card__body">
        <p className="eyebrow">{candidate.palette}</p>
        <h3>{candidate.name}</h3>
        <p className="avatar-card__role">{candidate.role}</p>
        <p className="avatar-card__summary">{candidate.summary}</p>
        <div className="chip-row">
          {candidate.skills.map((skill) => (
            <span className="chip" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="score-pill">{candidate.score}% match</div>
    </article>
  );
}
