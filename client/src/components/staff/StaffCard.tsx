import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailIcon, PhoneIcon, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StaffMember } from '@/lib/types';

interface StaffCardProps {
  staff: StaffMember;
  isAdmin?: boolean;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (id: number) => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ 
  staff, 
  isAdmin = false,
  onEdit,
  onDelete
}) => {
  const { 
    id, 
    name, 
    position, 
    email, 
    phone, 
    bio, 
    education, 
    expertise, 
    photoUrl 
  } = staff;

  // Function to handle safe truncation of text
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="p-4 flex-grow">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {photoUrl ? (
              <img 
                src={photoUrl} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">{name}</h3>
            <p className="text-muted-foreground">{position}</p>
            
            <div className="mt-2 flex flex-wrap gap-1">
              {expertise && expertise.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="mr-1 mb-1">
                  {skill}
                </Badge>
              ))}
              {expertise && expertise.length > 3 && (
                <div className="relative group">
                  <Badge variant="outline" className="mr-1 mb-1 cursor-help">
                    +{expertise.length - 3} more
                  </Badge>
                  <div className="absolute bottom-full mb-2 left-0 z-50 hidden group-hover:flex flex-col p-2 bg-popover border rounded-md shadow-md max-w-[200px]">
                    <span className="text-xs font-semibold mb-1">All expertise:</span>
                    <div className="flex flex-wrap gap-1">
                      {expertise.map((skill, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-foreground/80 overflow-auto max-h-60 whitespace-pre-line">{bio}</p>
        </div>

        {education && education.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-1">Education</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {education.slice(0, 2).map((edu, index) => (
                <li key={index}>{edu}</li>
              ))}
              {education.length > 2 && (
                <li className="relative group cursor-help">
                  <span className="underline decoration-dotted">+{education.length - 2} more</span>
                  <div className="absolute bottom-full mb-2 left-0 z-50 hidden group-hover:block p-2 bg-popover border rounded-md shadow-md max-w-[300px]">
                    <span className="text-xs font-semibold mb-2 block">All education:</span>
                    <ul className="text-xs space-y-1">
                      {education.map((edu, index) => (
                        <li key={index} className="border-b border-border/30 last:border-0 pb-1 last:pb-0">{edu}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <CardFooter className="flex flex-col sm:flex-row gap-2 border-t pt-4 bg-muted/30">
        {email && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => window.open(`mailto:${email}`)}
          >
            <MailIcon className="h-4 w-4 mr-2" /> 
            Contact
          </Button>
        )}
        
        {phone && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => window.open(`tel:${phone}`)}
          >
            <PhoneIcon className="h-4 w-4 mr-2" /> 
            Call
          </Button>
        )}

        {isAdmin && (
          <div className="flex gap-2 ml-auto mt-2 sm:mt-0">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(staff)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDelete(id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default StaffCard;