interface AuthContainerProps {
  children: React.ReactNode;
}

export default function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="m-auto bg-cream-light rounded-3xl p-15 flex flex-col items-center gap-7 text-black">
      {children}
    </div>
  );
}
