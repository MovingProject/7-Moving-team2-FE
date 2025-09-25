interface CardTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function CardText({ children, className }: CardTextProps) {
  return <p className={className}>{children}</p>;
}
