import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import StatCards from "./StatCards";
import TrendChart from "./TrendChart";
import DistributionChart from "./DistributionChart";
import { reportsAPI } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReportDashboard: React.FC = () => {
  const [stats, setStats] = useState(null);
  const [eventTrend, setEventTrend] = useState([]);
  const [userTrend, setUserTrend] = useState([]);
  const [branchDistribution, setBranchDistribution] = useState([]);
  const [batchDistribution, setBatchDistribution] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Define colors for charts
  const branchColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
  const batchColors = ["#3b82f6", "#10b981", "#f59e0b"];

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data concurrently
        const [statsData, eventTrendData, userTrendData, branchData, batchData] = await Promise.all([
          reportsAPI.getStats(),
          reportsAPI.getEventTrend(),
          reportsAPI.getUserTrend(),
          reportsAPI.getUserBranches(),
          reportsAPI.getUserBatches()
        ]);
        
        setStats(statsData);
        setEventTrend(eventTrendData);
        setUserTrend(userTrendData);
        
        // Transform branch data for pie chart
        const branchChartData = branchData.map(item => ({
          name: item.branch || 'Unknown',
          value: item.count
        }));
        setBranchDistribution(branchChartData);
        
        // Transform batch data for pie chart
        const batchChartData = batchData.map(item => ({
          name: item.batch || 'Unknown',
          value: item.count
        }));
        setBatchDistribution(batchChartData);
        
      } catch (error) {
        console.error("Failed to fetch report data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load report data"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportData();
  }, [toast]);
  
  if (isLoading) {
    return <div className="text-center py-10">Loading reports...</div>;
  }
  
  if (!stats) {
    return <div className="text-center py-10">No report data available</div>;
  }
  
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Reports</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <StatCards stats={stats} />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <TrendChart 
            data={eventTrend} 
            title="Event Creation Trend" 
            color="#3b82f6" // blue
          />
          <TrendChart 
            data={userTrend} 
            title="User Registration Trend" 
            color="#10b981" // green
          />
        </TabsContent>
        
        <TabsContent value="distribution" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DistributionChart 
            data={branchDistribution}
            title="Users by Branch"
            colors={branchColors}
          />
          <DistributionChart 
            data={batchDistribution}
            title="Users by Batch"
            colors={batchColors}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDashboard; 