type LoadingProps = {
  content: string;
};

export default function Loading({ content }: LoadingProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="w-16 h-16 border-4 border-gradient border-t-transparent rounded-full animate-spin"></div>
      <span className="font-semibold text-gradient text-lg">{content}</span>
    </div>
  );
}
