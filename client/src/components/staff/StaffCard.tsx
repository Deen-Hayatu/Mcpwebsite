import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StaffMember } from "@/lib/types";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Mail,
  Phone,
  ExternalLink,
  Linkedin,
  Twitter,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  ChevronDown
} from "lucide-react";

interface StaffCardProps {
  staff: StaffMember;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

export default function StaffCard({ 
  staff, 
  onEdit, 
  onDelete,
  isAdmin = false
}: StaffCardProps) {
  const { 
    id,
    name,
    position,
    email,
    phone,
    bio,
    education,
    expertise,
    photoUrl,
    socialLinks
  } = staff;

  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const initials = getInitials(name);

  // Format social links object
  const formattedSocialLinks = socialLinks as Record<string, string> || {};

  return (
    <Card className="overflow-hidden transition-all hover:border-accent/50 h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-primary/20 via-transparent to-accent/10 h-8" />
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-background shadow-md -mt-10">
            <AvatarImage src={photoUrl || undefined} alt={name} />
            <AvatarFallback className="bg-primary/20 text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-muted-foreground text-sm">{position}</p>
          </div>
        </div>

        <div className="mb-4 text-sm text-muted-foreground flex-grow">
          <p>{bio}</p>
        </div>

        {/* Expertise */}
        {expertise && expertise.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-1">
              <Award size={16} />
              <h4 className="font-medium text-sm">Expertise</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {expertise.map((item, index) => (
                <Badge key={index} variant="outline" className="bg-secondary/20">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Education (collapsed by default) */}
        {education && education.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full justify-between px-2 py-1 rounded hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  <GraduationCap size={16} />
                  <span>Education</span>
                </div>
                <ChevronDown size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Education</h4>
                <ul className="space-y-1 text-sm">
                  {education.map((edu, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <GraduationCap size={14} className="mt-1 shrink-0" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Contact information */}
        <div className="border-t pt-3 mt-3 space-y-2">
          {email && (
            <div className="flex items-center text-sm gap-2">
              <Mail size={14} className="text-muted-foreground" />
              <a 
                href={`mailto:${email}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {email}
              </a>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center text-sm gap-2">
              <Phone size={14} className="text-muted-foreground" />
              <a 
                href={`tel:${phone}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {phone}
              </a>
            </div>
          )}

          {/* Social links */}
          {Object.keys(formattedSocialLinks).length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {formattedSocialLinks.linkedin && (
                <a 
                  href={formattedSocialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {formattedSocialLinks.twitter && (
                <a 
                  href={formattedSocialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter size={16} />
                </a>
              )}
              {formattedSocialLinks.website && (
                <a 
                  href={formattedSocialLinks.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe size={16} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <div className="border-t mt-3 pt-3 flex justify-end gap-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(staff)}
                className="text-xs px-2 py-1 bg-secondary/30 hover:bg-secondary/50 rounded"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(id)}
                className="text-xs px-2 py-1 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}