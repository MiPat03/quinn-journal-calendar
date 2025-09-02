function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else {
      stars.push(<span key={i} className="star">☆</span>);
    }
  }
  return <div className="star-row">{stars}</div>;
}

export default StarRating;
