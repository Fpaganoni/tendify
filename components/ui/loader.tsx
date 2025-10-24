type LoadingProps = {
  content: string;
};

export function Loader({ content }: LoadingProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="w-16 h-16 border-4 border-spinner border-t-transparent rounded-full animate-spin"></div>
      <span className="font-semibold text-spinner text-lg">{content}</span>
    </div>
  );
}
