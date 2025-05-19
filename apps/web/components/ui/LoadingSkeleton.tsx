export default function LoadingSkeleton() {
  return (
    <div
      style={{
        backgroundColor: '#eee',
        height: '1em',
        width: '100%',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    />
  );
}
