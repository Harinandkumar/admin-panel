
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Event } from "@/lib/types";
import { eventsAPI } from "@/lib/api";
import EventForm from "./EventForm";
import { format } from "date-fns";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventsAPI.getAll();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load events",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const handleCreateEvent = async (event: Event) => {
    try {
      const newEvent = await eventsAPI.create(event);
      setEvents([...events, newEvent]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event",
      });
    }
  };

  const handleUpdateEvent = async (event: Event) => {
    if (!selectedEvent?._id) return;

    try {
      const updatedEvent = await eventsAPI.update(selectedEvent._id, event);
      setEvents(
        events.map((e) => (e._id === selectedEvent._id ? updatedEvent : e))
      );
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      console.error("Failed to update event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event",
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventsAPI.delete(id);
      setEvents(events.filter((e) => e._id !== id));
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm onSubmit={handleCreateEvent} />
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No events found. Create your first event!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event._id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={event.imagelink}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="truncate">{event.name}</CardTitle>
                    <CardDescription>
                      {format(new Date(event.date), "PPP")}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (event._id) handleDeleteEvent(event._id);
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Prize:</span>
                    <span className="text-sm">{event.prize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <span
                      className={`text-sm font-medium ${
                        event.isOpen ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {event.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <div className="w-full text-sm truncate">
                  {event.description.substring(0, 100)}
                  {event.description.length > 100 ? "..." : ""}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventForm event={selectedEvent} onSubmit={handleUpdateEvent} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventList;
