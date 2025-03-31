
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notification } from "@/lib/types";

const notificationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type FormData = z.infer<typeof notificationSchema>;

interface NotificationFormProps {
  notification?: Notification;
  onSubmit: (data: Notification) => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  notification,
  onSubmit,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: notification
      ? {
          title: notification.title,
          message: notification.message,
        }
      : {
          title: "",
          message: "",
        },
  });

  const handleSubmit = (data: FormData) => {
    // Ensure all required fields are properly set when submitting
    const notificationData: Notification = {
      title: data.title, // explicitly assign title
      message: data.message, // explicitly assign message
      date: notification?.date || new Date().toISOString(),
    };
    
    onSubmit(notificationData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter notification title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter notification message"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            {notification ? "Update Notification" : "Create Notification"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NotificationForm;
