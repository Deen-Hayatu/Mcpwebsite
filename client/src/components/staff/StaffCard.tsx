import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook, 
  Mail, 
  Phone, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award 
} from "lucide-react";
import type { StaffMember } from "@shared/schema";

type StaffCardProps = {
  staff: StaffMember;
  isAdmin?: boolean;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (id: number) => void;
};

export default function StaffCard({ staff, isAdmin, onEdit, onDelete }: StaffCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Helper function to get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Map of social media icons
  const socialIcons: Record<string, JSX.Element> = {
    linkedin: <Linkedin className="h-4 w-4 text-[#0077B5]" />,
    twitter: <Twitter className="h-4 w-4 text-[#1DA1F2]" />,
    facebook: <Facebook className="h-4 w-4 text-[#4267B2]" />,
    instagram: <Instagram className="h-4 w-4 text-[#E1306C]" />
  };
  
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={staff.photoUrl || ""} alt={staff.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(staff.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{staff.name}</CardTitle>
              <CardDescription className="text-sm font-medium text-primary/80">
                {staff.position}
                {staff.isFeatured && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Award className="h-4 w-4 ml-1 inline-block text-yellow-500" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-52">
                      <p className="text-xs">Featured team member</p>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </CardDescription>
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit?.(staff)}
              >
                Edit
              </Button>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Staff Member</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete {staff.name}? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        onDelete?.(staff.id);
                        setShowDeleteDialog(false);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground line-clamp-3 mb-2">
          {staff.bio}
        </div>
        
        {staff.expertise && staff.expertise.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium mb-1">Areas of Expertise:</p>
            <div className="flex flex-wrap gap-1">
              {staff.expertise.slice(0, showDetails ? undefined : 3).map((skill, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-secondary/30">
                  {skill}
                </Badge>
              ))}
              {!showDetails && staff.expertise.length > 3 && (
                <Badge variant="outline" className="text-xs bg-secondary/10">
                  +{staff.expertise.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {showDetails && (
          <>
            {staff.education && staff.education.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium mb-1">Education:</p>
                <ul className="text-xs text-muted-foreground pl-4 list-disc">
                  {staff.education.map((edu, i) => (
                    <li key={i}>{edu}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {staff.publications && staff.publications.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium mb-1">Selected Publications:</p>
                <ul className="text-xs text-muted-foreground pl-4 list-disc">
                  {staff.publications.map((pub, i) => (
                    <li key={i}>{pub}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {staff.email && (
              <div className="flex items-center gap-2 mt-3">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <a 
                  href={`mailto:${staff.email}`} 
                  className="text-xs text-primary hover:underline"
                >
                  {staff.email}
                </a>
              </div>
            )}
            
            {staff.phone && (
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <a 
                  href={`tel:${staff.phone}`} 
                  className="text-xs text-primary hover:underline"
                >
                  {staff.phone}
                </a>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col pt-0">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-1">
            {staff.socialLinks && Object.entries(staff.socialLinks as Record<string, string>).map(([platform, url]) => (
              socialIcons[platform] && (
                <a 
                  key={platform}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  {socialIcons[platform]}
                </a>
              )
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs flex items-center gap-1 p-0 h-auto"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                Show Less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}