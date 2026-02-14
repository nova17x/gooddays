export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-6 animate-float filter drop-shadow-sm">
        <span role="img" aria-label="太陽">
          ☀️
        </span>
      </div>
      <h3 className="text-xl font-medium text-text mb-2 text-center">
        今日はどんな一日でしたか？
      </h3>
      <p className="text-text-muted text-sm text-center max-w-xs leading-relaxed">
        些細なことでも、嬉しかったことや気づいたことを書き留めてみましょう。
      </p>
    </div>
  );
}
