import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Bell, Check, Clock, Award } from "lucide-react";

interface StatsProps {
  stats: {
    users: {
      total: number;
      verified: number;
      unverified: number;
    };
    events: {
      total: number;
      active: number;
      completed: number;
      withResults: number;
    };
    notifications: {
      total: number;
    };
  };
}

const StatCards: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Users Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users.total}</div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground flex items-center">
              <Check className="h-3 w-3 mr-1 text-green-500" />
              <span>{stats.users.verified} verified</span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1 text-yellow-500" />
              <span>{stats.users.unverified} pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.events.total}</div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1 text-blue-500" />
              <span>{stats.events.active} active</span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <Check className="h-3 w-3 mr-1 text-green-500" />
              <span>{stats.events.completed} completed</span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <Award className="h-3 w-3 mr-1 text-purple-500" />
              <span>{stats.events.withResults} with results</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.notifications.total}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Total notifications sent
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards; 