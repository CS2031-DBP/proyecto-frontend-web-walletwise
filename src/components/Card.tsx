type CardProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
  };
  
  const Card = ({ title, children, className = "" }: CardProps) => {
    return (
      <div className={`bg-white border rounded-lg p-4 shadow ${className}`}>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {children}
      </div>
    );
  };
  
  export default Card;
  

