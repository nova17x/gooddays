export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">
        <span role="img" aria-label="太陽">
          &#x2600;&#xFE0F;
        </span>
      </div>
      <p className="text-text-muted text-lg">
        今日あった良いことを書いてみましょう
      </p>
      <p className="text-text-light text-sm mt-1">
        どんな小さなことでも大丈夫です
      </p>
    </div>
  );
}
