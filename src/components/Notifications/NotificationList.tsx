
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Notification } from "@/lib/types";
import { notificationsAPI } from "@/lib/api";
import NotificationForm from "./NotificationForm";
import { format } from "date-fns";
import { Edit, Plus, Trash2 } from "lucide-react";

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationsAPI.getAll();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notifications",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

  const handleCreateNotification = async (notification: Notification) => {
    try {
      const newNotification = await notificationsAPI.create(notification);
      setNotifications([...notifications, newNotification]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Notification created successfully",
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create notification",
      });
    }
  };

  const handleUpdateNotification = async (notification: Notification) => {
    if (!selectedNotification?._id) return;

    try {
      const updatedNotification = await notificationsAPI.update(
        selectedNotification._id,
        notification
      );
      setNotifications(
        notifications.map((n) =>
          n._id === selectedNotification._id ? updatedNotification : n
        )
      );
      setIsEditDialogOpen(false);
      setSelectedNotification(null);
      toast({
        title: "Success",
        description: "Notification updated successfully",
      });
    } catch (error) {
      console.error("Failed to update notification:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification",
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(notifications.filter((n) => n._id !== id));
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notification",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading notifications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Notification</DialogTitle>
            </DialogHeader>
            <NotificationForm onSubmit={handleCreateNotification} />
          </DialogContent>
        </Dialog>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No notifications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{notification.title}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {notification.date
                      ? format(new Date(notification.date), "PPP")
                      : ""}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t py-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedNotification(notification);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (notification._id)
                      handleDeleteNotification(notification._id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Notification Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <NotificationForm
              notification={selectedNotification}
              onSubmit={handleUpdateNotification}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationList;
