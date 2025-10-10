// Rating update button component
// This component provides a button to manually trigger rating updates in the admin panel

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface RatingUpdateButtonProps {
  className?: string;
}

const RatingUpdateButton: React.FC<RatingUpdateButtonProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRatings = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ratings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Player ratings updated successfully!',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to update player ratings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update player ratings: ' + (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleUpdateRatings} 
      disabled={isLoading}
      className={className}
      variant="outline"
    >
      {isLoading ? 'Updating...' : 'Update Ratings'}
    </Button>
  );
};

export default RatingUpdateButton;