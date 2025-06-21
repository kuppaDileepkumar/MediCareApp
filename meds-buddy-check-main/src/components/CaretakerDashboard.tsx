import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Calendar } from "@/components/ui/calendar";
import {
  Users, Bell, Calendar as CalendarIcon, Mail,
  AlertTriangle, Check, Camera
} from "lucide-react";
import { format, subDays, isToday, isBefore, startOfDay } from "date-fns";

const CaretakerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [adherenceRate, setAdherenceRate] = useState(85);
  const [currentStreak, setCurrentStreak] = useState(5);
  const [missedDoses, setMissedDoses] = useState(3);
  const [recentActivity, setRecentActivity] = useState([
    { date: "2024-06-10", taken: true, time: "8:30 AM", hasPhoto: true },
    { date: "2024-06-09", taken: true, time: "8:15 AM", hasPhoto: false },
    { date: "2024-06-08", taken: false, time: null, hasPhoto: false },
    { date: "2024-06-07", taken: true, time: "8:45 AM", hasPhoto: true },
    { date: "2024-06-06", taken: true, time: "8:20 AM", hasPhoto: false },
  ]);

  const patientName = "Eleanor Thompson";

  const takenDates = new Set(
    recentActivity.filter(a => a.taken).map(a => a.date)
  );

  const dailyMedication = {
    name: "Daily Medication Set",
    time: "8:00 AM",
    status: takenDates.has(format(new Date(), 'yyyy-MM-dd')) ? "completed" : "pending"
  };

  const handleSendReminderEmail = () => {
    alert("Reminder email sent to " + patientName);
  };

  const handleConfigureNotifications = () => {
    setActiveTab("notifications");
  };

  const handleViewCalendar = () => {
    setActiveTab("calendar");
  };

  // Simulate real-time update of recentActivity every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = format(subDays(new Date(), Math.floor(Math.random() * 7)), 'yyyy-MM-dd');
      setRecentActivity(prev => {
        if (prev.some(act => act.date === newDate)) return prev;
        const newEntry = {
          date: newDate,
          taken: Math.random() > 0.3,
          time: "8:00 AM",
          hasPhoto: Math.random() > 0.5,
        };
        const updated = [newEntry, ...prev].slice(0, 7);
        const takenCount = updated.filter(a => a.taken).length;
        const missedCount = updated.filter(a => !a.taken).length;
        setAdherenceRate(Math.floor((takenCount / updated.length) * 100));
        setMissedDoses(missedCount);
        setCurrentStreak(updated.every(a => a.taken) ? updated.length : 0);
        return updated;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
            <p className="text-white/90 text-lg">Monitoring {patientName}'s medication adherence</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatBox title="Adherence Rate" value={`${adherenceRate}%`} />
          <StatBox title="Current Streak" value={currentStreak} />
          <StatBox title="Missed This Month" value={missedDoses} />
          <StatBox title="Taken This Week" value={recentActivity.filter(a => a.taken).length} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-blue-600" />Today's Status</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{dailyMedication.name}</h4>
                    <p className="text-sm text-muted-foreground">{dailyMedication.time}</p>
                  </div>
                  <Badge variant={dailyMedication.status === "pending" ? "destructive" : "secondary"}>{dailyMedication.status === "pending" ? "Pending" : "Completed"}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <ActionButton icon={<Mail className="w-4 h-4 mr-2" />} text="Send Reminder Email" onClick={handleSendReminderEmail} />
                <ActionButton icon={<Bell className="w-4 h-4 mr-2" />} text="Configure Notifications" onClick={handleConfigureNotifications} />
                <ActionButton icon={<CalendarIcon className="w-4 h-4 mr-2" />} text="View Full Calendar" onClick={handleViewCalendar} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Monthly Adherence Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm"><span>Overall Progress</span><span>{adherenceRate}%</span></div>
                <Progress value={adherenceRate} className="h-3" />
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <StatSubBox title="Taken" value="22 days" color="text-green-600" />
                  <StatSubBox title="Missed" value={`${missedDoses} days`} color="text-red-600" />
                  <StatSubBox title="Remaining" value="5 days" color="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader><CardTitle>Recent Medication Activity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.taken ? 'bg-green-100' : 'bg-red-100'}`}>
                      {activity.taken ? <Check className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{format(new Date(activity.date), 'EEEE, MMMM d')}</p>
                      <p className="text-sm text-muted-foreground">{activity.taken ? `Taken at ${activity.time}` : 'Medication missed'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.hasPhoto && <Badge variant="outline"><Camera className="w-3 h-3 mr-1" />Photo</Badge>}
                    <Badge variant={activity.taken ? "secondary" : "destructive"}>{activity.taken ? "Completed" : "Missed"}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader><CardTitle>Medication Calendar Overview</CardTitle></CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                modifiersClassNames={{ selected: "bg-blue-600 text-white hover:bg-blue-700" }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isTaken = takenDates.has(dateStr);
                    const isPast = isBefore(date, startOfDay(new Date()));
                    const isCurrentDay = isToday(date);
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {isTaken && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div>}
                        {!isTaken && isPast && !isCurrentDay && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full" />}
                      </div>
                    );
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
            <CardContent>
              <p>Configure notification preferences here (coming soon).</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatBox = ({ title, value }: { title: string, value: string | number }) => (
  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-white/80">{title}</div>
  </div>
);

const StatSubBox = ({ title, value, color }: { title: string, value: string, color: string }) => (
  <div>
    <div className={`font-medium ${color}`}>{value}</div>
    <div className="text-muted-foreground">{title}</div>
  </div>
);

const ActionButton = ({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick: () => void }) => (
  <Button className="w-full justify-start" variant="outline" onClick={onClick}>
    {icon}{text}
  </Button>
);

export default CaretakerDashboard;
