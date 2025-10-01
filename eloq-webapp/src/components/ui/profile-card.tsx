import { ComponentPropsWithoutRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type ProfileCardProps = {
  name: string;
  title?: string;
  description?: string;
  avatar?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
} & ComponentPropsWithoutRef<"div">;

export default function ProfileCard({
  name,
  title,
  description,
  avatar,
  footer,
  children,
  ...rest
}: ProfileCardProps) {
  return (
    <Card {...rest} className="overflow-hidden shadow-lg w-full max-w-xs">
      <div className="flex flex-col h-full">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {avatar ? (
                <img
                  className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                  src={avatar}
                  alt={name}
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">{name}</h2>
              {title && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{title}</p>}
              {description && (
                <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{description}</p>
              )}
            </div>
          </div>
        </CardHeader>
        {children && (
          <CardContent className="flex-1 px-4 pb-3">
            {children}
          </CardContent>
        )}
        {footer && (
          <CardFooter className="pt-2 px-4 pb-3">
            {footer}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}